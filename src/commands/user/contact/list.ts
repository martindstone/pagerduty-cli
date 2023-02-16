import { AuthenticatedBaseCommand } from '../../../base/authenticated-base-command'
import { CliUx, Flags } from '@oclif/core'
import chalk from 'chalk'
import * as utils from '../../../utils'
import jp from 'jsonpath'
import { splitDedupAndFlatten } from '../../../utils'
import parsePhoneNumber from 'libphonenumber-js'

const types: Record<string, string> = {
  phone_contact_method: 'Phone',
  push_notification_contact_method: 'Push',
  email_contact_method: 'Email',
  sms_contact_method: 'SMS',
}

export default class UserContactList extends AuthenticatedBaseCommand<typeof UserContactList> {
  static description = 'List a PagerDuty User\'s contact methods.'

  static flags = {
    id: Flags.string({
      char: 'i',
      description: 'Show contacts for the user with this ID.',
      exclusive: ['email'],
    }),
    email: Flags.string({
      char: 'e',
      description: 'Show contacts for the user with this login email.',
      exclusive: ['id'],
    }),
    keys: Flags.string({
      char: 'k',
      description: 'Additional fields to display. Specify multiple times for multiple fields.',
      multiple: true,
    }),
    json: Flags.boolean({
      char: 'j',
      description: 'output full details as JSON',
      exclusive: ['columns', 'filter', 'sort', 'csv', 'extended'],
    }),
    pipe: Flags.boolean({
      char: 'p',
      description: 'Print contact ID\'s only to stdout, for use with pipes.',
      exclusive: ['columns', 'sort', 'csv', 'extended', 'json'],
    }),
    delimiter: Flags.string({
      char: 'd',
      description: 'Delimiter for fields that have more than one value',
      default: '\\n',
    }),
    ...CliUx.ux.table.flags(),
  }

  public async init(): Promise<void> {
    await super.init()
    if (this.flags.delimiter === '\\n') {
      this.flags.delimiter = '\n'
    }
    if (this.flags.keys) {
      this.flags.keys = splitDedupAndFlatten(this.flags.keys)
    }
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

    const contact_methods = await this.pd.fetchWithSpinner(`users/${userID}/contact_methods`, {
      activityDescription: `Getting contact methods for user ${chalk.bold.blue(userID)}`,
    })

    if (this.flags.json) {
      this.printJsonAndExit(contact_methods)
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

    if (this.flags.keys) {
      for (const key of this.flags.keys) {
        columns[key] = {
          header: key,
          get: (row: any) => utils.formatField(jp.query(row, key), this.flags.delimiter),
        }
      }
    }

    this.printTable(contact_methods, columns, this.flags)
  }
}
