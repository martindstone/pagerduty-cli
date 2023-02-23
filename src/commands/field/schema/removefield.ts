import { AuthenticatedBaseCommand } from '../../../base/authenticated-base-command'
import {CliUx, Flags} from '@oclif/core'
import chalk from 'chalk'

export default class FieldSchemaRemoveField extends AuthenticatedBaseCommand<typeof FieldSchemaRemoveField> {
  static description = 'Remove a Field from a PagerDuty Custom Field Schema'

  static flags = {
    id: Flags.string({
      char: 'i',
      description: 'The ID of the schema to delete a field from',
      required: true,
    }),
    field_id: Flags.string({
      char: 'f',
      description: 'The ID of the field to remove from the schema.',
      required: true,
    }),
  }

  async run() {
    const {
      id: schema_id,
      field_id,
    } = this.flags

    const headers = {
      'X-EARLY-ACCESS': 'flex-service-early-access',
    }

    CliUx.ux.action.start('Getting schema field configurations')
    let r = await this.pd.request({
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

    if (!field_configurations.some((x: any) => x.field.id === field_id)) {
      this.error(`Schema ${chalk.bold.blue(schema_id)} doesn\'t contain field ${chalk.bold.blue(field_id)}`, {
        exit: 1,
      })
    }

    const new_field_configurations = field_configurations.filter((x: any) => x.field.id !== field_id)
    const data = {
      schema: {
        field_configurations: new_field_configurations,
      }
    }

    CliUx.ux.action.start(`Deleting field ${chalk.bold.blue(field_id)} from schema ${chalk.bold.blue(schema_id)}`)
    r = await this.pd.request({
      endpoint: `customfields/schemas/${schema_id}`,
      method: 'PUT',
      data,
      headers,
    })
    if (r.isFailure) {
      CliUx.ux.action.stop(chalk.bold.red('failed!'))
      this.error(`Failed to remove field from schema: ${r.getFormattedError()}`, {exit: 1})
    }
    CliUx.ux.action.stop(chalk.bold.green('done'))
  }
}
