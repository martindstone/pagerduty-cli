import { BaseCommand } from '../../base/base-command'
import { CliUx, Flags } from '@oclif/core'
import chalk from 'chalk'
import { Config, CLIENT_ID, CLIENT_SECRET } from '../../config'
import * as http from 'http'
import { Socket } from 'node:net'

import {
  AccessToken,
  AuthorizationCode,
  AuthorizationTokenConfig,
  ModuleOptions,
} from 'simple-oauth2'

export default class AuthWeb extends BaseCommand<typeof AuthWeb> {
  static description = 'Authenticate with PagerDuty in the browser'

  static aliases = ['login']

  static flags = {
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

  private client!: AuthorizationCode
  private server!: http.Server
  private sockets: Record<any, any> = {}
  private nextSocketID = 0

  async run() {
    const config: ModuleOptions = {
      client: {
        id: CLIENT_ID,
        secret: CLIENT_SECRET,
      },
      auth: {
        tokenHost: 'https://app.pagerduty.com',
      },
      options: {
        bodyFormat: 'form',
        authorizationMethod: 'body',
      }
    }
    this.client = new AuthorizationCode(config)

    const state =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    const authorizationUri = this.client.authorizeURL({
      redirect_uri: 'http://127.0.0.1:8000/callback',
      scope: 'read write openid',
      state: state,
    })

    try {
      await CliUx.ux.open(authorizationUri)
    } catch (error) {
      this.reportError(`Couldn't open a browser for web authentication: ${error}`)
    }

    const p = new Promise<AccessToken>((resolve, reject) => {
      this.setupServer(resolve, reject)
    })

    try {
      this.server.listen(8000, () => {
        CliUx.ux.action.start('Waiting for browser authentication')
      })
    } catch (error) {
      this.reportError('Couldn\'t start a local server for web authentication')
    }
    try {
      const accessToken = await p
      CliUx.ux.action.start('Checking token ' + chalk.bold.blue(accessToken.token.access_token))
      const result = await this.checkToken(accessToken)
      if (result) {
        CliUx.ux.action.stop(chalk.bold.green('done'))
      } else {
        CliUx.ux.action.stop(chalk.bold.red('failed!'))
      }
    } catch (error: any) {
      CliUx.ux.action.stop(chalk.bold.red('failed!'))
      this.reportError(error.toString())
    }
  }

  reportError(message: string) {
    this.error(message, {
      exit: 1,
      suggestions: [
        `Get a token from ${chalk.bold.blue(
          'https://martindstone.github.io/PDOAuth/'
        )}`,
        `Then run ${chalk.bold.blue('pd auth:set')}`,
      ],
    })
  }

  trackConnectionSocket(socket: Socket) {
    // Add a newly connected socket
    const socketId = this.nextSocketID++
    this.sockets[socketId] = socket

    // Remove the socket when it closes
    socket.on('close', () => {
      delete this.sockets[socketId]
    })
  }

  async cleanup() {
    this.server.close()
    await CliUx.ux.wait(200)
    for (const socket of Object.values(this.sockets)) {
      socket.destroy()
    }
  }

  setupServer(resolve: any, reject: any) {
    this.server = http.createServer()
    this.server.timeout = 0

    this.server.on('connection', this.trackConnectionSocket.bind(this))

    this.server.on('request', async (req, res) => {
      // eslint-disable-next-line node/no-unsupported-features/node-builtins
      const urlParts = new URL(req.url as string, `http://${req.headers.host}`)
      if (
        urlParts.pathname === '/callback' &&
        urlParts.searchParams.has('code')
      ) {
        const tokenParams: AuthorizationTokenConfig = {
          code: urlParts.searchParams.get('code') as string,
          redirect_uri: 'http://127.0.0.1:8000/callback',
          scope: 'user',
        }

        try {
          const accessToken = await this.client.getToken(tokenParams)
          resolve(accessToken)
        } catch (error: any) {
          reject(error.message)
        } finally {
          res.statusCode = 200
          res.end('\n\n  ok you can close the browser window now')
          this.cleanup()
        }
      } else if (urlParts.searchParams.has('error_description')) {
        res.statusCode = 200
        res.end(`\n\n  Oops! ${urlParts.searchParams.get('error_description')}` +
          '\n\n  Close the browser window and look at your terminal for more info')
        this.cleanup()
        reject(urlParts.searchParams.get('error_description'))
      } else {
        res.statusCode = 200
        res.end('\n\n  Oops! Authentication failed' +
          '\n\n  Close the browser window and look at your terminal for more info')
        this.cleanup()
        reject('Authentication failed')
      }
    })
  }

  async checkToken(accessToken: AccessToken): Promise<boolean> {
    try {
      const configSubdomain = await Config.configForTokenResponseBody(
        accessToken,
        this.flags.alias
      )
      const verb = this._config.has(configSubdomain.alias)
        ? 'updated'
        : 'added'
      this._config.put(configSubdomain, this.flags.default)
      this._config.save()
      CliUx.ux.action.stop(chalk.bold.green('done'))
      if (this.flags.default) {
        this.log(
          `${chalk.bold(
            `Domain ${verb} -`
          )} you are logged in to ${chalk.bold.blue(
            this._config.getCurrentSubdomain()
          )} as ${chalk.bold.blue(this._config.get()?.user.email)}`
        )
      } else {
        this.log(
          `${chalk.bold(
            `Domain ${verb}, default unchanged -`
          )} you are logged in to ${chalk.bold.blue(
            this._config.getCurrentSubdomain()
          )} as ${chalk.bold.blue(
            this._config.get()?.user.email
          )} (alias: ${chalk.bold.blue(this._config.defaultAlias())})`
        )
      }
      return true
    } catch (error) {
      CliUx.ux.action.stop(chalk.bold.red(`failed: ${error}`))
      return false
    }
  }
}
