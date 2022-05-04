import AuthBase from './authbase'
// import {flags} from '@oclif/command'
import {Flags} from '@oclif/core'
import {Config} from './config'
import {PD} from './pd'
import chalk from 'chalk'

export default abstract class Base extends AuthBase {
  static flags = {
    ...AuthBase.flags,
    useauth: Flags.string({
      char: 'b',
      description: 'Use the saved REST API token with this alias',
    }),
    token: Flags.string({
      description: 'Ignore the saved configuration and use this token',
      exclusive: ['useauth'],
    }),
  }

  static listCommandFlags = {
    limit: Flags.integer({
      description: 'Return no more than this many entries. This option turns off table filtering options.',
      exclusive: ['filter', 'sort'],
    }),
  }

  async init() {
    const {flags} = await this.parse(this.ctor)

    if ('limit' in flags && flags.limit <= 0) {
      if (flags.limit <= 0) {
        this.error('Oops, you can\'t have a limit of <= 0', {exit: 1})
      }
    }

    this._config = new Config()
    if (flags.token) {
      this._config.initEmpty()
      const domainConfig = await Config.configForToken(flags.token)
      this._config.put(domainConfig, true)
      this.token = flags.token
      this.pd = new PD(this.token, flags.debug)
    } else {
      this.token = this._config.token(flags.useauth)
      if (this.token) {
        this.pd = new PD(this.token, flags.debug)
      }
      if (!this.token) {
        if (flags.useauth) {
          this.error(`No PagerDuty authentication was found for alias ${chalk.bold.blue(flags.useauth)}`, {
            suggestions: [`pd auth:set -a ${flags.useauth}`, `pd login -a ${flags.useauth}`],
            exit: 1,
          })
        }
        this.error('No PagerDuty authentication was found', {
          suggestions: ['pd auth:set', 'pd login'],
          exit: 1,
        })
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
    }

    if ((flags as any).output || (flags as any).csv) {
      chalk.level = 0
    }
  }
}
