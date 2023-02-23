import { AuthenticatedBaseCommand } from '../../../base/authenticated-base-command'
import {CliUx, Flags} from '@oclif/core'
import chalk from 'chalk'
import * as utils from '../../../utils'
import jp from 'jsonpath'

export default class FieldOptionRemove extends AuthenticatedBaseCommand<typeof FieldOptionRemove> {
  static description = 'Remove an option from a fixed-options Custom Field'

  static flags = {
    id: Flags.string({
      char: 'i',
      description: 'The ID of a fixed-options Field to remove an option from.',
      required: true,
    }),
    option_id: Flags.string({
      char: 'o',
      description: 'The ID of the option to remove from the field.',
      required: true,
    }),
  }

  async run() {
    const {
      id,
      option_id,
    } = this.flags

    if (utils.invalidPagerDutyIDs([id]).length > 0) {
      this.error(`Invalid PagerDuty field ID ${chalk.bold.blue(id)}`, {exit: 1})
    }

    if (utils.invalidPagerDutyIDs([option_id]).length > 0) {
      this.error(`Invalid PagerDuty field option ID ${chalk.bold.blue(option_id)}`, {exit: 1})
    }

    const headers = {
      'X-EARLY-ACCESS': 'flex-service-early-access',
    }

    CliUx.ux.action.start(`Getting field details from PD`)
    let r = await this.pd.request({
      endpoint: `customfields/fields/${id}`,
      method: 'GET',
      headers
    })

    if (r.isFailure) {
      this.error(`Couldn't get field ${chalk.bold.blue(id)}: ${r.getFormattedError()}`)
    }
    const field = r.getData()

    if (!field.field.fixed_options) {
      this.error(`${chalk.bold.blue(id)} is not a fixed-options field`)
    }

    CliUx.ux.action.start('Removing PagerDuty field option')
    r = await this.pd.request({
      endpoint: `customfields/fields/${id}/field_options/${option_id}`,
      method: 'DELETE',
      headers,
    })
    if (r.isFailure) {
      this.error(`Failed to remove field option: ${r.getFormattedError()}`, {exit: 1})
    }
    CliUx.ux.action.stop(chalk.bold.green('done'))
    const returned_field = r.getData()
  }
}
