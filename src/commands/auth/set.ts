import {Command, flags} from '@oclif/command'
import * as chalk from 'chalk'
import cli from 'cli-ux'
import * as pd from '../../pd'
import * as config from '../../config'

export default class AuthSet extends Command {
  static description = 'Set PagerDuty Auth token'

  static flags = {
    help: flags.help({char: 'h'}),
    token: flags.string({char: 't', description: 'A PagerDuty API token'})
  }

  async run() {
    const {flags} = this.parse(AuthSet)

    let token: string = flags.token
    if (!token) {
      token = await config.promptForAuth()
    }
    if ( !pd.isValidToken ) {
      this.error('Invalid token', {exit: 1})
    }
    cli.action.start('Checking token')
    if (pd.isBearerToken(token)) {
      const me = await pd.me(token)
      if ( me && me.user && me.user.html_url ) {
        const domain = me.user.html_url.match(/https:\/\/(.*)\.pagerduty.com\/.*/)[1]
        config.setAuth(token)
        cli.action.stop(chalk.bold.green('done'))
      } else {
        cli.action.stop(chalk.bold.red('failed!'))
        this.error('Invalid token', {exit: 1, suggestions: ['pd auth:web']})
      }  
    } else {
      const users = await pd.request(token, '/users', 'GET', {limit: 1})
      if (users && users.users && users.users.length === 1) {
        const domain = users.users[0].html_url.match(/https:\/\/(.*)\.pagerduty.com\/.*/)[1]
        config.setAuth(token)
        cli.action.stop(chalk.bold.green('done'))
      } else {
        cli.action.stop(chalk.bold.red('failed!'))
        this.error('Token authorization failed', {exit: 1, suggestions: ['pd auth:web']})
      }
    }
  }
}
