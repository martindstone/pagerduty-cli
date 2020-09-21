import Command from '../../base'
// import {flags} from '@oclif/command'
import chalk from 'chalk'
import cli from 'cli-ux'
import * as pd from '../../pd'

export default class AuthGet extends Command {
  static description = 'Get PagerDuty Auth token'

  static flags = {
    ...Command.flags,
  }

  async run() {
    // const {flags} = this.parse(AuthGet)

    // get a validated token from base class
    const token = this.token as string

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
