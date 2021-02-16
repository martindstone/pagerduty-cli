import Command from '../../base'
import {flags} from '@oclif/command'
import cli from 'cli-ux'
import chalk from 'chalk'
import * as pd from '../../pd'
import * as utils from '../../utils'
import * as chrono from 'chrono-node'
import jp from 'jsonpath'

export default class UserOncall extends Command {
  static description = 'List a PagerDuty User\'s on call shifts.'

  static flags = {
    ...Command.flags,
    me: flags.boolean({
      char: 'm',
      description: 'Show my oncalls.',
      exclusive: ['id', 'email'],
    }),
    id: flags.string({
      char: 'i',
      description: 'Show oncalls for the user with this ID.',
      exclusive: ['email', 'me'],
    }),
    email: flags.string({
      char: 'e',
      description: 'Show oncalls for the user with this login email.',
      exclusive: ['id', 'me'],
    }),
    since: flags.string({
      description: 'The start of the date range over which you want to search.',
    }),
    until: flags.string({
      description: 'The end of the date range over which you want to search.',
    }),
    always: flags.boolean({
      char: 'a',
      description: 'Include \'Always on call.\'',
      default: false,
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
    const {flags} = this.parse(UserOncall)

    // get a validated token from base class
    const token = this.token as string

    const params: Record<string, any> = {}

    let userID
    if (flags.id) {
      if (utils.invalidPagerDutyIDs([flags.id]).length > 0) {
        this.error(`${chalk.bold.blue(flags.id)} is not a valid PagerDuty user ID`)
      }
      userID = flags.id
    } else if (flags.email) {
      cli.action.start(`Finding PD user ${chalk.bold.blue(flags.email)}`)
      userID = await pd.userIDForEmail(token, flags.email)
      if (!userID) {
        cli.action.stop(chalk.bold.red('failed!'))
        this.error(`No user was found for the email "${flags.email}"`, {exit: 1})
      }
    } else if (flags.me) {
      cli.action.start('Finding your PD user ID')
      const me = await this.me()
      userID = me.user.id
    } else {
      this.error('You must specify one of: -i, -e, -m', {exit: 1})
    }

    params['user_ids[]'] = userID

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

    cli.action.start(`Getting oncalls for user ${chalk.bold.blue(userID)}`)
    const r = await pd.fetch(token, 'oncalls', params)
    this.dieIfFailed(r)
    let oncalls = r.getValue()

    if (!flags.always) {
      oncalls = oncalls.filter((x: any) => x.start && x.end)
    }

    if (oncalls.length === 0) {
      cli.action.stop(chalk.bold.red('none found'))
      this.exit(0)
    }
    cli.action.stop(chalk.bold.green('done'))

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
      escalation_policy_name: {
        header: 'Escalation Policy Name',
        get: (row: any) => row.escalation_policy.summary,
      },
      schedule_name: {
        header: 'Schedule Name',
        get: (row: any) => row.schedule?.summary || '',
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
      printLine: this.log,
      ...flags, // parsed flags
    }
    cli.table(oncalls, columns, options)
  }
}
