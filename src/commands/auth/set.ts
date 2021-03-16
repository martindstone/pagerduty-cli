import {Command, flags} from '@oclif/command'
import chalk from 'chalk'
import cli from 'cli-ux'
import {PD} from '../../pd'
import * as config from '../../config'

export default class AuthSet extends Command {
  static description = 'Set PagerDuty Auth token'

  static flags = {
    ...Command.flags,
    token: flags.string({char: 't', description: 'A PagerDuty API token'}),
  }

  async run() {
    const {flags} = this.parse(AuthSet)

    let token = flags.token
    if (!token) {
      token = await config.promptForAuth()
    }
    if (!PD.isValidToken(token)) {
      this.error('Invalid token', {exit: 1})
    }
    const pd = new PD(token)

    cli.action.start('Checking token')

    const domain = await pd.domain()

    if (!domain) {
      cli.action.stop(chalk.bold.red('failed!'))
      this.error('Token authorization failed', {exit: 1, suggestions: ['pd auth:web', 'pd auth:set']})
    }

    if (PD.isBearerToken(token)) {
      const me = await pd.me()
      if (me && me.user.id) {
        cli.action.stop(chalk.bold.green('done'))
        this.log(`You are logged in to ${chalk.bold.blue(domain)} as ${chalk.bold.blue(me.user.email)}`)
      } else {
        cli.action.stop(chalk.bold.red('failed!'))
        this.error('Token authorization failed', {exit: 1, suggestions: ['pd auth:web', 'pd auth:set']})
      }
    } else {
      cli.action.stop(chalk.bold.green('done'))
      this.log(`You are logged in to ${chalk.bold.blue(domain)} using a legacy API token`)
    }
    config.setAuth(token)
  }
}
