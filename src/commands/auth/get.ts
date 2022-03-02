import Command from '../../authbase'
import chalk from 'chalk'
import {CliUx} from '@oclif/core'

export default class AuthGet extends Command {
  static description = 'Get the current authenticated PagerDuty domain'

  static flags = {
    ...Command.flags,
  }

  async run() {
    this.requireAuth()
    CliUx.ux.action.start('Checking token')
    const domain = await this.pd.domain()

    if (!domain) {
      CliUx.ux.action.stop(chalk.bold.red('failed!'))
      this.error('Token authorization failed', {exit: 1, suggestions: ['pd auth:web', 'pd auth:set']})
    }

    const me = await this.me()
    if (me && me.user.id) {
      CliUx.ux.action.stop(chalk.bold.green('done'))
      this.log(`You are logged in to ${chalk.bold.blue(domain)} as ${chalk.bold.blue(me.user.email)} (alias: ${chalk.bold.blue(this._config.defaultAlias())})`)
    } else {
      CliUx.ux.action.stop(chalk.bold.green('done'))
      this.log(`You are logged in to ${chalk.bold.blue(domain)} using a legacy API token (alias: ${chalk.bold.blue(this._config.defaultAlias())})`)
    }
  }
}
