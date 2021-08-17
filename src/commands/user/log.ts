/* eslint-disable complexity */
import Command from '../../base'
import {flags} from '@oclif/command'
import cli from 'cli-ux'
import chalk from 'chalk'
import getStream from 'get-stream'
import * as utils from '../../utils'
import * as chrono from 'chrono-node'
import jp from 'jsonpath'

export default class UserLog extends Command {
  static description = 'Show PagerDuty User Log Entries'

  static flags = {
    ...Command.flags,
    email: flags.string({
      char: 'e',
      description: 'Select users whose login email addresses contain the given text',
      exclusive: ['exact_email'],
    }),
    exact_email: flags.string({
      char: 'E',
      description: 'Select the user whose login email is this exact text',
      exclusive: ['email'],
    }),
    ids: flags.string({
      char: 'i',
      description: 'Select users with the given ID. Specify multiple times for multiple users.',
      multiple: true,
    }),
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
    pipe: flags.boolean({
      char: 'p',
      description: 'Read user IDs from stdin, for use with pipes.',
      exclusive: ['email', 'ids'],
    }),
    delimiter: flags.string({
      char: 'd',
      description: 'Delimiter for fields that have more than one value',
      default: '\n',
    }),
    ...cli.table.flags(),
  }

  async run() {
    const {flags} = this.parse(UserLog)

    if (!flags.email && !flags.exact_email && !flags.ids && !flags.pipe) {
      this.error('You must specify at least one of: -e, -E, -i, -p', {exit: 1})
    }
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

    let user_ids: string[] = []
    if (flags.email || flags.exact_email) {
      cli.action.start('Getting user IDs from PD')
      let users = await this.pd.fetchWithSpinner('users', {
        params: {query: flags.email || flags.exact_email},
        activityDescription: 'Getting user IDs from PD',
      })
      if (flags.exact_email) {
        users = users.filter((user: any) => user.email === flags.exact_email)
      }
      if (!users || users.length === 0) {
        cli.action.stop(chalk.bold.red('none found'))
      }
      user_ids = users.map((e: { id: any }) => e.id)
    }
    if (flags.ids) {
      user_ids = [...new Set([...user_ids, ...utils.splitDedupAndFlatten(flags.ids)])]
    }
    if (flags.pipe) {
      const str: string = await getStream(process.stdin)
      user_ids = utils.splitDedupAndFlatten([str])
    }
    const invalid_ids = utils.invalidPagerDutyIDs(user_ids)
    if (invalid_ids && invalid_ids.length > 0) {
      this.error(`Invalid user ID's: ${invalid_ids.join(', ')}`, {exit: 1})
    }

    if (user_ids.length === 0) {
      this.error('No valid IDs specified. Nothing to do.', {exit: 1})
    }
    let log_entries: any[] = []
    for (const user_id of user_ids) {
      cli.action.start(`Getting log entries for user ${chalk.bold.blue(user_id)}`)
      // eslint-disable-next-line no-await-in-loop
      const r = await this.pd.fetchWithSpinner(`users/${user_id}/log_entries`, {
        params: params,
        activityDescription: `Getting log entries for user ${chalk.bold.blue(user_id)}`,
      })
      log_entries = [...log_entries, ...r]
    }

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
