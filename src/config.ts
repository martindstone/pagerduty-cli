import * as fs from 'fs-extra'
import * as path from 'path'
import cli from 'cli-ux'

const globalAny: any = global

export function initConfig(): void {
  const configFilePath = path.join(globalAny.config.configDir, 'config.json')
  fs.ensureFileSync(configFilePath)
  fs.writeJsonSync(configFilePath, {token: null})
}

export function setAuth(token: string): void {
  const configFilePath = path.join(globalAny.config.configDir, 'config.json')
  let userConfig: any = null
  try {
    userConfig = fs.readJsonSync(configFilePath)
  } catch (error) {
    initConfig()
    userConfig = fs.readJsonSync(configFilePath)
  }
  userConfig.token = token
  fs.writeJsonSync(configFilePath, userConfig)
}

export async function promptForAuth(): Promise<string> {
  return cli.prompt('Enter a PD API key')
}

export function getAuth(): string | null {
  const configFilePath = path.join(globalAny.config.configDir, 'config.json')
  try {
    const userConfig = fs.readJsonSync(configFilePath)
    return userConfig.token
  } catch (error) {
    return null
  }
}
