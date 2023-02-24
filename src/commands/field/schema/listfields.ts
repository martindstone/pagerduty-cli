import { AuthenticatedBaseCommand } from '../../../base/authenticated-base-command'
import {CliUx, Flags} from '@oclif/core'
import chalk from 'chalk'
import * as utils from '../../../utils'
import jp from 'jsonpath'

export default class FieldSchemaListFields extends AuthenticatedBaseCommand<typeof FieldSchemaListFields> {
  static description = 'List Fields in a PagerDuty Custom Field Schema'

  static flags = {
    id: Flags.string({
      char: 'i',
      description: 'The ID of the schema to show fields for',
      required: true,
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
      id,
      json,
      delimiter,
    } = this.flags

    const headers = {
      'X-EARLY-ACCESS': 'flex-service-early-access',
    }

    const fields = await this.pd.fetchWithSpinner('customfields/fields', {
      activityDescription: 'Getting fields from PD',
      headers,
      stopSpinnerWhenDone: false
    })
    const fieldsMap = Object.assign({}, ...fields.map((field) => ({[field.id]: field})))

    CliUx.ux.action.start('Getting schema field configurations')
    const r = await this.pd.request({
      endpoint: `customfields/schemas/${id}`,
      method: 'GET',
      params: {
        include: ['field_configurations']
      },
      headers,
    })
    if (r.isFailure) {
      CliUx.ux.action.stop(chalk.bold.red('failed!'))
      this.error(`Failed to get schema ${id}`, {exit: 1})
    }
    CliUx.ux.action.stop(chalk.bold.green('done'))

    const schema = r.getData().schema
    const field_configurations = schema.field_configurations

    if (json) {
      await this.printJsonAndExit(field_configurations)
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
        get: (row: { updated_at: string }) => row.updated_at ? (new Date(row.updated_at)).toLocaleString() : '',
        extended: true,
      },
      field_id: {
        get: (row: { field: any }) => row.field.id,
      },
      field_name: {
        get: (row: { field: any }) => fieldsMap[row.field.id].name,
      },
      field_display_name: {
        get: (row: { field: any }) => fieldsMap[row.field.id].display_name,
        extended: true,
      },
      field_type: {
        get: (row: { field: any }) => fieldsMap[row.field.id].datatype,
      },
      fixed_options: {
        get: (row: { field: any }) => fieldsMap[row.field.id].fixed_options,
      },
      multi_value: {
        get: (row: { field: any }) => fieldsMap[row.field.id].multi_value,
      },
      required: {},
      default: {
        get: (row: {default_value: any}) => {
          if (row.default_value && row.default_value.value) {
            if (row.default_value.value.type === 'field_option_reference') {
              return utils.formatField(row.default_value.value.value, delimiter)
            }
            return utils.formatField(row.default_value.value, delimiter)
          }
          return ''
        }
      },
    }

    this.printTable(field_configurations, columns, this.flags)
  }
}
