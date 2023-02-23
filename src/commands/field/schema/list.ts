import { AuthenticatedBaseCommand } from '../../../base/authenticated-base-command'
import {CliUx, Flags} from '@oclif/core'
import chalk from 'chalk'
import * as utils from '../../../utils'
import jp from 'jsonpath'

export default class FieldSchemaList extends AuthenticatedBaseCommand<typeof FieldSchemaList> {
  static description = 'List PagerDuty Custom Field Schemas'

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

    const schemas = await this.pd.fetchWithSpinner('customfields/schemas', {
      activityDescription: 'Getting field schemas from PD',
      headers,
    })
    if (schemas.length === 0) {
      this.error('No schemas found. Please check your search.', {exit: 1})
    }

    if (json) {
      await this.printJsonAndExit(schemas)
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
      title: {},
      description: {
        get: (row: { description: string }) => row.description || '',
      },
    }

    // if (flags.keys) {
    //   for (const key of flags.keys) {
    //     columns[key] = {
    //       header: key,
    //       get: (row: any) => utils.formatField(jp.query(row, key), flags.delimiter),
    //     }
    //   }
    // }

    // const options = {
    //   ...flags, // parsed flags
    // }

    // if (flags.pipe) {
    //   for (const k of Object.keys(columns)) {
    //     if (k !== 'id') {
    //       const colAny = columns[k] as any
    //       colAny.extended = true
    //     }
    //   }
    //   options['no-header'] = true
    // }

    this.printTable(schemas, columns, this.flags)
  }
}
