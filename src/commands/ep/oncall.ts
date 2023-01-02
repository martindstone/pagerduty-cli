import { AuthenticatedBaseCommand } from '../../base/authenticated-base-command'
import { CliUx, Flags } from '@oclif/core'
import chalk from 'chalk'
import * as utils from '../../utils'
import * as chrono from 'chrono-node'
import jp from 'jsonpath'
import { splitDedupAndFlatten } from '../../utils'

export default class EpOncall extends AuthenticatedBaseCommand<typeof EpOncall> {
  static description = 'List a PagerDuty Escalation Policy\'s on call shifts.'

  static flags = {
    id: Flags.string({
      char: 'i',
      description: 'Show oncalls for the EP with this ID.',
      exclusive: ['email', 'me'],
    }),
    name: Flags.string({
      char: 'n',
      description: 'Show oncalls for the EP with this name.',
      exclusive: ['id'],
    }),
    since: Flags.string({
      description: 'The start of the date range over which you want to search.',
    }),
    until: Flags.string({
      description: 'The end of the date range over which you want to search.',
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

    let EPID
    if (this.flags.id) {
      if (utils.invalidPagerDutyIDs([this.flags.id]).length > 0) {
        this.error(`${chalk.bold.blue(this.flags.id)} is not a valid PagerDuty escalation policy ID`, { exit: 1 })
      }
      EPID = this.flags.id
    } else if (this.flags.name) {
      CliUx.ux.action.start(`Finding PD escalation policy ${chalk.bold.blue(this.flags.name)}`)
      EPID = await this.pd.epIDForName(this.flags.name)
      if (!EPID) {
        CliUx.ux.action.stop(chalk.bold.red('failed!'))
        this.error(`No EP was found with the name "${this.flags.name}"`, { exit: 1 })
      }
    } else {
      this.error('You must specify one of: -i, -n', { exit: 1 })
    }

    params['escalation_policy_ids[]'] = EPID

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

    const oncalls = await this.pd.fetchWithSpinner('oncalls', {
      params: params,
      activityDescription: `Getting oncalls for EP ${chalk.bold.blue(EPID)}`,
    })

    if (oncalls.length === 0) {
      // eslint-disable-next-line no-console
      console.error(chalk.bold.red('no oncalls found'))
      this.exit(0)
    }

    if (this.flags.json) {
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
      user_name: {
        header: 'User Name',
        get: (row: any) => row.user?.summary || '',
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

    const options = {
      ...this.flags, // parsed flags
    }
    CliUx.ux.table(oncalls, columns, options)
  }
}
