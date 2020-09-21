import Command from '../../base'
import {flags} from '@oclif/command'
import cli from 'cli-ux'
import * as pd from '../../pd'

export default class UserList extends Command {
  static description = 'List PagerDuty Users'

  static flags = {
    ...Command.flags,
    json: flags.boolean({char: 'j', description: 'output full details as JSON', exclusive: ['columns', 'filter', 'sort', 'csv', 'extended']}),
    ...cli.table.flags(),
  }

  async run() {
    const {flags} = this.parse(UserList)

    // get a validated token from base class
    const token = this.token as string

    cli.action.start('Getting users from PD')
    const users = await pd.fetch(token, '/users')
    cli.action.stop(`got ${users.length}`)
    if (flags.json) {
      this.log(JSON.stringify(users, null, 2))
      return
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
      notification_rules: {
        header: 'Notif. Rules',
        get: (row: { notification_rules: string | any[] }) => row.notification_rules.length,
        extended: true,
      },
      contact_methods: {
        header: 'Cont. Methods',
        get: (row: { contact_methods: string | any[] }) => row.contact_methods.length,
        extended: true,
      },
    }
    const options = {
      printLine: this.log,
      ...flags, // parsed flags
    }
    cli.table(users, columns, options)
  }
}
