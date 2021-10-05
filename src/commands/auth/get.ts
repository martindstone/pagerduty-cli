import Command from '../../authbase'
// import {flags} from '@oclif/command'
import chalk from 'chalk'
import cli from 'cli-ux'
// import {PD} from '../../pd'

export default class AuthGet extends Command {
  static description = 'Get PagerDuty Auth token'

  static flags = {
    ...Command.flags,
  }

  async run() {
    this.requireAuth()
    cli.action.start('Checking token')
    const domain = await this.pd.domain()

    if (!domain) {
      cli.action.stop(chalk.bold.red('failed!'))
      this.error('Token authorization failed', {exit: 1, suggestions: ['pd auth:web', 'pd auth:set']})
    }

    const me = await this.me()
    if (me && me.user.id) {
      cli.action.stop(chalk.bold.green('done'))
      this.log(`You are logged in to ${chalk.bold.blue(domain)} as ${chalk.bold.blue(me.user.email)}`)
    } else {
      cli.action.stop(chalk.bold.green('done'))
      this.log(`You are logged in to ${chalk.bold.blue(domain)} using a legacy API token`)
    }
  }
}
