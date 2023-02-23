import { AuthenticatedBaseCommand } from '../../../../base/authenticated-base-command'
import {CliUx, Flags} from '@oclif/core'
import chalk from 'chalk'

export default class FieldSchemaAssignmentRemove extends AuthenticatedBaseCommand<typeof FieldSchemaAssignmentRemove> {
  static description = 'Remove a PagerDuty Custom Field Schema Assignment'

  static flags = {
    id: Flags.string({
      char: 'i',
      description: 'The ID of a Field Schema Assignment to remove.',
      required: true,
    }),
  }

  async run() {
    const headers = {
      'X-EARLY-ACCESS': 'flex-service-early-access',
    }

    const {
      id: assignment_id,
    } = this.flags

    CliUx.ux.action.start(`Removing PagerDuty field schema assignment ${chalk.bold.blue(assignment_id)}`)
    const r = await this.pd.request({
      endpoint: `customfields/schema_assignments/${assignment_id}`,
      method: 'DELETE',
      headers,
    })
    if (r.isFailure) {
      this.error(`Request failed: ${r.getFormattedError()}`, {exit: 1})
    }
    CliUx.ux.action.stop(chalk.bold.green('done'))
  }
}
