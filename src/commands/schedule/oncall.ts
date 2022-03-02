import Command from '../../base'
import {CliUx, Flags} from '@oclif/core'
import chalk from 'chalk'
import * as utils from '../../utils'
import * as chrono from 'chrono-node'
import jp from 'jsonpath'

export default class ScheduleOncall extends Command {
  static description = 'List a PagerDuty Schedule\'s on call shifts.'

  static flags = {
    ...Command.flags,
    id: Flags.string({
      char: 'i',
      description: 'Show oncalls for the schedule with this ID.',
      exclusive: ['email', 'me'],
    }),
    name: Flags.string({
      char: 'n',
      description: 'Show oncalls for the schedule with this name.',
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
    ...CliUx.ux.table.flags(),
  }

  async run() {
    const {flags} = await this.parse(ScheduleOncall)

    const params: Record<string, any> = {}

    let scheduleID
    if (flags.id) {
      if (utils.invalidPagerDutyIDs([flags.id]).length > 0) {
        this.error(`${chalk.bold.blue(flags.id)} is not a valid PagerDuty schedule ID`, {exit: 1})
      }
      scheduleID = flags.id
    } else if (flags.name) {
      CliUx.ux.action.start(`Finding PD schedule ${chalk.bold.blue(flags.name)}`)
      scheduleID = await this.pd.scheduleIDForName(flags.name)
      if (!scheduleID) {
        CliUx.ux.action.stop(chalk.bold.red('failed!'))
        this.error(`No schedule or multiple schedules found with the name "${flags.name}"`, {exit: 1})
      }
    } else {
      this.error('You must specify one of: -i, -n', {exit: 1})
    }

    params['schedule_ids[]'] = scheduleID

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

    const oncalls = await this.pd.fetchWithSpinner('oncalls', {
      params: params,
      activityDescription: `Getting oncalls for schedule ${chalk.bold.blue(scheduleID)}`,
    })

    if (oncalls.length === 0) {
      this.error('No oncalls found.', {exit: 1})
    }

    if (flags.json) {
      await utils.printJsonAndExit(oncalls)
    }

    const columns: Record<string, object> = {
      start: {
        get: (row: any) => row.start ? (new Date(row.start)).toLocaleString() : '',
      },
      end: {
        get: (row: any) => row.end ? (new Date(row.end)).toLocaleString() : '',
      },
      level: {
        get: (row: any) => row.escalation_level,
      },
      user_name: {
        header: 'User Name',
        get: (row: any) => row.user?.summary || '',
      },
      escalation_policy_name: {
        header: 'Escalation Policy Name',
        get: (row: any) => row.escalation_policy.summary,
      },
    }

    if (flags.keys) {
      for (const key of flags.keys) {
        columns[key] = {
          header: key,
          get: (row: any) => utils.formatField(jp.query(row, key), '\n'),
        }
      }
    }

    const options = {
      ...flags, // parsed flags
    }
    CliUx.ux.table(oncalls, columns, options)
  }
}
