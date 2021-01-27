import Command from '../../../base'
import {flags} from '@oclif/command'
import cli from 'cli-ux'
import chalk from 'chalk'
import * as pd from '../../../pd'
// import * as utils from '../../../utils'
import parsePhoneNumber from 'libphonenumber-js'

export default class UserContactAdd extends Command {
  static description = 'Add a contact method to a PagerDuty user'

  static flags = {
    ...Command.flags,
    id: flags.string({
      char: 'i',
      description: 'Add contact to the user with this ID.',
      required: true,
    }),
    label: flags.string({
      char: 'l',
      description: 'The contact method label.',
      required: true,
    }),
    type: flags.string({
      char: 'T',
      description: 'The contact method type.',
      required: true,
      options: ['email', 'phone', 'sms'],
    }),
    address: flags.string({
      char: 'a',
      description: 'The contact method address or phone number.',
      required: true,
    }),
  }

  async run() {
    const {flags} = this.parse(UserContactAdd)

    // get a validated token from base class
    const token = this.token as string

    const body: any = {
      contact_method: {
        type: `${flags.type}_contact_method`,
        summary: flags.label,
        label: flags.label,
      },
    }
    if (flags.type === 'sms' || flags.type === 'phone') {
      const number = parsePhoneNumber(flags.address, 'US')
      body.contact_method.address = number?.nationalNumber
      body.contact_method.country_code = number?.countryCallingCode
    } else {
      body.contact_method.address = flags.address
    }

    cli.action.start(`Adding ${chalk.bold.blue(flags.type)} contact method for user ${chalk.bold.blue(flags.id)}`)
    const r = await pd.request(token, `/users/${flags.id}/contact_methods`, 'POST', {}, body)
    this.dieIfFailed(r)
    const contact_method = r.getValue()
    cli.action.stop(`${chalk.bold.green('created contact method')} ${chalk.bold.blue(contact_method.contact_method.id)}`)
  }
}
