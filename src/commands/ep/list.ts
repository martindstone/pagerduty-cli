import Command from '../../base'
import {flags} from '@oclif/command'
import cli from 'cli-ux'
import chalk from 'chalk'
import * as pd from '../../pd'
import * as utils from '../../utils'
import jp from 'jsonpath'

export default class EpList extends Command {
  static description = 'List PagerDuty Escalation Policies'

  static flags = {
    ...Command.flags,
    name: flags.string({
      char: 'n',
      description: 'Select escalation policies whose names contain the given text',
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
      description: 'Print escalation policy ID\'s only to stdout, for use with pipes.',
      exclusive: ['columns', 'sort', 'csv', 'extended', 'json'],
    }),
    delimiter: flags.string({
      char: 'd',
      description: 'Delimiter for fields that have more than one value',
      default: '\n',
    }),
    ...cli.table.flags(),
  }

  async run() {
    const {flags} = this.parse(EpList)

    // get a validated token from base class
    const token = this.token

    const params: Record<string, any> = {}

    if (flags.name) {
      params.query = flags.name
    }

    cli.action.start('Getting escalation policies from PD')
    const r = await pd.fetch(token, '/escalation_policies', params)
    this.dieIfFailed(r)
    const eps = r.getValue()
    if (eps.length === 0) {
      cli.action.stop(chalk.bold.red('none found'))
      this.exit(0)
    }
    cli.action.stop(chalk.bold.green(`got ${eps.length}`))

    if (flags.json) {
      await utils.printJsonAndExit(eps)
    }

    const columns: Record<string, object> = {
      id: {
        header: 'ID',
      },
      name: {
        header: 'Name',
      },
      '# Rules': {
        get: (row: { escalation_rules: any[] }) => row.escalation_rules.length,
      },
      service_names: {
        get: (row: { services: any[] }) => row.services.map((e: any) => e.summary).join(flags.delimiter),
        extended: true,
      },
      team_names: {
        get: (row: { teams: any[] }) => row.teams.map((e: any) => e.summary).join(flags.delimiter),
        extended: true,
      },
      '# Loops': {
        get: (row: any) => row.num_loops,
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
    cli.table(eps, columns, options)
  }
}
