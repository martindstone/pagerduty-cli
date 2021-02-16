import Command from '../../../base'
import {flags} from '@oclif/command'
import cli from 'cli-ux'
import chalk from 'chalk'
import * as pd from '../../../pd'
import * as utils from '../../../utils'
import jp from 'jsonpath'
import parsePhoneNumber from 'libphonenumber-js'

const types: Record<string, string> = {
  phone_contact_method: 'Phone',
  push_notification_contact_method: 'Push',
  email_contact_method: 'Email',
  sms_contact_method: 'SMS',
}

export default class UserContactList extends Command {
  static description = 'List a PagerDuty User\'s contact methods.'

  static flags = {
    ...Command.flags,
    id: flags.string({
      char: 'i',
      description: 'Show contacts for the user with this ID.',
      exclusive: ['email'],
    }),
    email: flags.string({
      char: 'e',
      description: 'Show contacts for the user with this login email.',
      exclusive: ['id'],
    }),
    keys: flags.string({
      char: 'k',
      description: 'Additional fields to display. Specify multiple times for multiple fields.',
      multiple: true,
    }),
    json: flags.boolean({
      char: 'j',
      description: 'output full details as JSON',
      exclusive: ['columns', 'filter', 'sort', 'csv', 'extended'],
    }),
    pipe: flags.boolean({
      char: 'p',
      description: 'Print contact ID\'s only to stdout, for use with pipes.',
      exclusive: ['columns', 'sort', 'csv', 'extended', 'json'],
    }),
    delimiter: flags.string({
      char: 'd',
      description: 'Delimiter for fields that have more than one value',
      default: '\n',
    }),
    ...cli.table.flags(),
  }

  async run() {
    const {flags} = this.parse(UserContactList)

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

    cli.action.start(`Getting contact methods for user ${chalk.bold.blue(userID)}`)
    const r = await pd.fetch(token, `/users/${userID}/contact_methods`)
    this.dieIfFailed(r)
    const contact_methods = r.getValue()
    cli.action.stop(chalk.bold.green(`got ${contact_methods.length}`))

    if (flags.json) {
      await utils.printJsonAndExit(contact_methods)
    }

    const columns: Record<string, object> = {
      id: {
        header: 'ID',
      },
      label: {
      },
      type: {
        get: (row: Record<string, string>) => {
          return types[row.type] || row.type
        },
      },
      address: {
        get: (row: Record<string, any>) => {
          if (row.type === 'phone_contact_method' || row.type === 'sms_contact_method') {
            const number = parsePhoneNumber(`+${row.country_code} ${row.address}`)
            return number?.formatInternational()
          }
          return row.address
        },
      },
    }

    if (flags.keys) {
      for (const key of flags.keys) {
        columns[key] = {
          header: key,
          get: (row: any) => utils.formatField(jp.query(row, key), flags.delimiter),
        }
      }
    }

    const options = {
      printLine: this.log,
      ...flags, // parsed flags
    }
    if (flags.pipe) {
      for (const k of Object.keys(columns)) {
        if (k !== 'id') {
          const colAny = columns[k] as any
          colAny.extended = true
        }
      }
      options['no-header'] = true
    }
    cli.table(contact_methods, columns, options)
  }
}
