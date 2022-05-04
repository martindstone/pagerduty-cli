import Command from '../../base'
import {CliUx, Flags} from '@oclif/core'
import chalk from 'chalk'
import * as utils from '../../utils'
import jp from 'jsonpath'

export default class EpList extends Command {
  static description = 'List PagerDuty Escalation Policies'

  static flags = {
    ...Command.flags,
    ...Command.listCommandFlags,
    name: Flags.string({
      char: 'n',
      description: 'Select escalation policies whose names contain the given text',
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
    pipe: Flags.boolean({
      char: 'p',
      description: 'Print escalation policy ID\'s only to stdout, for use with pipes.',
      exclusive: ['columns', 'sort', 'csv', 'extended', 'json'],
    }),
    delimiter: Flags.string({
      char: 'd',
      description: 'Delimiter for fields that have more than one value',
      default: '\n',
    }),
    ...CliUx.ux.table.flags(),
  }

  async run() {
    const {flags} = await this.parse(EpList)

    const params: Record<string, any> = {}

    if (flags.name) {
      params.query = flags.name
    }

    const eps = await this.pd.fetchWithSpinner('escalation_policies', {
      params: params,
      activityDescription: 'Getting escalation policies from PD',
      fetchLimit: flags.limit,
    })

    if (eps.length === 0) {
      CliUx.ux.action.stop(chalk.bold.red('none found'))
      this.exit(0)
    }
    CliUx.ux.action.stop(chalk.bold.green(`got ${eps.length}`))

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
    CliUx.ux.table(eps, columns, options)
  }
}
