import Command from '../../base'
import {flags} from '@oclif/command'
import cli from 'cli-ux'
import chalk from 'chalk'
import * as utils from '../../utils'
import jp from 'jsonpath'
import * as chrono from 'chrono-node'

export default class ScheduleRender extends Command {
  static description = 'Render a PagerDuty Schedule'

  static flags = {
    ...Command.flags,
    id: flags.string({
      char: 'i',
      description: 'Render the schedule with this ID.',
      exclusive: ['email', 'me'],
    }),
    name: flags.string({
      char: 'n',
      description: 'Render the schedule with this name.',
      exclusive: ['id'],
    }),
    since: flags.string({
      description: 'The start of the date range over which you want to search.',
    }),
    until: flags.string({
      description: 'The end of the date range over which you want to search.',
    }),
    keys: flags.string({
      char: 'k',
      description: 'Additional fields to display. Specify multiple times for multiple fields.',
      multiple: true,
    }),
    json: flags.boolean({
      char: 'j',
      description: 'output full details as JSON',
      exclusive: ['columns', 'filter', 'sort', 'csv', 'extended'],
    }),
    delimiter: flags.string({
      char: 'd',
      description: 'Delimiter for fields that have more than one value',
      default: '\n',
    }),
    ...cli.table.flags(),
  }

  async run() {
    const {flags} = this.parse(ScheduleRender)

    const params: Record<string, any> = {}

    let scheduleID
    if (flags.id) {
      if (utils.invalidPagerDutyIDs([flags.id]).length > 0) {
        this.error(`${chalk.bold.blue(flags.id)} is not a valid PagerDuty schedule ID`, {exit: 1})
      }
      scheduleID = flags.id
    } else if (flags.name) {
      cli.action.start(`Finding PD schedule ${chalk.bold.blue(flags.name)}`)
      scheduleID = await this.pd.scheduleIDForName(flags.name)
      if (!scheduleID) {
        cli.action.stop(chalk.bold.red('failed!'))
        this.error(`No schedule or multiple schedules found with the name "${flags.name}"`, {exit: 1})
      }
    } else {
      this.error('You must specify one of: -i, -n', {exit: 1})
    }

    if (flags.since) {
      const since = chrono.parseDate(flags.since)
      if (since) {
        params.since = since.toISOString()
      }
    }
    if (flags.until) {
      const until = chrono.parseDate(flags.until)
      if (until) {
        params.until = until.toISOString()
      }
    }

    cli.action.start(`Getting schedule ${chalk.bold.blue(scheduleID)}`)
    const r = await this.pd.request({
      endpoint: `schedules/${scheduleID}`,
      method: 'GET',
      params: params,
    })
    cli.action.stop(chalk.bold.green('done'))
    const schedule = r.getData().schedule

    const options = {
      printLine: this.log,
      ...flags, // parsed flags
    }

    if (flags.json) {
      await utils.printJsonAndExit(schedule.final_schedule.rendered_schedule_entries)
    }

    const columns: Record<string, object> = {
      start: {
        get: (row: any) => row.start ? (new Date(row.start)).toLocaleString() : '',
      },
      end: {
        get: (row: any) => row.end ? (new Date(row.end)).toLocaleString() : '',
      },
      duration: {
        get: (row: any) => utils.scheduleRotationSecondsToHuman(((new Date(row.end).getTime()) - (new Date(row.start).getTime())) / 1000),
      },
      user_id: {
        get: (row: any) => row.user.id,
      },
      user_name: {
        get: (row: any) => row.user.summary,
      },
    }

    if (flags.keys) {
      for (const key of flags.keys) {
        columns[key] = {
          header: key,
          get: (row: any) => utils.formatField(jp.query(row, key), flags.delimiter),
        }
      }
    }

    cli.table(schedule.final_schedule.rendered_schedule_entries, columns, options)
  }
}
