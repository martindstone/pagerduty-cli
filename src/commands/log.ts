/* eslint-disable complexity */
import Command from '../base'
import {flags} from '@oclif/command'
import cli from 'cli-ux'
import * as utils from '../utils'
import * as chrono from 'chrono-node'
import jp from 'jsonpath'

export default class Log extends Command {
  static description = 'Show PagerDuty Domain Log Entries'

  static flags = {
    ...Command.flags,
    since: flags.string({
      description: 'The start of the date range over which you want to search.',
      default: '30 days ago',
    }),
    until: flags.string({
      description: 'The end of the date range over which you want to search.',
    }),
    overview: flags.boolean({
      char: 'O',
      description: 'Get only `overview` log entries',
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
    const {flags} = this.parse(Log)

    const params: Record<string, any> = {
      is_overview: flags.overview,
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

    const log_entries = await this.pd.fetchWithSpinner('log_entries', {
      params: params,
      activityDescription: 'Getting log entries',
    })

    if (log_entries.length === 0) {
      this.exit(0)
    }
    if (flags.json) {
      await utils.printJsonAndExit(log_entries)
    }

    const columns: Record<string, object> = {
      id: {
        header: 'Log Entry ID',
      },
      type: {
        header: 'Log Entry Type',
      },
      created: {
        get: (row: { created_at: string }) => (new Date(row.created_at)).toLocaleString(),
      },
      summary: {
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
    if (!flags.sort) {
      flags.sort = 'created'
    }

    const options = {
      printLine: this.log,
      ...flags, // parsed flags
    }
    cli.table(log_entries, columns, options)
  }
}
