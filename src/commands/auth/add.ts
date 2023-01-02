import { BaseCommand } from '../../base/base-command'
import { CliUx, Flags } from '@oclif/core'
import chalk from 'chalk'
import { Config } from '../../config'

export default class AuthAdd extends BaseCommand<typeof AuthAdd> {
  static description = 'Add an authenticated PagerDuty domain'

  static aliases = ['auth:set']

  static flags = {
    token: Flags.string({
      char: 't',
      description: 'A PagerDuty API token',
    }),
    alias: Flags.string({
      char: 'a',
      description:
        'The alias to use for this token. Defaults to the name of the PD subdomain',
    }),
    default: Flags.boolean({
      char: 'd',
      description: 'Use this token as the default for all PD commands',
      default: true,
      allowNo: true,
    }),
  }

  async run() {
    let token = this.flags.token
    if (!token) {
      token = await CliUx.ux.prompt('Enter a PagerDuty API token')
    }
    token = token || ''

    try {
      CliUx.ux.action.start('Checking token')
      const subdomain = await Config.configForToken(token, this.flags.alias)
      this._config.put(subdomain, this.flags.default)
      this._config.save()
      CliUx.ux.action.stop(chalk.bold.green('done'))
      this.log(
        `You are logged in to ${chalk.bold.blue(
          this._config.getCurrentSubdomain()
        )} as ${chalk.bold.blue(
          this._config.getCurrentUserEmail() || 'nobody'
        )} (alias: ${chalk.bold.blue(this._config.defaultAlias())})`
      )
    } catch (error) {
      CliUx.ux.action.stop(chalk.bold.red('failed!'))
      if (error instanceof Error) {
        this.error(error.message, { exit: 1 })
      }
      this.error(error as string, { exit: 1 })
    }
  }
}
