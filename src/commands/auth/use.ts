import Command from '../../authbase'
// import {flags} from '@oclif/command'
import chalk from 'chalk'
// import cli from 'cli-ux'
// import {PD} from '../../pd'
import {Config} from '../../config'

export default class AuthUse extends Command {
  static description = 'Choose a saved authenticated PagerDuty domain'

  static flags = {
    ...Command.flags,
  }

  static args = [
    {
      name: 'alias',
      description: 'The PagerDuty domain alias to use (see pd auth:list)',
      required: true,
    },
  ]

  async run() {
    const {args} = this.parse(AuthUse)
    const config = new Config()
    if (config.setDefaultAlias(args.alias)) {
      this.log(`You are logged in to ${chalk.bold.blue(config.getCurrentSubdomain())} as ${chalk.bold.blue(config.get()?.user?.email || 'nobody')}`)
    } else {
      this.error('No such alias', {suggestions: ['pd auth:list'], exit: 1})
    }
  }
}
