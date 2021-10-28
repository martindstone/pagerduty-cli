import * as fs from 'fs-extra'
import * as path from 'path'
import {PD} from './pd'
import {AccessToken} from 'simple-oauth2'

const globalAny: any = global

const initialConfig = {
  defaultSubdomain: null,
  subdomains: [],
}

export type ConfigSubdomain = {
  alias: string;
  subdomain: string;
  user?: any;
  legacyToken?: string;
  isDomainToken?: boolean;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: string;
}

export class Config {
  private _configFilePath: any

  private _config: any

  public static async configForToken(token: string, alias?: string): Promise<ConfigSubdomain> {
    if (PD.isLegacyToken(token)) {
      return this.configForLegacyToken(token, alias)
    }
    if (PD.isBearerToken(token)) {
      return this.configForBearerToken(token, alias)
    }
    throw new Error('Invalid token')
  }

  public static async configForLegacyToken(token: string, alias?: string): Promise<ConfigSubdomain> {
    if (!PD.isLegacyToken(token)) {
      throw new Error('Invalid token')
    }
    const pd = new PD(token)
    const me = await pd.me()
    const subdomain = await pd.domain()

    if (!subdomain) {
      throw new Error('Token auth failed')
    }

    if (me) {
      return {
        alias: alias || subdomain,
        subdomain,
        user: me.user,
        legacyToken: token,
      }
    }

    return {
      alias: alias || subdomain,
      subdomain,
      legacyToken: token,
      isDomainToken: true,
    }
  }

  public static async configForBearerToken(token: string, alias?: string): Promise<ConfigSubdomain> {
    if (!PD.isBearerToken(token)) {
      throw new Error('Invalid token')
    }
    const pd = new PD(token)
    const me = await pd.me()
    const subdomain = await pd.domain()

    if (!subdomain) {
      throw new Error('Token auth failed')
    }

    return {
      alias: alias || subdomain,
      subdomain,
      user: me.user,
      accessToken: token,
    }
  }

  public static async configForTokenResponseBody(body: AccessToken, alias?: string): Promise<ConfigSubdomain> {
    if (!PD.isBearerToken(body.token.access_token)) {
      throw new Error(`Invalid token ${body.token.access_token}`)
    }
    const accessToken = body.token.access_token
    const refreshToken = body.token.refresh_token

    const pd = new PD(accessToken)
    const me = await pd.me()
    const subdomain = await pd.domain()

    if (!subdomain) {
      throw new Error('Token auth failed')
    }

    if (PD.isOldBearerToken(accessToken)) {
      // do old body
      return {
        alias: alias || subdomain,
        subdomain,
        user: me.user,
        accessToken,
        refreshToken,
      }
    }

    if (PD.isNewBearerToken(accessToken)) {
      // do new body
      return {
        alias: alias || subdomain,
        subdomain,
        user: me.user,
        accessToken,
        refreshToken,
        expiresAt: body.token.expires_at,
      }
    }
    throw new Error('Unknown error')
  }

  constructor(configFilePath?: string) {
    this._configFilePath = configFilePath || path.join(globalAny.config.configDir, 'config.json')
    if (!this.load()) {
      this.initEmpty()
    }
  }

  public load(): boolean {
    try {
      this._config = fs.readJsonSync(this._configFilePath)
    } catch (error) {
      return false
    }
    return true
  }

  public save(): boolean {
    try {
      fs.ensureFileSync(this._configFilePath)
      fs.writeJsonSync(this._configFilePath, this._config)
    } catch (error) {
      return false
    }
    return true
  }

  public initEmpty(): void {
    this._config = initialConfig
  }

  public isOldConfig(): boolean {
    if (this._config && 'token' in this._config) {
      return true
    }
    return false
  }

  public token(alias?: string): string {
    if (this.isOldConfig()) {
      return this._config.token
    }
    const config = this.get(alias)
    if (config?.accessToken) {
      return config.accessToken
    }
    if (config?.legacyToken) {
      return config.legacyToken
    }
    return ''
  }

  public all(): ConfigSubdomain[] {
    return this._config.subdomains
  }

  public defaultAlias(): string {
    return this._config.defaultSubdomain
  }

  public setDefaultAlias(alias: string): boolean {
    const subdomain = this.get(alias)
    if (subdomain === null) {
      return false
    }
    this._config.defaultSubdomain = alias
    if (this.save()) {
      return true
    }
    return false
  }

  public get(alias?: string): ConfigSubdomain | null {
    let searchForAlias = this._config.defaultSubdomain
    if (alias) {
      searchForAlias = alias
    }
    const subdomains = this._config.subdomains.filter((x: ConfigSubdomain) => x.alias === searchForAlias)
    if (subdomains.length === 1) {
      return subdomains[0]
    }
    return null
  }

  public has(alias: string): boolean {
    if (this.get(alias)) {
      return true
    }
    return false
  }

  public put(subdomain: ConfigSubdomain, setDefault = false): void {
    const index = this._config.subdomains.findIndex((x: ConfigSubdomain) => x.alias === subdomain.alias)
    if (index === -1) {
      this._config.subdomains.push(subdomain)
    } else {
      this._config.subdomains[index] = subdomain
    }
    if (setDefault || !this._config.defaultSubdomain) {
      this._config.defaultSubdomain = subdomain.alias
    }
  }

  public delete(alias: string): boolean {
    const index = this._config.subdomains.findIndex((x: ConfigSubdomain) => x.alias === alias)
    if (index === -1) {
      return false
    }
    this._config.subdomains.splice(index, 1)
    if (this._config.defaultSubdomain === alias) {
      if (this._config.subdomains.length > 0) {
        this._config.defaultSubdomain = this._config.subdomains[0].alias
      } else {
        this._config.defaultSubdomain = ''
      }
    }
    return true
  }

  public setDefault(alias: string): boolean {
    const index = this._config.subdomains.findIndex((x: ConfigSubdomain) => x.alias === alias)
    if (index === -1) {
      return false
    }
    this._config.defaultSubdomain = alias
    return true
  }

  public getCurrentSubdomain(): string {
    return this.get()?.subdomain || ''
  }

  public getCurrentUserEmail(): string {
    return this.get()?.user?.email || ''
  }
}

// export function initConfig(): void {
//   const configFilePath = path.join(globalAny.config.configDir, 'config.json')
//   fs.ensureFileSync(configFilePath)
//   fs.writeJsonSync(configFilePath, {token: null})
// }

// export function setAuth(token: string): void {
//   const configFilePath = path.join(globalAny.config.configDir, 'config.json')
//   let userConfig: any = null
//   try {
//     userConfig = fs.readJsonSync(configFilePath)
//   } catch (error) {
//     initConfig()
//     userConfig = fs.readJsonSync(configFilePath)
//   }
//   userConfig.token = token
//   fs.writeJsonSync(configFilePath, userConfig)
// }

// export async function promptForAuth(): Promise<string> {
//   return cli.prompt('Enter a PD API key')
// }

// export function getAuth(): string {
//   const configFilePath = path.join(globalAny.config.configDir, 'config.json')
//   const userConfig = fs.readJsonSync(configFilePath)
//   return userConfig.token
// }
