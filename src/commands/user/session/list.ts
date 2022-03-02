import Command from '../../../base'
import {CliUx, Flags} from '@oclif/core'
import chalk from 'chalk'
import * as utils from '../../../utils'
import jp from 'jsonpath'
import * as chrono from 'chrono-node'

export default class UserSessionList extends Command {
  static description = 'List a PagerDuty User\'s sessions.'

  static flags = {
    ...Command.flags,
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

  async run() {
    const {flags} = await this.parse(UserSessionList)

    let userID
    if (flags.id) {
      userID = flags.id
    } else if (flags.email) {
      CliUx.ux.action.start(`Finding PD user ${chalk.bold.blue(flags.email)}`)
      userID = await this.pd.userIDForEmail(flags.email)
      if (!userID) {
        CliUx.ux.action.stop(chalk.bold.red('failed!'))
        this.error(`No user was found for the email "${flags.email}"`, {exit: 1})
      }
    } else {
      this.error('You must specify one of: -i, -e', {exit: 1})
    }

    let sessions = await this.pd.fetchWithSpinner(`users/${userID}/sessions`, {
      activityDescription: `Getting sessions for user ${chalk.bold.blue(userID)}`,
    })

    if (flags.since) {
      const since = chrono.parseDate(flags.since)
      sessions = sessions.filter((x: any) => {
        const c = chrono.parseDate(x.created_at)
        return c > since
      })
    }

    if (flags.until) {
      const until = chrono.parseDate(flags.until)
      sessions = sessions.filter((x: any) => {
        const c = chrono.parseDate(x.created_at)
        return c < until
      })
    }

    if (flags.query) {
      sessions = jp.query(sessions, flags.query)
    }

    if (sessions.length > 0) {
      CliUx.ux.action.stop(chalk.bold.green(`got ${sessions.length}`))
    } else {
      CliUx.ux.action.stop(chalk.bold.red('none found'))
      this.exit(0)
    }

    if (flags.json) {
      await utils.printJsonAndExit(sessions)
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

    if (flags.keys) {
      for (const key of flags.keys) {
        columns[key] = {
          header: key,
          get: (row: any) => utils.formatField(jp.query(row, key)),
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
    CliUx.ux.table(sessions, columns, options)
  }
}
