import Command from '../../../base'
import {flags} from '@oclif/command'
import cli from 'cli-ux'
import chalk from 'chalk'
import parsePhoneNumber from 'libphonenumber-js'

export default class UserContactAdd extends Command {
  static description = 'Add a contact method to a PagerDuty user'

  static flags = {
    ...Command.flags,
    id: flags.string({
      char: 'i',
      description: 'Add contact to the user with this ID.',
      exclusive: ['email'],
    }),
    email: flags.string({
      char: 'e',
      description: 'Add contact to the user with this login email.',
      exclusive: ['id'],
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

    cli.action.start(`Adding ${chalk.bold.blue(flags.type)} contact method for user ${chalk.bold.blue(userID)}`)
    const r = await this.pd.request({
      endpoint: `users/${userID}/contact_methods`,
      method: 'POST',
      data: body,
    })
    if (r.isFailure) {
      cli.action.stop(chalk.bold.red('failed!'))
      this.error(`Request failed: ${r.getFormattedError}`, {exit: 1})
    }
    const contact_method = r.getData()
    cli.action.stop(`${chalk.bold.green('created contact method')} ${chalk.bold.blue(contact_method.contact_method.id)}`)
  }
}
