import Command from '../../../base'
import {CliUx, Flags} from '@oclif/core'
import chalk from 'chalk'
import * as utils from '../../../utils'
import * as chrono from 'chrono-node'
import jp from 'jsonpath'

export default class ScheduleOverrideList extends Command {
  static description = 'List a PagerDuty Schedule\'s overrides.'

  static flags = {
    ...Command.flags,
    id: Flags.string({
      char: 'i',
      description: 'Show overrides for the schedule with this ID.',
      exclusive: ['name'],
    }),
    name: Flags.string({
      char: 'n',
      description: 'Show overrides for the schedule with this name.',
      exclusive: ['id'],
    }),
    since: Flags.string({
      description: 'The start of the date range over which you want to search.',
      default: 'now',
    }),
    until: Flags.string({
      description: 'The end of the date range over which you want to search.',
      default: 'in 30 days',
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
    pipe: Flags.boolean({
      char: 'p',
      description: 'Print override ID\'s only to stdout, for use with pipes.',
      exclusive: ['columns', 'sort', 'csv', 'extended', 'json'],
    }),
    delimiter: Flags.string({
      char: 'd',
      description: 'Delimiter for fields that have more than one value',
      default: '\n',
    }),
    ...CliUx.ux.table.flags(),
  }

  async run() {
    const {flags} = await this.parse(ScheduleOverrideList)

    let scheduleID
    if (flags.id) {
      if (utils.invalidPagerDutyIDs([flags.id]).length > 0) {
        this.error(`${chalk.bold.blue(flags.id)} is not a valid PagerDuty schedule ID`)
      }
      scheduleID = flags.id
    } else if (flags.name) {
      CliUx.ux.action.start(`Finding PD schedule ${chalk.bold.blue(flags.name)}`)
      scheduleID = await this.pd.scheduleIDForName(flags.name)
      if (!scheduleID) {
        CliUx.ux.action.stop(chalk.bold.red('failed!'))
        this.error(`No schedule was found with the name "${flags.name}"`, {exit: 1})
      }
    } else {
      this.error('You must specify one of: -i, -n', {exit: 1})
    }

    const params: Record<string, any> = {
      'include[]': 'users',
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

    const overrides = await this.pd.fetchWithSpinner(`schedules/${scheduleID}/overrides`, {
      params: params,
      activityDescription: `Getting overrides for schedule ${chalk.bold.blue(scheduleID)}`,
    })
    if (overrides.length === 0) {
      this.error('No overrides found.', {exit: 1})
    }

    if (flags.json) {
      await utils.printJsonAndExit(overrides)
    }

    const columns: Record<string, object> = {
      id: {
        header: 'ID',
      },
      start: {
        get: (row: any) => row.start ? (new Date(row.start)).toLocaleString() : '',
      },
      end: {
        get: (row: any) => row.end ? (new Date(row.end)).toLocaleString() : '',
      },
      user_id: {
        header: 'User ID',
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

    const options = {
      ...flags, // parsed flags
    }
    if (flags.pipe) {
      for (const k of Object.keys(columns)) {
        if (k !== 'id') {
          const colAny = columns[k] as any
          colAny.extended = true
        }
      }
      options['no-header'] = true
    }
    CliUx.ux.table(overrides, columns, options)
  }
}
