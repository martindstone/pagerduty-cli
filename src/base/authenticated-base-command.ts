import { Command, Flags, Interfaces, CliUx } from '@oclif/core'
import { BaseCommand } from './base-command'
import { Config, ConfigSubdomain, CLIENT_ID, CLIENT_SECRET } from '../config'
import { PD } from '../pd'
import chalk from 'chalk'
import { AuthorizationCode } from 'simple-oauth2'

export type Flags<T extends typeof Command> = Interfaces.InferredFlags<typeof AuthenticatedBaseCommand['globalFlags'] & T['flags']>

export abstract class AuthenticatedBaseCommand<T extends typeof Command> extends BaseCommand<typeof AuthenticatedBaseCommand> {
  static globalFlags = {
    ...super.globalFlags,
    useauth: Flags.string({
      char: 'b',
      description: 'Use the saved REST API token with this alias',
    }),
    token: Flags.string({
      description: 'Ignore the saved configuration and use this token',
      exclusive: ['useauth'],
    }),
  }

  protected flags!: Flags<T>

  public async refreshToken(alias: string | undefined): Promise<boolean> {
    const { alias: configAlias, subdomain, accessToken: access_token, refreshToken: refresh_token, expiresAt: expires_at } = this._config.get(alias) as ConfigSubdomain

    if (!(expires_at && refresh_token && PD.isBearerToken(access_token as string))) {
      return false
    }

    const expiresAt = new Date(expires_at)
    const now = new Date()
    if (now < expiresAt) {
      return false
    }

    CliUx.ux.action.start(`Token for ${chalk.bold.blue(subdomain)} has expired, refreshing`)
    const client = new AuthorizationCode({
      client: {
        id: CLIENT_ID,
        secret: CLIENT_SECRET,
      },
      auth: {
        tokenHost: 'https://identity.pagerduty.com',
      },
    })
    const refreshTokenObj = client.createToken({
      access_token,
      refresh_token,
      expires_at,
      token_type: 'bearer',
    })
    try {
      const newToken = await refreshTokenObj.refresh()
      const configSubdomain = await Config.configForTokenResponseBody(newToken, configAlias)
      this._config.put(configSubdomain)
      this._config.save()
      CliUx.ux.action.stop(chalk.bold.green('done'))
      return true
    } catch (error) {
      CliUx.ux.action.stop(chalk.bold.red('failed! ' + error))
    }
    return false
  }

  public async init(): Promise<void> {
    await super.init()

    this._config = new Config()
    if (this.flags.token) {
      this._config.initEmpty()
      const domainConfig = await Config.configForToken(this.flags.token)
      this._config.put(domainConfig, true)
      this.token = this.flags.token
      this.pd = new PD(this.token, this.flags.debug)
    } else {
      this.token = this._config.token(this.flags.useauth)
      if (this.token) {
        this.pd = new PD(this.token, this.flags.debug)
      }
      if (!this.token) {
        if (this.flags.useauth) {
          this.error(`No PagerDuty authentication was found for alias ${chalk.bold.blue(this.flags.useauth)}`, {
            suggestions: [`pd auth:set -a ${this.flags.useauth}`, `pd login -a ${this.flags.useauth}`],
            exit: 1,
          })
        }
        this.error('No PagerDuty authentication was found', {
          suggestions: ['pd auth:set', 'pd login'],
          exit: 1,
        })
      }
      await this.refreshToken(this.flags.useauth)
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

    if ((this.flags as any).output || (this.flags as any).csv) {
      chalk.level = 0
    }
  }
}
