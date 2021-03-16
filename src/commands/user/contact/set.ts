import Command from '../../../base'
import {flags} from '@oclif/command'
import cli from 'cli-ux'
import chalk from 'chalk'
import parsePhoneNumber from 'libphonenumber-js'

export default class UserContactSet extends Command {
  static description = 'Update a contact method for a PagerDuty user'

  static flags = {
    ...Command.flags,
    id: flags.string({
      char: 'i',
      description: 'Update a contact for the user with this ID.',
      exclusive: ['email'],
    }),
    email: flags.string({
      char: 'e',
      description: 'Update a contact for the user with this login email.',
      exclusive: ['id'],
    }),
    contact_id: flags.string({
      char: 'c',
      description: 'Update the contact with this ID.',
      required: true,
    }),
    label: flags.string({
      char: 'l',
      description: 'The contact method label to set.',
    }),
    address: flags.string({
      char: 'a',
      description: 'The contact method address or phone number to set.',
    }),
  }

  async run() {
    const {flags} = this.parse(UserContactSet)

    let userID
    if (flags.id) {
      userID = flags.id
    } else if (flags.email) {
      cli.action.start(`Finding PD user ${chalk.bold.blue(flags.email)}`)
      userID = await this.pd.userIDForEmail(flags.email)
      if (!userID) {
        cli.action.stop(chalk.bold.red('failed!'))
        this.error(`No user was found for the email "${flags.email}"`, {exit: 1})
      }
    } else {
      this.error('You must specify one of: -i, -e', {exit: 1})
    }

    cli.action.start(`Finding contact ${chalk.bold.blue(flags.contact_id)}`)
    let r = await this.pd.request({
      endpoint: `users/${userID}/contact_methods/${flags.contact_id}`,
      method: 'GET',
    })

    if (r.isFailure) {
      cli.action.stop(chalk.bold.red('failed!'))
      this.error(`Request failed: ${r.getFormattedError}`, {exit: 1})
    }

    const body: any = r.getData()

    if (flags.address) {
      if (body.contact_method.type === 'sms' || body.contact_method.type === 'phone') {
        const number = parsePhoneNumber(flags.address, 'US')
        body.contact_method.address = number?.nationalNumber
        body.contact_method.country_code = number?.countryCallingCode
      } else {
        body.contact_method.address = flags.address
      }
    }

    if (flags.label) {
      body.contact_method.summary = flags.label
      body.contact_method.label = flags.label
    }

    cli.action.start(`Updating contact method ${flags.contact_id} for user ${chalk.bold.blue(userID)}`)
    r = await this.pd.request({
      endpoint: `users/${userID}/contact_methods/${flags.contact_id}`,
      method: 'PUT',
      data: body,
    })
    if (r.isFailure) {
      cli.action.stop(chalk.bold.red('failed!'))
      this.error(`Request failed: ${r.getFormattedError()}`, {exit: 1})
    }
    const contact_method = r.getData()
    cli.action.stop(`${chalk.bold.green('updated contact method')} ${chalk.bold.blue(contact_method.contact_method.id)}`)
  }
}
