import Command from '../../base'
import {CliUx, Flags} from '@oclif/core'
import * as utils from '../../utils'
import jp from 'jsonpath'

export default class UserList extends Command {
  static description = 'List PagerDuty Users'

  static flags = {
    ...Command.flags,
    ...Command.listCommandFlags,
    email: Flags.string({
      char: 'e',
      description: 'Select users whose login email addresses contain the given text',
      exclusive: ['exact_email'],
    }),
    exact_email: Flags.string({
      char: 'E',
      description: 'Select the user whose login email is this exact text',
      exclusive: ['email'],
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
      description: 'Print user ID\'s only to stdout, for use with pipes.',
      exclusive: ['columns', 'sort', 'csv', 'extended', 'json'],
    }),
    delimiter: Flags.string({
      char: 'd',
      description: 'Delimiter for fields that have more than one value',
      default: '\n',
    }),
    ...CliUx.ux.table.flags(),
  }

  async run() {
    const {flags} = await this.parse(UserList)

    const params: Record<string, any> = {
      include: ['contact_methods', 'notification_rules', 'teams'],
    }

    if (flags.email || flags.exact_email) {
      params.query = flags.email || flags.exact_email
    }

    let users = await this.pd.fetchWithSpinner('users', {
      params: params,
      activityDescription: 'Getting users from PD',
      fetchLimit: flags.limit,
    })

    if (flags.exact_email) {
      users = users.filter((user: any) => user.email === flags.exact_email)
    }

    if (users.length === 0) {
      this.error('No users found.', {exit: 1})
    }
    if (flags.json) {
      await utils.printJsonAndExit(users)
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
        get: (row: { contact_methods: any[] }) => row.contact_methods.filter((e: any) => e.type === 'email_contact_method').map((e: any) => e.address).join(flags.delimiter),
      },
      contact_phones: {
        get: (row: { contact_methods: any[] }) => row.contact_methods.filter((e: any) => e.type === 'phone_contact_method').map((e: any) => e.address).join(flags.delimiter),
      },
      contact_sms: {
        get: (row: { contact_methods: any[] }) => row.contact_methods.filter((e: any) => e.type === 'sms_contact_method').map((e: any) => e.address).join(flags.delimiter),
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
    CliUx.ux.table(users, columns, options)
  }
}
