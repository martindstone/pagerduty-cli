import Command from '../../../base'
import {CliUx, Flags} from '@oclif/core'
import chalk from 'chalk'

export default class FieldSchemaAddField extends Command {
  static description = 'Add a Field to a PagerDuty Custom Field Schema'

  static flags = {
    ...Command.flags,
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
  }

  async run() {
    const {flags} = await this.parse(this.ctor)

    const headers = {
      'X-EARLY-ACCESS': 'flex-service-early-access',
    }

    const {
      id:schema_id,
      field_id,
      required,
      defaultvalue
    } = flags

    if (required && !defaultvalue) {
      this.error('When specifying -r, you must also specify a default value with -d', {exit: 1})
    }

    let r = await this.pd.request({
      endpoint: `fields/${field_id}`,
      headers
    })
    if (r.isFailure) {
      this.error(`Couldn't get field ${field_id}: ${r.getFormattedError()}`, {exit: 1})
    }
    const field = r.getData()

    if (defaultvalue && defaultvalue.length > 1 && !field.field.multi_value) {
      this.error(`Field ${chalk.bold.blue(field_id)} is single-valued but you gave multiple defaults.`, {exit: 1})
    }

    const field_configuration: any = {
      field_configuration: {
        field: {
          id: field_id,
          type: 'field_reference'
        },
        required: required ? true : false,
      }
    }

    if (defaultvalue) {
      const value = defaultvalue.map((v: any) => {
        switch(field.field.datatype) {
          case 'integer': return parseInt(v)
          case 'float': return parseFloat(v)
          case 'boolean': return v.toLowerCase() === 'true'
          default: return v
        }
      })
      field_configuration.field_configuration.default_value = {
        datatype: field.field.datatype,
        multi_value: field.field.multi_value,
        value: field.field.multi_value ? value : value[0],
      }
    }

    CliUx.ux.action.start(`Adding field ${chalk.bold.blue(field.field.name)} to PagerDuty field schema ${chalk.bold.blue(schema_id)}`)
    r = await this.pd.request({
      endpoint: `field_schemas/${schema_id}/field_configurations`,
      method: 'POST',
      data: field_configuration,
      headers,
    })
    if (r.isFailure) {
      this.error(`Failed to add field to schema: ${r.getFormattedError()}`, {exit: 1})
    }
    CliUx.ux.action.stop(chalk.bold.green('done'))
    const returned_field = r.getData()

    if (flags.pipe) {
      this.log(returned_field.field.id)
    }
  }
}
