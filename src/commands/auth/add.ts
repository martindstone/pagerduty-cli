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
    refresh_token: Flags.string({
      char: 'r',
      description:
        'OAuth2 refresh token',
      dependsOn: ['token', 'expires_at']
    }),
    expires_at: Flags.string({
      char: 'e',
      description:
        'Expiration date for token. Required if using --refresh_token',
      dependsOn: ['refresh_token','token']
    }),

  }

  async run() {
    let {
      token,
      refresh_token,
      expires_at
    } = this.flags

    if (!token) {
      token = await CliUx.ux.prompt('Enter a PagerDuty API token')
      refresh_token = await CliUx.ux.prompt('Enter a OAuth2 Refresh token (optional)', {required: false})
      if (refresh_token) {
        expires_at = await CliUx.ux.prompt('Enter an expiration date in ISO8601 datetime format (required)')
      }
    }
    token = token || ''

    if (refresh_token && expires_at && !expires_at.match(/^[1-9]\d{3}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/)) {
      this.error('--expires_at must be in a ISO8601 datetime format', { exit: 1 })
    }

    try {
      CliUx.ux.action.start('Checking token')
      const subdomain = refresh_token
        ? await Config.configForTokenResponseBody({token: {access_token: token, refresh_token: refresh_token, expires_at: expires_at}}, this.flags.alias) 
        : await Config.configForToken(token, this.flags.alias)
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
