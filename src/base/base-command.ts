import { Command, Flags, Interfaces, CliUx } from '@oclif/core'
import { Config } from '../config'
import { PD } from '../pd'
import * as utils from '../utils'
import jp from 'jsonpath'
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

  async printJsonAndExit(data: any) {
    if (!data) {
      this.exit()
    }
    CliUx.ux.styledJSON(data)
    await CliUx.ux.flush(1000)
    this.exit()
  }

  printTable(rows: any[], columns: Record<string, object>, flags: any) {
    const _columns = { ...columns }
    if (flags.pipe && flags.pipe !== 'input') {
      this.log(rows.map(x => x.id).join('\n'))
      return
    }
    if (flags.keys) {
      for (const key of flags.keys) {
        let header = key
        let path = key
        if (key.indexOf('=') > 0 && key.indexOf('=') < key.length - 1) {
          const kvre = /([^=]+)=(.*)/
          const match = key.match(kvre)
          header = match[1]
          path = match[2]
        }
        _columns[header] = {
          header,
          get: (row: any) => utils.formatField(jp.query(row, path), flags.delimiter),
        }
      }
    }
    CliUx.ux.table(rows, _columns, { ...flags })
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
