/* eslint-disable complexity */
import Command from '../base'
import {flags} from '@oclif/command'
import cli from 'cli-ux'
import chalk from 'chalk'
import * as pd from '../pd'
import * as utils from '../utils'
import * as chrono from 'chrono-node'
import dotProp from 'dot-prop'

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
    ...cli.table.flags(),
  }

  async run() {
    const {flags} = this.parse(Log)

    // get a validated token from base class
    const token = this.token as string

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

    cli.action.start('Getting log entries')
    const r = await pd.fetch(token, '/log_entries', params)
    this.dieIfFailed(r)
    const log_entries = r.getValue()
    cli.action.stop(chalk.bold.green(`got ${log_entries.length}`))

    if (log_entries.length === 0) {
      this.exit(0)
    }
    if (flags.json) {
      this.log(JSON.stringify(log_entries, null, 2))
      this.exit(0)
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
          get: (row: any) => utils.formatField(dotProp.get(row, key)),
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
