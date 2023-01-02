import { AuthenticatedBaseCommand } from '../../../base/authenticated-base-command'
import { CliUx, Flags } from '@oclif/core'
import chalk from 'chalk'
import parsePhoneNumber from 'libphonenumber-js'

export default class UserContactSet extends AuthenticatedBaseCommand<typeof UserContactSet> {
  static description = 'Update a contact method for a PagerDuty user'

  static flags = {
    id: Flags.string({
      char: 'i',
      description: 'Update a contact for the user with this ID.',
      exclusive: ['email'],
    }),
    email: Flags.string({
      char: 'e',
      description: 'Update a contact for the user with this login email.',
      exclusive: ['id'],
    }),
    contact_id: Flags.string({
      char: 'c',
      description: 'Update the contact with this ID.',
      required: true,
    }),
    label: Flags.string({
      char: 'l',
      description: 'The contact method label to set.',
    }),
    address: Flags.string({
      char: 'a',
      description: 'The contact method address or phone number to set.',
    }),
  }

  async run() {
    let userID
    if (this.flags.id) {
      userID = this.flags.id
    } else if (this.flags.email) {
      CliUx.ux.action.start(`Finding PD user ${chalk.bold.blue(this.flags.email)}`)
      userID = await this.pd.userIDForEmail(this.flags.email)
      if (!userID) {
        CliUx.ux.action.stop(chalk.bold.red('failed!'))
        this.error(`No user was found for the email "${this.flags.email}"`, { exit: 1 })
      }
    } else {
      this.error('You must specify one of: -i, -e', { exit: 1 })
    }

    CliUx.ux.action.start(`Finding contact ${chalk.bold.blue(this.flags.contact_id)}`)
    let r = await this.pd.request({
      endpoint: `users/${userID}/contact_methods/${this.flags.contact_id}`,
      method: 'GET',
    })

    if (r.isFailure) {
      CliUx.ux.action.stop(chalk.bold.red('failed!'))
      this.error(`Request failed: ${r.getFormattedError}`, { exit: 1 })
    }

    const body: any = r.getData()

    if (this.flags.address) {
      if (body.contact_method.type === 'sms' || body.contact_method.type === 'phone') {
        const number = parsePhoneNumber(this.flags.address, 'US')
        body.contact_method.address = number?.nationalNumber
        body.contact_method.country_code = number?.countryCallingCode
      } else {
        body.contact_method.address = this.flags.address
      }
    }

    if (this.flags.label) {
      body.contact_method.summary = this.flags.label
      body.contact_method.label = this.flags.label
    }

    CliUx.ux.action.start(`Updating contact method ${this.flags.contact_id} for user ${chalk.bold.blue(userID)}`)
    r = await this.pd.request({
      endpoint: `users/${userID}/contact_methods/${this.flags.contact_id}`,
      method: 'PUT',
      data: body,
    })
    if (r.isFailure) {
      CliUx.ux.action.stop(chalk.bold.red('failed!'))
      this.error(`Request failed: ${r.getFormattedError()}`, { exit: 1 })
    }
    const contact_method = r.getData()
    CliUx.ux.action.stop(`${chalk.bold.green('updated contact method')} ${chalk.bold.blue(contact_method.contact_method.id)}`)
  }
}
