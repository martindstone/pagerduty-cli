import Command from '../../../base'
import {flags} from '@oclif/command'
import cli from 'cli-ux'
import chalk from 'chalk'
import * as pd from '../../../pd'
// import * as utils from '../../../utils'
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

    // get a validated token from base class
    const token = this.token as string

    let userID
    if (flags.id) {
      userID = flags.id
    } else if (flags.email) {
      cli.action.start(`Finding PD user ${chalk.bold.blue(flags.email)}`)
      userID = await pd.userIDForEmail(token, flags.email)
      if (!userID) {
        cli.action.stop(chalk.bold.red('failed!'))
        this.error(`No user was found for the email "${flags.email}"`, {exit: 1})
      }
    } else {
      this.error('You must specify one of: -i, -e', {exit: 1})
    }

    cli.action.start(`Finding contact ${chalk.bold.blue(flags.contact_id)}`)
    let r = await pd.request(token, `users/${userID}/contact_methods/${flags.contact_id}`, 'GET')
    this.dieIfFailed(r)
    const body: any = r.getValue()

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
    r = await pd.request(token, `/users/${userID}/contact_methods/${flags.contact_id}`, 'PUT', {}, body)
    this.dieIfFailed(r)
    cli.action.stop(chalk.bold.green('done'))
  }
}
