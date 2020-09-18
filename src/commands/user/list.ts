import {Command, flags} from '@oclif/command'
import cli from 'cli-ux'
import * as pd from '../../pd'
import * as config from '../../config'

export default class UserList extends Command {
  static description = 'List PagerDuty Users'

  static flags = {
    help: flags.help({char: 'h'}),
    json: flags.boolean({char: 'j', description: 'output full details as JSON', exclusive: ['columns', 'filter', 'sort', 'csv', 'extended']}),
    ...cli.table.flags(),
  }

  async run() {
    const {flags} = this.parse(UserList)

    const token = config.getAuth() as string

    if ( !token ) {
      this.error('No auth token found', {exit: 1, suggestions: ['pd auth:web', 'pd auth:set']})
    }

    if ( !pd.isValidToken(token) ) {
      this.error(`Token '${token}' is not valid`, {exit: 1, suggestions: ['pd auth:web', 'pd auth:set']})
    }

    cli.action.start('Getting users from PD')
    const users = await pd.fetch(token, '/users')
    cli.action.stop(`got ${users.length}`)
    if (flags.json) {
      this.log(JSON.stringify(users, null, 2))
      return
    }
    const columns: Table.Columns = {
      id: {
        header: 'ID',
      },
      summary: {
        header: 'Name',
      },
      email: {
      },
      role: {
        extended: true
      },
      notification_rules: {
        header: 'Notif. Rules',
        get: row => row.notification_rules.length,
        extended: true,
      },
      contact_methods: {
        header: 'Cont. Methods',
        get: row => row.contact_methods.length,
        extended: true,
      }
    }
    const options = {
      printLine: this.log,
      ...flags, // parsed flags
    }
    cli.table(users, columns, options)
  }
}
