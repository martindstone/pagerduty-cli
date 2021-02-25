import Command from '../../../base'
import {flags} from '@oclif/command'
import cli from 'cli-ux'
import chalk from 'chalk'
import * as pd from '../../../pd'
import * as utils from '../../../utils'
import jp from 'jsonpath'
import * as chrono from 'chrono-node'

export default class UserSessionList extends Command {
  static description = 'List a PagerDuty User\'s sessions.'

  static flags = {
    ...Command.flags,
    id: flags.string({
      char: 'i',
      description: 'Show sessions for the user with this ID.',
      exclusive: ['email'],
    }),
    email: flags.string({
      char: 'e',
      description: 'Show sessions for the user with this login email.',
      exclusive: ['id'],
    }),
    keys: flags.string({
      char: 'k',
      description: 'Additional fields to display. Specify multiple times for multiple fields.',
      multiple: true,
    }),
    since: flags.string({
      description: 'The start of the date range over which you want to search.',
    }),
    until: flags.string({
      description: 'The end of the date range over which you want to search.',
    }),
    json: flags.boolean({
      char: 'j',
      description: 'output full details as JSON',
      exclusive: ['columns', 'filter', 'sort', 'csv', 'extended'],
    }),
    pipe: flags.boolean({
      char: 'p',
      description: 'Print session ID\'s only to stdout, for use with pipes.',
      exclusive: ['columns', 'sort', 'csv', 'extended', 'json'],
    }),
    ...cli.table.flags(),
    query: flags.string({
      description: 'Query the API output',
      char: 'q',
    }),
  }

  async run() {
    const {flags} = this.parse(UserSessionList)

    // get a validated token from base class
    const token = this.token as string

    let userID
    if (flags.id) {
      userID = flags.id
    } else if (flags.email) {
      cli.action.start(`Finding PD user ${chalk.bold.blue(flags.email)}`)
      userID = await pd.userIDForEmail(token, flags.email)
      if (!userID) {
        cli.action.stop(chalk.bold.red('failed!'))
        this.error(`No user was found for the email "${flags.email}"`, {exit: 1})
      }
    } else {
      this.error('You must specify one of: -i, -e', {exit: 1})
    }

    cli.action.start(`Getting sessions for user ${chalk.bold.blue(userID)}`)
    const r = await pd.fetch(token, `/users/${userID}/sessions`)
    this.dieIfFailed(r)
    let sessions = r.getValue()

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
      cli.action.stop(chalk.bold.green(`got ${sessions.length}`))
    } else {
      cli.action.stop(chalk.bold.red('none found'))
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
      printLine: this.log,
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
    cli.table(sessions, columns, options)
  }
}
