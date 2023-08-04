import { ListBaseCommand } from '../../base/list-base-command'
import { CliUx, Flags } from '@oclif/core'
import parsePhoneNumber from 'libphonenumber-js'

export default class UserList extends ListBaseCommand<typeof UserList> {
  static pdObjectName = 'user'
  static pdObjectNamePlural = 'users'
  static description = 'List PagerDuty Users'

  static flags = {
    email: Flags.string({
      char: 'e',
      description: 'Select users whose login email addresses contain the given text',
      exclusive: ['exact_email', 'name'],
    }),
    exact_email: Flags.string({
      char: 'E',
      description: 'Select the user whose login email is this exact text',
      exclusive: ['email', 'name'],
    }),
    ...CliUx.ux.table.flags(),
  }

  async run() {
    const params: Record<string, any> = {
      include: ['contact_methods', 'notification_rules', 'teams'],
    }

    if (this.flags.email || this.flags.exact_email || this.flags.name) {
      params.query = this.flags.email || this.flags.exact_email || this.flags.name
    }

    let users = await this.pd.fetchWithSpinner('users', {
      params: params,
      activityDescription: 'Getting users from PD',
      fetchLimit: this.flags.limit,
    })

    if (this.flags.exact_email) {
      users = users.filter((user: any) => user.email === this.flags.exact_email)
    }

    if (users.length === 0) {
      this.error('No users found.', { exit: 1 })
    }
    if (this.flags.json) {
      await this.printJsonAndExit(users)
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
        get: (row: { contact_methods: any[] }) => row.contact_methods.filter((e: any) => e.type === 'email_contact_method').map((e: any) => e.address).join(this.flags.delimiter),
      },
      contact_phones: {
        get: (row: { contact_methods: any[] }) => row.contact_methods.filter((e: any) => e.type === 'phone_contact_method').map((e: any) => {
          const number = parsePhoneNumber(`+${e.country_code} ${e.address}`)
          return number?.formatInternational() || ""
        }).join(this.flags.delimiter),
      },
      contact_sms: {
        get: (row: { contact_methods: any[] }) => row.contact_methods.filter((e: any) => e.type === 'sms_contact_method').map((e: any) => {
          const number = parsePhoneNumber(`+${e.country_code} ${e.address}`)
          return number?.formatInternational() || ""
        }).join(this.flags.delimiter),
      },
    }

    this.printTable(users, columns, this.flags)
  }
}
