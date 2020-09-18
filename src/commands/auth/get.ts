import {Command, flags} from '@oclif/command'
import * as chalk from 'chalk'
import cli from 'cli-ux'
import * as pd from '../../pd'
import * as config from '../../config'
import { pseudoRandomBytes } from 'crypto'

export default class AuthGet extends Command {
  static description = 'Get PagerDuty Auth token'

  static flags = {
    help: flags.help({char: 'h'}),
  }

  async run() {
    const {flags} = this.parse(AuthGet)
    const token = config.getAuth()

    if ( !token ) {
      this.error('No auth token found', {exit: 1, suggestions: ['pd auth:web', 'pd auth:set']})
    }

    if ( !pd.isValidToken(token) ) {
      this.error(`Token '${token}' is not valid`, {exit: 1, suggestions: ['pd auth:web', 'pd auth:set']})
    }

    cli.action.start('Checking token')
    if (pd.isBearerToken(token)) {
      const me = await pd.me(token)
      if (me && me.user.id) {
        cli.action.stop(chalk.bold.green('done'))
        const domain = me.user.html_url.match(/https:\/\/(.*)\.pagerduty.com\/.*/)[1]
        this.log(`You are logged in to ${chalk.bold.blue(domain)} as ${chalk.bold.blue(me.user.email)}`)
      } else {
        cli.action.stop(chalk.bold.red('failed!'))
        this.error('Token authorization failed', {exit: 1, suggestions: ['pd auth:web', 'pd auth:set']})
      }
    } else {
      const users = await pd.request(token, '/users', 'GET', {limit: 1})
      if (users && users.users && users.users.length === 1) {
        cli.action.stop(chalk.bold.green('done'))
        const domain = users.users[0].html_url.match(/https:\/\/(.*)\.pagerduty.com\/.*/)[1]
        this.log(`You are logged in to ${chalk.bold.blue(domain)} using a legacy API token`)
      } else {
        cli.action.stop(chalk.bold.red('failed!'))
        this.error('Token authorization failed', {exit: 1, suggestions: ['pd auth:web', 'pd auth:set']})
      }
    }
  }
}
