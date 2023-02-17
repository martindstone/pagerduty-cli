import { AuthenticatedBaseCommand } from '../../../base/authenticated-base-command'
import { CliUx, Flags } from '@oclif/core'
import chalk from 'chalk'
import * as utils from '../../../utils'
import jp from 'jsonpath'
import * as chrono from 'chrono-node'
import { splitDedupAndFlatten } from '../../../utils'

export default class UserSessionList extends AuthenticatedBaseCommand<typeof UserSessionList> {
  static description = 'List a PagerDuty User\'s sessions.'

  static flags = {
    id: Flags.string({
      char: 'i',
      description: 'Show sessions for the user with this ID.',
      exclusive: ['email'],
    }),
    email: Flags.string({
      char: 'e',
      description: 'Show sessions for the user with this login email.',
      exclusive: ['id'],
    }),
    keys: Flags.string({
      char: 'k',
      description: 'Additional fields to display. Specify multiple times for multiple fields.',
      multiple: true,
    }),
    delimiter: Flags.string({
      char: 'd',
      description: 'Delimiter for fields that have more than one value',
      default: '\\n',
    }),
    since: Flags.string({
      description: 'The start of the date range over which you want to search.',
    }),
    until: Flags.string({
      description: 'The end of the date range over which you want to search.',
    }),
    json: Flags.boolean({
      char: 'j',
      description: 'output full details as JSON',
      exclusive: ['columns', 'filter', 'sort', 'csv', 'extended'],
    }),
    pipe: Flags.boolean({
      char: 'p',
      description: 'Print session ID\'s only to stdout, for use with pipes.',
      exclusive: ['columns', 'sort', 'csv', 'extended', 'json'],
    }),
    query: Flags.string({
      description: 'Query the API output',
      char: 'q',
    }),
    ...CliUx.ux.table.flags(),
  }

  public async init(): Promise<void> {
    await super.init()
    if (this.flags.delimiter === '\\n') {
      this.flags.delimiter = '\n'
    }
    if (this.flags.keys) {
      this.flags.keys = this.flags.keys.map(x => x.split(/,\s*/)).flat().filter(x => x)
    }
  }

  async run() {
    let userID
    if (this.flags.id) {
      userID = this.flags.id
    } else if (this.flags.email) {
      CliUx.ux.action.start(`Finding PD user ${chalk.bold.blue(this.flags.email)}`)
      userID = await this.pd.userIDForEmail(this.flags.email)
      if (!userID) {
        CliUx.ux.action.stop(chalk.bold.red('failed!'))
        this.error(`No user was found for the email "${this.flags.email}"`, { exit: 1 })
      }
    } else {
      this.error('You must specify one of: -i, -e', { exit: 1 })
    }

    let sessions = await this.pd.fetchWithSpinner(`users/${userID}/sessions`, {
      activityDescription: `Getting sessions for user ${chalk.bold.blue(userID)}`,
    })

    if (this.flags.since) {
      const since = chrono.parseDate(this.flags.since)
      sessions = sessions.filter((x: any) => {
        const c = chrono.parseDate(x.created_at)
        return c > since
      })
    }

    if (this.flags.until) {
      const until = chrono.parseDate(this.flags.until)
      sessions = sessions.filter((x: any) => {
        const c = chrono.parseDate(x.created_at)
        return c < until
      })
    }

    if (this.flags.query) {
      sessions = jp.query(sessions, this.flags.query)
    }

    if (sessions.length > 0) {
      CliUx.ux.action.stop(chalk.bold.green(`got ${sessions.length}`))
    } else {
      CliUx.ux.action.stop(chalk.bold.red('none found'))
      this.exit(0)
    }

    if (this.flags.json) {
      this.printJsonAndExit(sessions)
    }

    const columns: Record<string, object> = {
      id: {
        header: 'ID',
      },
      type: {
      },
      summary: {
      },
      created_at: {
      },
    }

    this.printTable(sessions, columns, this.flags)
  }
}
