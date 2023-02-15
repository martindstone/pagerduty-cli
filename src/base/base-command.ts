import { Command, Flags, Interfaces } from '@oclif/core'
import { Config } from '../config'
import { PD } from '../pd'
import chalk from 'chalk'

export type Flags<T extends typeof Command> = Interfaces.InferredFlags<typeof BaseCommand['globalFlags'] & T['flags']>

export abstract class BaseCommand<T extends typeof Command> extends Command {
  static globalFlags: Record<string, any> = {
    help: Flags.help({
      char: 'h',
    }),
    debug: Flags.boolean({
      description: 'Print REST API call debug logs',
    }),
  }

  static get usage(): any {
    const cmd = this as Interfaces.Command
    return cmd.id.split(':').join(' ')
  }

  protected _config!: Config
  protected token!: string
  protected pd!: PD
  protected flags!: Flags<T>

  public async me(die = false): Promise<any> {
    const me = await this.pd.me()
    if (die && !me) {
      this.error('Request to /users/me failed. Are you using a legacy API token?', { exit: 1 })
    }
    return me
  }

  public async init(): Promise<void> {
    await super.init()
    const { flags } = await this.parse(this.constructor as Interfaces.Command.Class)
    this.flags = flags

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
      this.error('You are not logged in to any PagerDuty domains', { suggestions: ['pd auth:set', 'pd login'], exit: 1 })
    }
  }

  protected async catch(err: Error & { exitCode?: number }): Promise<any> {
    // add any custom logic to handle errors from the command
    // or simply return the parent class error handling
    return super.catch(err)
  }

  protected async finally(_: Error | undefined): Promise<any> {
    // called after run and catch regardless of whether or not the command errored
    return super.finally(_)
  }
}
