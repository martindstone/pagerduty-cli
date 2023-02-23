// import { ListBaseCommand } from '../../base/list-base-command'
import { AuthenticatedBaseCommand } from '../../base/authenticated-base-command'
import {CliUx, Flags} from '@oclif/core'
import chalk from 'chalk'
import * as utils from '../../utils'
import jp from 'jsonpath'

export default class FieldList extends AuthenticatedBaseCommand<typeof FieldList> {
  static description = 'List PagerDuty Custom Fields'

  static flags = {
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
    const {
      json,
    } = this.flags

    const headers = {
      'X-EARLY-ACCESS': 'flex-service-early-access',
    }

    const fields = await this.pd.fetchWithSpinner('customfields/fields', {
      activityDescription: 'Getting fields from PD',
      headers,
    })
    if (fields.length === 0) {
      this.error('No fields found. Please check your search.', {exit: 1})
    }

    if (json) {
      await this.printJsonAndExit(fields)
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

    this.printTable(fields, columns, this.flags)
  }
}
