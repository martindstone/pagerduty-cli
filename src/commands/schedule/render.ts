import { AuthenticatedBaseCommand } from '../../base/authenticated-base-command'
import {CliUx, Flags} from '@oclif/core'
import chalk from 'chalk'
import * as utils from '../../utils'
import jp from 'jsonpath'
import * as chrono from 'chrono-node'
import { splitDedupAndFlatten } from '../../utils'

export default class ScheduleRender extends AuthenticatedBaseCommand<typeof ScheduleRender> {
  static description = 'Render a PagerDuty Schedule'

  static flags = {
    id: Flags.string({
      char: 'i',
      description: 'Render the schedule with this ID.',
      exclusive: ['email', 'me'],
    }),
    name: Flags.string({
      char: 'n',
      description: 'Render the schedule with this name.',
      exclusive: ['id'],
    }),
    since: Flags.string({
      description: 'The start of the date range over which you want to search.',
    }),
    until: Flags.string({
      description: 'The end of the date range over which you want to search.',
    }),
    keys: Flags.string({
      char: 'k',
      description: 'Additional fields to display. Specify multiple times for multiple fields.',
      multiple: true,
    }),
    json: Flags.boolean({
      char: 'j',
      description: 'output full details as JSON',
      exclusive: ['columns', 'filter', 'sort', 'csv', 'extended'],
    }),
    delimiter: Flags.string({
      char: 'd',
      description: 'Delimiter for fields that have more than one value',
      default: '\\n',
    }),
    ...CliUx.ux.table.flags(),
  }

  public async init(): Promise<void> {
    await super.init()
    if (this.flags.delimiter === '\\n') {
      this.flags.delimiter = '\n'
    }
    if (this.flags.keys) {
      this.flags.keys = splitDedupAndFlatten(this.flags.keys)
    }
  }

  async run() {
    const params: Record<string, any> = {}

    let scheduleID
    if (this.flags.id) {
      if (utils.invalidPagerDutyIDs([this.flags.id]).length > 0) {
        this.error(`${chalk.bold.blue(this.flags.id)} is not a valid PagerDuty schedule ID`, {exit: 1})
      }
      scheduleID = this.flags.id
    } else if (this.flags.name) {
      CliUx.ux.action.start(`Finding PD schedule ${chalk.bold.blue(this.flags.name)}`)
      scheduleID = await this.pd.scheduleIDForName(this.flags.name)
      if (!scheduleID) {
        CliUx.ux.action.stop(chalk.bold.red('failed!'))
        this.error(`No schedule or multiple schedules found with the name "${this.flags.name}"`, {exit: 1})
      }
    } else {
      this.error('You must specify one of: -i, -n', {exit: 1})
    }

    if (this.flags.since) {
      const since = chrono.parseDate(this.flags.since)
      if (since) {
        params.since = since.toISOString()
      }
    }
    if (this.flags.until) {
      const until = chrono.parseDate(this.flags.until)
      if (until) {
        params.until = until.toISOString()
      }
    }

    CliUx.ux.action.start(`Getting schedule ${chalk.bold.blue(scheduleID)}`)
    const r = await this.pd.request({
      endpoint: `schedules/${scheduleID}`,
      method: 'GET',
      params: params,
    })
    CliUx.ux.action.stop(chalk.bold.green('done'))
    const schedule = r.getData().schedule
    const {
      id: schedule_id,
      name: schedule_name
    } = schedule

    if (this.flags.json) {
      this.printJsonAndExit(schedule.final_schedule.rendered_schedule_entries)
    }

    const columns: Record<string, object> = {
      schedule_id: {
        extended: true,
        get: () => schedule_id,
      },
      schedule_name: {
        extended: true,
        get: () => schedule_name,
      },
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

    if (this.flags.keys) {
      for (const key of this.flags.keys) {
        columns[key] = {
          header: key,
          get: (row: any) => utils.formatField(jp.query(row, key), this.flags.delimiter),
        }
      }
    }

    this.printTable(schedule.final_schedule.rendered_schedule_entries, columns, this.flags)
  }
}
