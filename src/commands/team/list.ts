import Command from '../../base'
import {CliUx, Flags} from '@oclif/core'
import * as utils from '../../utils'
import jp from 'jsonpath'

export default class TeamList extends Command {
  static description = 'List PagerDuty Teams'

  static flags = {
    ...Command.flags,
    name: Flags.string({
      char: 'n',
      description: 'Select teams whose names contain the given text',
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
      description: 'Print user ID\'s only to stdout, for use with pipes.',
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
    const {flags} = await this.parse(TeamList)

    const params: Record<string, any> = {}

    if (flags.name) {
      params.query = flags.name
    }

    const teams = await this.pd.fetchWithSpinner('teams', {
      params: params,
      activityDescription: 'Getting teams from PD',
    })

    if (flags.json) {
      await utils.printJsonAndExit(teams)
    }

    const columns: Record<string, object> = {
      id: {
        header: 'ID',
      },
      summary: {
        header: 'Name',
      },
      description: {
        extended: true,
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
    CliUx.ux.table(teams, columns, options)
  }
}
