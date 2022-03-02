import Command from '../../base'
import {CliUx, Flags} from '@oclif/core'
import chalk from 'chalk'
import * as utils from '../../utils'
import * as chrono from 'chrono-node'
import jp from 'jsonpath'

export default class UserOncall extends Command {
  static description = 'List a PagerDuty User\'s on call shifts.'

  static flags = {
    ...Command.flags,
    me: Flags.boolean({
      char: 'm',
      description: 'Show my oncalls.',
      exclusive: ['id', 'email'],
    }),
    id: Flags.string({
      char: 'i',
      description: 'Show oncalls for the user with this ID.',
      exclusive: ['email', 'me'],
    }),
    email: Flags.string({
      char: 'e',
      description: 'Show oncalls for the user with this login email.',
      exclusive: ['id', 'me'],
    }),
    since: Flags.string({
      description: 'The start of the date range over which you want to search.',
    }),
    until: Flags.string({
      description: 'The end of the date range over which you want to search.',
    }),
    always: Flags.boolean({
      char: 'a',
      description: 'Include \'Always on call.\'',
      default: false,
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
    const {flags} = await this.parse(UserOncall)

    const params: Record<string, any> = {}

    let userID
    if (flags.id) {
      if (utils.invalidPagerDutyIDs([flags.id]).length > 0) {
        this.error(`${chalk.bold.blue(flags.id)} is not a valid PagerDuty user ID`)
      }
      userID = flags.id
    } else if (flags.email) {
      CliUx.ux.action.start(`Finding PD user ${chalk.bold.blue(flags.email)}`)
      userID = await this.pd.userIDForEmail(flags.email)
      if (!userID) {
        CliUx.ux.action.stop(chalk.bold.red('failed!'))
        this.error(`No user was found for the email "${flags.email}"`, {exit: 1})
      }
    } else if (flags.me) {
      CliUx.ux.action.start('Finding your PD user ID')
      const me = await this.me(true)
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

    let oncalls = await this.pd.fetchWithSpinner('oncalls', {
      params: params,
      activityDescription: `Getting oncalls for user ${chalk.bold.blue(userID)}`,
    })

    if (!flags.always) {
      oncalls = oncalls.filter((x: any) => x.start && x.end)
    }

    if (oncalls.length === 0) {
      CliUx.ux.action.stop(chalk.bold.red('none found'))
      this.exit(0)
    }
    CliUx.ux.action.stop(chalk.bold.green('done'))

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
      ...flags, // parsed flags
    }
    CliUx.ux.table(oncalls, columns, options)
  }
}
