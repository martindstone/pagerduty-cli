import Command from '../../../base'
import {CliUx, Flags} from '@oclif/core'
import chalk from 'chalk'
import * as utils from '../../../utils'
import jp from 'jsonpath'

export default class FieldSchemaRemoveField extends Command {
  static description = 'Remove a Field from a PagerDuty Custom Field Schema'

  static flags = {
    ...Command.flags,
    ...Command.listCommandFlags,
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
    const {flags} = await this.parse(this.ctor)

    const headers = {
      'X-EARLY-ACCESS': 'flex-service-early-access',
    }

    const schema_fields = await this.pd.fetchWithSpinner(`field_schemas/${flags.id}/field_configurations`, {
      activityDescription: 'Getting schema fields from PD',
      fetchLimit: flags.limit,
      headers,
      stopSpinnerWhenDone: false,
    })
    if (schema_fields.length === 0) {
      this.error('No schemas found. Please check your search.', {exit: 1})
    }

    const configs_to_delete = schema_fields.filter((config) => config.field.id === flags.field_id)
    if (configs_to_delete.length !== 1) {
      this.error('Could not find the field to delete', {exit: 1})
    }
    const config_to_delete = configs_to_delete[0]

    CliUx.ux.action.start(`Deleting field ${chalk.bold.blue(flags.field_id)} from schema ${chalk.bold.blue(flags.id)}`)
    const r = await this.pd.request({
      endpoint: `field_schemas/${flags.id}/field_configurations/${config_to_delete.id}`,
      method: 'DELETE',
      headers,
    })
    if (r.isFailure) {
      this.error(`Request failed: ${r.getFormattedError()}`, {exit: 1})
    }
    CliUx.ux.action.stop(chalk.bold.green('done'))
  }
}
