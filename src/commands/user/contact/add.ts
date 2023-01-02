import { AuthenticatedBaseCommand } from '../../../base/authenticated-base-command'
import { CliUx, Flags } from '@oclif/core'
import chalk from 'chalk'
import parsePhoneNumber from 'libphonenumber-js'

export default class UserContactAdd extends AuthenticatedBaseCommand<typeof UserContactAdd> {
  static description = 'Add a contact method to a PagerDuty user'

  static flags = {
    id: Flags.string({
      char: 'i',
      description: 'Add contact to the user with this ID.',
      exclusive: ['email'],
    }),
    email: Flags.string({
      char: 'e',
      description: 'Add contact to the user with this login email.',
      exclusive: ['id'],
    }),
    label: Flags.string({
      char: 'l',
      description: 'The contact method label.',
      required: true,
    }),
    type: Flags.string({
      char: 'T',
      description: 'The contact method type.',
      required: true,
      options: ['email', 'phone', 'sms'],
    }),
    address: Flags.string({
      char: 'a',
      description: 'The contact method address or phone number.',
      required: true,
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

    const body: any = {
      contact_method: {
        type: `${this.flags.type}_contact_method`,
        summary: this.flags.label,
        label: this.flags.label,
      },
    }
    if (this.flags.type === 'sms' || this.flags.type === 'phone') {
      const number = parsePhoneNumber(this.flags.address, 'US')
      body.contact_method.address = number?.nationalNumber
      body.contact_method.country_code = number?.countryCallingCode
    } else {
      body.contact_method.address = this.flags.address
    }

    CliUx.ux.action.start(`Adding ${chalk.bold.blue(this.flags.type)} contact method for user ${chalk.bold.blue(userID)}`)
    const r = await this.pd.request({
      endpoint: `users/${userID}/contact_methods`,
      method: 'POST',
      data: body,
    })
    if (r.isFailure) {
      CliUx.ux.action.stop(chalk.bold.red('failed!'))
      this.error(`Request failed: ${r.getFormattedError}`, { exit: 1 })
    }
    const contact_method = r.getData()
    CliUx.ux.action.stop(`${chalk.bold.green('created contact method')} ${chalk.bold.blue(contact_method.contact_method.id)}`)
  }
}
