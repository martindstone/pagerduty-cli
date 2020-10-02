import Command from '../../base'
import {flags} from '@oclif/command'
import chalk from 'chalk'
import cli from 'cli-ux'
import * as pd from '../../pd'
import * as utils from '../../utils'

export default class UserGet extends Command {
  static description = 'Get PagerDuty User attributes in a script-friendly format'

  static flags = {
    ...Command.flags,
    email: flags.string({
      char: 'e',
      description: 'Select users whose login email addresses contain the given text',
    }),
    ids: flags.string({
      char: 'i',
      description: 'Select users with the given ID. Specify multiple times for multiple users.',
      multiple: true,
    }),
    all: flags.boolean({
      char: 'a',
      description: 'Select all users.',
      exclusive: ['email', 'ids'],
    }),
    keys: flags.string({
      char: 'k',
      description: 'Attribute names to get. specify multiple times for multiple keys.',
      required: true,
      multiple: true,
    }),
    delimiter: flags.string({
      char: 'd',
      description: 'Output field separator.',
      default: '|',
    }),
  }

  async run() {
    const {flags} = this.parse(UserGet)

    // get a validated token from base class
    const token = this.token as string

    let user_ids_set = new Set()
    if (flags.email) {
      cli.action.start('Getting user IDs from PD')
      const users = await pd.fetch(token, '/users', {query: flags.email})
      if (!users || users.length === 0) {
        cli.action.stop(chalk.bold.red('none found'))
      }
      user_ids_set = new Set(users.map((e: {id: string}) => e.id))
    }
    if (flags.ids) {
      user_ids_set = new Set([...user_ids_set, ...utils.splitDedupAndFlatten(flags.ids)])
    }
    if (flags.all) {
      const users = await pd.fetch(token, '/users')
      user_ids_set = new Set(users.map((e: {id: string}) => e.id))
    }

    const user_ids: string[] = [...user_ids_set] as string[]

    if (user_ids.length === 0) {
      this.error('No users selected. Please specify --email or --ids', {exit: 1})
    }

    cli.action.start(`Getting ${chalk.bold.blue(flags.keys.join(flags.delimiter))} on user(s) ${chalk.bold.blue(user_ids.join(', '))}`)
    const requests: any[] = []
    for (const user_id of user_ids) {
      requests.push({
        token: token,
        endpoint: `/users/${user_id}`,
        method: 'GET',
      })
    }
    // const rs = await Promise.all(promises)
    const rs = await pd.batchedRequest(requests)
    let failed = false
    for (const r of rs) {
      if (!(r && r.user)) {
        failed = true
      }
    }
    if (failed) {
      cli.action.stop(chalk.bold.red('failed!'))
      this.error('Some requests failed. Please check your users and try again.')
    } else {
      cli.action.stop(chalk.bold.green('done'))
      for (const r of rs) {
        this.log(utils.formatRow(r, 'user', flags.keys, flags.delimiter))
      }
    }
  }
}
