import { AuthenticatedBaseCommand } from '../../../base/authenticated-base-command'
import {CliUx, Flags} from '@oclif/core'
import chalk from 'chalk'

export default class FieldSchemaAddField extends AuthenticatedBaseCommand<typeof FieldSchemaAddField> {
  static description = 'Add a Field to a PagerDuty Custom Field Schema'

  static flags = {
    id: Flags.string({
      char: 'i',
      description: 'The ID of a Field Schema to add fields to.',
      required: true,
    }),
    field_id: Flags.string({
      char: 'f',
      description: 'The ID of a field to add to the schema.',
      required: true,
    }),
    required: Flags.boolean({
      char: 'r',
      description: 'The specified field is a required field.',
    }),
    defaultvalue: Flags.string({
      char: 'd',
      description: 'Provide a default value for the field. You can specify multiple times if the field is multi-valued.',
      multiple: true,
    }),
    overwrite: Flags.boolean({
      description: 'Overwrite existing configuration for this field if it is already present in the schema',
    })
  }

  async run() {
    const headers = {
      'X-EARLY-ACCESS': 'flex-service-early-access',
    }

    const {
      id:schema_id,
      field_id,
      required,
      defaultvalue,
      overwrite,
    } = this.flags

    if (required && !defaultvalue) {
      this.error('When specifying -r, you must also specify a default value with -d', {exit: 1})
    }

    let r = await this.pd.request({
      endpoint: `customfields/fields/${field_id}`,
      headers
    })
    if (r.isFailure) {
      this.error(`Couldn't get field ${field_id}: ${r.getFormattedError()}`, {exit: 1})
    }
    const field = r.getData()

    CliUx.ux.action.start('Getting schema field configurations')
    r = await this.pd.request({
      endpoint: `customfields/schemas/${schema_id}`,
      method: 'GET',
      params: {
        include: ['field_configurations']
      },
      headers,
    })
    if (r.isFailure) {
      CliUx.ux.action.stop(chalk.bold.red('failed!'))
      this.error(`Failed to get schema ${schema_id}`, {exit: 1})
    }
    CliUx.ux.action.stop(chalk.bold.green('done'))

    const schema = r.getData().schema
    const field_configurations = schema.field_configurations

    if (!overwrite && field_configurations.some((x: any) => x.field.id === field_id)) {
      this.error(`Field ${chalk.bold.blue(field_id)} already exists in schema ${chalk.bold.blue(schema_id)}`, {
        suggestions: ['Use --overwrite to overwrite the existing configuration for this field'],
        exit: 1,
      })
    }
    if (defaultvalue && defaultvalue.length > 1 && !field.field.multi_value) {
      this.error(`Field ${chalk.bold.blue(field_id)} is single-valued but you gave multiple defaults.`, {exit: 1})
    }

    const new_field_configuration: any = {
      field: {
        id: field_id,
        type: 'field_reference'
      },
      required: required ? true : false,
    }
    
    if (defaultvalue) {
      let value = defaultvalue.map((v: any) => {
        switch(field.field.datatype) {
          case 'integer': return parseInt(v)
          case 'float': return parseFloat(v)
          case 'boolean': return v.toLowerCase() === 'true'
          default: return v
        }
      })
      if (!field.field.multi_value) value = value[0]

      new_field_configuration.default_value = {
        datatype: field.field.fixed_options ? "field_option" : field.field.datatype,
        multi_value: field.field.multi_value,
        value: field.field.fixed_options ? {
          type: "field_option_reference",
          value: value
        } : value,
      }
    }

    const new_field_configurations = [
      ...field_configurations.filter((x: any) => x.field.id !== field_id),
      new_field_configuration,
    ]

    const data = {
      schema: {
        field_configurations: new_field_configurations,
      }
    }

    CliUx.ux.action.start(`Adding field ${chalk.bold.blue(field.field.name)} to PagerDuty field schema ${chalk.bold.blue(schema_id)}`)
    r = await this.pd.request({
      endpoint: `customfields/schemas/${schema_id}`,
      method: 'PUT',
      data,
      headers,
    })
    if (r.isFailure) {
      CliUx.ux.action.stop(chalk.bold.red('failed!'))
      this.error(`Failed to add field to schema: ${r.getFormattedError()}`, {exit: 1})
    }
    CliUx.ux.action.stop(chalk.bold.green('done'))
  }
}
