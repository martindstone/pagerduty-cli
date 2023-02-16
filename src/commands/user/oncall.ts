import { AuthenticatedBaseCommand } from '../../base/authenticated-base-command'
import { CliUx, Flags } from '@oclif/core'
import chalk from 'chalk'
import * as utils from '../../utils'
import * as chrono from 'chrono-node'
import jp from 'jsonpath'
import { splitDedupAndFlatten } from '../../utils'

export default class UserOncall extends AuthenticatedBaseCommand<typeof UserOncall> {
  static description = 'List a PagerDuty User\'s on call shifts.'

  static flags = {
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
    delimiter: Flags.string({
      char: 'd',
      description: 'Delimiter for fields that have more than one value',
      default: '\\n',
    }),
    json: Flags.boolean({
      char: 'j',
      description: 'output full details as JSON',
      exclusive: ['columns', 'filter', 'sort', 'csv', 'extended'],
    }),
    ...CliUx.ux.table.flags(),
  }

  public async init(): Promise<void> {
    await super.init()
    if (this.flags.delimiter === '\\n') {
      this.flags.delimiter = '\n'
    }
    if (this.flags.keys) {
      this.flags.keys = splitDedupAndFlatten(this.flags.keys)
    }
  }

  async run() {
    const params: Record<string, any> = {}

    let userID
    if (this.flags.id) {
      if (utils.invalidPagerDutyIDs([this.flags.id]).length > 0) {
        this.error(`${chalk.bold.blue(this.flags.id)} is not a valid PagerDuty user ID`)
      }
      userID = this.flags.id
    } else if (this.flags.email) {
      CliUx.ux.action.start(`Finding PD user ${chalk.bold.blue(this.flags.email)}`)
      userID = await this.pd.userIDForEmail(this.flags.email)
      if (!userID) {
        CliUx.ux.action.stop(chalk.bold.red('failed!'))
        this.error(`No user was found for the email "${this.flags.email}"`, { exit: 1 })
      }
    } else if (this.flags.me) {
      CliUx.ux.action.start('Finding your PD user ID')
      const me = await this.me(true)
      userID = me.user.id
    } else {
      this.error('You must specify one of: -i, -e, -m', { exit: 1 })
    }

    params['user_ids[]'] = userID

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

    let oncalls = await this.pd.fetchWithSpinner('oncalls', {
      params: params,
      activityDescription: `Getting oncalls for user ${chalk.bold.blue(userID)}`,
    })

    if (!this.flags.always) {
      oncalls = oncalls.filter((x: any) => x.start && x.end)
    }

    if (oncalls.length === 0) {
      CliUx.ux.action.stop(chalk.bold.red('none found'))
      this.exit(0)
    }
    CliUx.ux.action.stop(chalk.bold.green('done'))

    if (this.flags.json) {
      this.printJsonAndExit(oncalls)
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

    if (this.flags.keys) {
      for (const key of this.flags.keys) {
        columns[key] = {
          header: key,
          get: (row: any) => utils.formatField(jp.query(row, key), this.flags.delimiter),
        }
      }
    }

    this.printTable(oncalls, columns, this.flags)
  }
}
