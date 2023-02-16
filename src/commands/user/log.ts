import { ListBaseCommand } from '../../base/list-base-command'
import { CliUx, Flags } from '@oclif/core'
import chalk from 'chalk'
import getStream from 'get-stream'
import * as utils from '../../utils'
import * as chrono from 'chrono-node'
import jp from 'jsonpath'

export default class UserLog extends ListBaseCommand<typeof UserLog> {
  static description = 'Show PagerDuty User Log Entries'

  static flags = {
    email: Flags.string({
      char: 'e',
      description: 'Select users whose login email addresses contain the given text',
      exclusive: ['exact_email', 'name'],
    }),
    exact_email: Flags.string({
      char: 'E',
      description: 'Select the user whose login email is this exact text',
      exclusive: ['email', 'name'],
    }),
    ids: Flags.string({
      char: 'i',
      description: 'Select users with the given ID. Specify multiple times for multiple users.',
      multiple: true,
    }),
    since: Flags.string({
      description: 'The start of the date range over which you want to search.',
      default: '30 days ago',
    }),
    until: Flags.string({
      description: 'The end of the date range over which you want to search.',
    }),
    overview: Flags.boolean({
      char: 'O',
      description: 'Get only `overview` log entries',
    }),
  }

  async run() {
    if (!(this.flags.email || this.flags.exact_email || this.flags.ids || this.flags.pipe || this.flags.name)) {
      this.error('You must specify at least one of: -e, -E, -i, -p, -n', { exit: 1 })
    }
    const params: Record<string, any> = {
      is_overview: this.flags.overview,
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

    let user_ids: string[] = []
    if (this.flags.email || this.flags.exact_email || this.flags.name) {
      CliUx.ux.action.start('Getting user IDs from PD')
      let users = await this.pd.fetchWithSpinner('users', {
        params: { query: this.flags.email || this.flags.exact_email || this.flags.name },
        activityDescription: 'Getting user IDs from PD',
      })
      if (this.flags.exact_email) {
        users = users.filter((user: any) => user.email === this.flags.exact_email)
      }
      if (!users || users.length === 0) {
        CliUx.ux.action.stop(chalk.bold.red('none found'))
      }
      user_ids = users.map((e: { id: any }) => e.id)
    }
    if (this.flags.ids) {
      user_ids = [...new Set([...user_ids, ...utils.splitDedupAndFlatten(this.flags.ids)])]
    }
    if (this.flags.pipe) {
      const str: string = await getStream(process.stdin)
      user_ids = utils.splitDedupAndFlatten([str])
    }
    const invalid_ids = utils.invalidPagerDutyIDs(user_ids)
    if (invalid_ids && invalid_ids.length > 0) {
      this.error(`Invalid user ID's: ${invalid_ids.join(', ')}`, { exit: 1 })
    }

    if (user_ids.length === 0) {
      this.error('No valid IDs specified. Nothing to do.', { exit: 1 })
    }
    let log_entries: any[] = []
    for (const user_id of user_ids) {
      CliUx.ux.action.start(`Getting log entries for user ${chalk.bold.blue(user_id)}`)
      // eslint-disable-next-line no-await-in-loop
      const r = await this.pd.fetchWithSpinner(`users/${user_id}/log_entries`, {
        params: params,
        activityDescription: `Getting log entries for user ${chalk.bold.blue(user_id)}`,
        fetchLimit: this.flags.limit,
      })
      log_entries = [...log_entries, ...r]
    }

    if (log_entries.length === 0) {
      this.exit(0)
    }
    if (this.flags.json) {
      this.printJsonAndExit(log_entries)
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

    if (this.flags.keys) {
      for (const key of this.flags.keys) {
        columns[key] = {
          header: key,
          get: (row: any) => utils.formatField(jp.query(row, key), this.flags.delimiter),
        }
      }
    }
    if (!this.flags.sort) {
      this.flags.sort = 'created'
    }

    this.printTable(log_entries, columns, this.flags)
  }
}
