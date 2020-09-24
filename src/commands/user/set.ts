import Command from '../../base'
import {flags} from '@oclif/command'
import chalk from 'chalk'
import cli from 'cli-ux'
import * as pd from '../../pd'

export default class UserSet extends Command {
  static description = 'Set PagerDuty User attributes'

  static flags = {
    ...Command.flags,
    email: flags.string({
      char: 'e',
      description: 'Select users whose emails contain the given text',
    }),
    ids: flags.string({
      char: 'i',
      description: 'Select users with the given ID. Specify multiple times for multiple users.',
      multiple: true,
    }),
    key: flags.string({
      char: 'k',
      description: 'Attribute key to set',
      required: true,
    }),
    value: flags.string({
      char: 'v',
      description: 'Attribute value to set',
      required: true,
    }),
  }

  async run() {
    const {flags} = this.parse(UserSet)

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
      user_ids_set = new Set([...user_ids_set, ...flags.ids])
    }

    const key = flags.key
    const value = flags.value.trim().length > 0 ? flags.value : null
    const user_ids: string[] = [...user_ids_set] as string[]

    cli.action.start(`Setting ${chalk.bold.blue(flags.key)} = '${chalk.bold.blue(flags.value)}' on user(s) ${chalk.bold.blue(user_ids.join(', '))}`)
    const requests: any[] = []
    for (const user_id of user_ids) {
      const body: Record<string, any> = pd.putBodyForSetAttribute('user', user_id, key, value)
      requests.push({
        token: token,
        endpoint: `/users/${user_id}`,
        method: 'PUT',
        params: {},
        data: body,
      })
    }
    // const rs = await Promise.all(promises)
    const rs = await pd.batchedRequest(requests)
    let failed = false
    for (const r of rs) {
      if (!(r && r.user && key in r.user && r.user[key] === value)) {
        failed = true
      }
    }
    if (failed) {
      cli.action.stop(chalk.bold.red('failed!'))
      this.error('Some requests failed. Please check your users and try again.')
    } else {
      cli.action.stop(chalk.bold.green('done'))
    }
  }
}
