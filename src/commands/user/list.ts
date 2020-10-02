import Command from '../../base'
import {flags} from '@oclif/command'
import cli from 'cli-ux'
import * as pd from '../../pd'
import * as utils from '../../utils'
import dotProp from 'dot-prop'

export default class UserList extends Command {
  static description = 'List PagerDuty Users'

  static flags = {
    ...Command.flags,
    email: flags.string({
      char: 'e',
      description: 'Select users whose login email addresses contain the given text',
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
      description: 'Print user ID\'s only to stdin, for use with pipes.',
      exclusive: ['columns', 'filter', 'sort', 'csv', 'extended', 'json', 'keys'],
    }),
    ...cli.table.flags(),
  }

  async run() {
    const {flags} = this.parse(UserList)

    // get a validated token from base class
    const token = this.token as string

    const params: Record<string, any> = {
      include: ['contact_methods', 'notification_rules', 'teams'],
    }

    if (flags.email) {
      params.query = flags.email
    }

    cli.action.start('Getting users from PD')
    const users = await pd.fetch(token, '/users', params)
    cli.action.stop(`got ${users.length}`)

    if (flags.json) {
      this.log(JSON.stringify(users, null, 2))
      this.exit(0)
    } else if (flags.pipe) {
      this.log(users.map((e: { id: any }) => e.id).join('\n'))
      this.exit(0)
    }

    const columns: Record<string, object> = {
      id: {
        header: 'ID',
      },
      summary: {
        header: 'Name',
      },
      email: {
      },
      role: {
        extended: true,
      },
      team_names: {
        get: (row: { teams: any[] }) => row.teams.map((e: any) => e.summary).join('\n'),
        extended: true,
      },
      num_notification_rules: {
        header: '#Rules',
        get: (row: { notification_rules: string | any[] }) => row.notification_rules.length,
        extended: true,
      },
      contact_emails: {
        get: (row: { contact_methods: any[] }) => row.contact_methods.filter((e: any) => e.type === 'email_contact_method').map((e: any) => e.address).join('\n'),
      },
      contact_phones: {
        get: (row: { contact_methods: any[] }) => row.contact_methods.filter((e: any) => e.type === 'phone_contact_method').map((e: any) => e.address).join('\n'),
      },
      contact_sms: {
        get: (row: { contact_methods: any[] }) => row.contact_methods.filter((e: any) => e.type === 'sms_contact_method').map((e: any) => e.address).join('\n'),
      },
    }

    if (flags.keys) {
      for (const key of flags.keys) {
        columns[key] = {
          header: key,
          get: (row: any) => utils.formatField(dotProp.get(row, key)),
        }
      }
    }

    const options = {
      printLine: this.log,
      ...flags, // parsed flags
    }
    cli.table(users, columns, options)
  }
}
