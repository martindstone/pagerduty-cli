import Command from '../../../../base'
import {CliUx, Flags} from '@oclif/core'
import chalk from 'chalk'

export default class FieldSchemaAssignmentRemove extends Command {
  static description = 'Unassign a PagerDuty Custom Field Schema to a Service'

  static flags = {
    ...Command.flags,
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
    const {flags} = await this.parse(this.ctor)

    const headers = {
      'X-EARLY-ACCESS': 'flex-service-early-access',
    }

    const {
      id,
      service_id
    } = flags


    const assignment = {
      field_schema_assignment: {
        resource: {
          id: service_id,
          type: 'service_reference'
        },
        field_schema_id: id,
      }
    }

    CliUx.ux.action.start(`Unassigning PagerDuty field schema ${chalk.bold.blue(id)} from service ${chalk.bold.blue(service_id)}`)
    const r = await this.pd.request({
      endpoint: 'field_schema_assignments/unassign',
      method: 'POST',
      data: assignment,
      headers,
    })
    if (r.isFailure) {
      this.error(`Request failed: ${r.getFormattedError()}`, {exit: 1})
    }
    CliUx.ux.action.stop(chalk.bold.green('done'))
  }
}
