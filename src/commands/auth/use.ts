import { BaseCommand } from '../../base/base-command'
import { Flags } from '@oclif/core'
import chalk from 'chalk'
import { Config } from '../../config'

export default class AuthUse extends BaseCommand<typeof AuthUse> {
  static description =
    'Choose a saved authenticated PagerDuty domain to use with all pd commands'

  static flags = {
    alias: Flags.string({
      char: 'a',
      description: 'The alias of the PD domain to use',
      required: true,
    }),
  }

  async run() {
    const config = new Config()
    if (config.setDefaultAlias(this.flags.alias)) {
      this.log(
        `You are logged in to ${chalk.bold.blue(
          config.getCurrentSubdomain()
        )} as ${chalk.bold.blue(
          config.get()?.user?.email || 'nobody'
        )} (alias: ${chalk.bold.blue(config.defaultAlias())})`
      )
    } else {
      this.error('No such alias', { suggestions: ['pd auth:list'], exit: 1 })
    }
  }
}
