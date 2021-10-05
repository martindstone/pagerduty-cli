import Command, {flags} from '@oclif/command'
import {Config} from './config'
import {PD} from './pd'
import chalk from 'chalk'

export default abstract class AuthBase extends Command {
  static flags = {
    help: flags.help({
      char: 'h',
    }),
    debug: flags.boolean({
      description: 'Print REST API call debug logs',
    }),
  }

  protected _config!: Config

  protected token!: string

  protected pd!: PD

  async me(die = false): Promise<any> {
    const me = await this.pd.me()
    if (die && !me) {
      this.error('Request to /users/me failed. Are you using a legacy API token?', {exit: 1})
    }
    return me
  }

  async init() {
    const {flags} = this.parse(this.ctor)

    this._config = new Config()
    this.token = this._config.token()
    if (this.token) {
      this.pd = new PD(this.token, flags.debug)
    }
    if (this._config.isOldConfig()) {
      this._config.initEmpty()
      if (PD.isLegacyToken(this.token)) {
        const subdomainConfig = await Config.configForLegacyToken(this.token)
        this._config.put(subdomainConfig, true)
      } else if (PD.isBearerToken(this.token)) {
        const subdomainConfig = await Config.configForBearerToken(this.token)
        this._config.put(subdomainConfig, true)
      }
      this._config.save()
      this._config.load()
    }

    if ((flags as any).output) {
      chalk.level = 0
    }
  }

  isAuthenticated(): boolean {
    if (this.pd) {
      return true
    }
    return false
  }

  requireAuth() {
    if (!this.isAuthenticated()) {
      this.error('You are not logged in to any PagerDuty domains', {suggestions: ['pd auth:set', 'pd login'], exit: 1})
    }
  }
}
