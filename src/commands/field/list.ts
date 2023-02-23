import Command from '../../base'
import {CliUx, Flags} from '@oclif/core'
import chalk from 'chalk'
import * as utils from '../../utils'
import jp from 'jsonpath'

export default class FieldList extends Command {
  static description = 'List PagerDuty Custom Fields'

  static flags = {
    ...Command.flags,
    ...Command.listCommandFlags,
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
      description: 'Print field ID\'s only to stdout, for use with pipes.',
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
    const {flags} = await this.parse(this.ctor)

    const headers = {
      'X-EARLY-ACCESS': 'flex-service-early-access',
    }

    const fields = await this.pd.fetchWithSpinner('fields', {
      activityDescription: 'Getting fields from PD',
      fetchLimit: flags.limit,
      headers,
    })
    if (fields.length === 0) {
      this.error('No fields found. Please check your search.', {exit: 1})
    }

    if (flags.json) {
      await utils.printJsonAndExit(fields)
    }

    const columns: Record<string, object> = {
      id: {
        header: 'ID',
      },
      created: {
        get: (row: { created_at: string }) => (new Date(row.created_at)).toLocaleString(),
        extended: true,
      },
      updated: {
        get: (row: { updated_at: string }) => (new Date(row.updated_at)).toLocaleString(),
        extended: true,
      },
      namespace: {},
      name: {},
      display_name: {},
      description: {
        get: (row: { description: string }) => row.description || '',
        extended: true,
      },
      datatype: {},
      fixed_options: {},
      multi_value: {},
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

    CliUx.ux.table(fields, columns, options)
  }
}
