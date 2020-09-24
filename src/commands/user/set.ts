import Command from '../../base'
import {flags} from '@oclif/command'
import chalk from 'chalk'
import cli from 'cli-ux'
import * as pd from '../../pd'

export default class UserSet extends Command {
  static description = 'Set PagerDuty User attributes'

  static flags = {
    ...Command.flags,
    email: flags.string({char: 'e', description: 'User\'s login email', required: true}),
    key: flags.string({char: 'k', description: 'Attribute key to set', required: true}),
    value: flags.string({char: 'v', description: 'Attribute value to set', required: true}),
  }

  async run() {
    const {flags} = this.parse(UserSet)

    // get a validated token from base class
    const token = this.token as string

    cli.action.start('Getting user ID from PD')
    const data = await pd.request(token, '/users', 'GET', {query: flags.email})
    if (!data.users || data.users.length === 0) {
      cli.action.stop(chalk.bold.red('failed!'))
      this.error(`No user was found with email ${flags.email}`, {exit: 1})
    }
    if (data.users.length > 1) {
      cli.action.stop(chalk.bold.red('failed!'))
      this.error(`Multiple users exist matching ${chalk.bold.blue(flags.email)}. Please refine your search.`)
    }
    cli.action.stop(`${chalk.bold.blue(flags.email)} has the PagerDuty ID ${chalk.bold.blue(data.users[0].id)}`)
    cli.action.start(`Setting ${chalk.bold.blue(flags.key)} = '${chalk.bold.blue(flags.value)} on user ${chalk.bold.blue(data.users[0].id)}'`)

    const body = pd.putBodyForSetAttribute('user', data.users[0].id, flags.key, flags.value)
    const r = await pd.request(token, `/users/${data.users[0].id}`, 'PUT', null, body)
    if (r && r.user && r.user[flags.key] && r.user[flags.key] === flags.value) {
      cli.action.stop(chalk.bold.green('done!'))
    } else {
      cli.action.stop(chalk.bold.red('failed!'))
      this.error(`Failed to set ${flags.key} on ${flags.email}`, {exit: 1})
    }
  }
}
