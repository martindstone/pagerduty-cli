import { AuthenticatedBaseCommand } from '../../../../base/authenticated-base-command'
import {CliUx, Flags} from '@oclif/core'
import chalk from 'chalk'

export default class FieldSchemaAssignmentCreate extends AuthenticatedBaseCommand<typeof FieldSchemaAssignmentCreate> {
  static description = 'Create a PagerDuty Custom Field Schema Assignment'

  static flags = {
    id: Flags.string({
      char: 'i',
      description: 'The ID of a Field Schema to assign.',
      required: true,
    }),
    service_id: Flags.string({
      char: 's',
      description: 'The ID of a service to assign the schema to.',
      required: true,
    }),
  }

  async run() {
    const headers = {
      'X-EARLY-ACCESS': 'flex-service-early-access',
    }

    const {
      id: schema_id,
      service_id
    } = this.flags

    const data = {
      schema_assignment: {
        service: {
          id: service_id,
          type: 'service_reference',
        },
        schema: {
          id: schema_id,
          type: 'schema_reference',
        }
      }
    }

    CliUx.ux.action.start(`Assigning PagerDuty field schema ${chalk.bold.blue(schema_id)} to service ${chalk.bold.blue(service_id)}`)
    const r = await this.pd.request({
      endpoint: 'customfields/schema_assignments',
      method: 'POST',
      data,
      headers,
    })
    if (r.isFailure) {
      this.error(`Request failed: ${r.getFormattedError()}`, {exit: 1})
    }
    CliUx.ux.action.stop(chalk.bold.green('done'))
  }
}
