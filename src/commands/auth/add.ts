import Command from '../../authbase'
import {flags} from '@oclif/command'
import chalk from 'chalk'
import cli from 'cli-ux'
import {Config} from '../../config'

export default class AuthAdd extends Command {
  static description = 'Add an authenticated PagerDuty domain'

  static aliases = ['auth:set']

  static flags = {
    ...Command.flags,
    token: flags.string({
      char: 't',
      description: 'A PagerDuty API token',
    }),
    alias: flags.string({
      char: 'a',
      description: 'The alias to use for this token. Defaults to the name of the PD subdomain',
    }),
    default: flags.boolean({
      char: 'd',
      description: 'Use this token as the default for all PD commands',
      default: true,
      allowNo: true,
    }),
  }

  async run() {
    const {flags} = this.parse(AuthAdd)

    let token = flags.token
    if (!token) {
      token = await cli.prompt('Enter a PagerDuty API token')
    }
    token = token || ''

    try {
      cli.action.start('Checking token')
      // const config = new Config()
      const subdomain = await Config.configForToken(token, flags.alias)
      this._config.put(subdomain, flags.default)
      this._config.save()
      cli.action.stop(chalk.bold.green('done'))
      this.log(`You are logged in to ${chalk.bold.blue(this._config.getCurrentSubdomain())} as ${chalk.bold.blue(this._config.getCurrentUserEmail() || 'nobody')} (alias: ${chalk.bold.blue(this._config.defaultAlias())})`)
    } catch (error) {
      cli.action.stop(chalk.bold.red('failed!'))
      if (error instanceof Error) {
        this.error(error.message, {exit: 1})
      }
      this.error(error as string, {exit: 1})
    }
  }
}
