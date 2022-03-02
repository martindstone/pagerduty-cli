import Command from '../../authbase'
import {CliUx, Flags} from '@oclif/core'
import chalk from 'chalk'
import {Config} from '../../config'
import * as http from 'http'

import {AccessToken, AuthorizationCode, AuthorizationTokenConfig} from 'simple-oauth2'

export default class AuthWeb extends Command {
  static description = 'Authenticate with PagerDuty in the browser'

  static aliases = ['login']

  static flags = {
    ...Command.flags,
    alias: Flags.string({
      char: 'a',
      description: 'The alias to use for this token. Defaults to the name of the PD subdomain',
    }),
    default: Flags.boolean({
      char: 'd',
      description: 'Use this token as the default for all PD commands',
      default: true,
      allowNo: true,
    }),
  }

  async run() {
    const {flags} = await this.parse(this.ctor)

    const config = {
      client: {
        id: '4cd1af90cbf22d5d880aafbbb1829835e0a79c7d8811b0a8e87138bd61caf734',
        secret: '4c42b8fffe4cc36ebfff88fa783d842af4cc44e43f7aae5590488d7d3574bebd',
      },
      auth: {
        tokenHost: 'https://app.pagerduty.com',
      },
    }
    const client = new AuthorizationCode(config)

    const state = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    const authorizationUri = client.authorizeURL({
      redirect_uri: 'http://127.0.0.1:8000/callback',
      scope: 'user',
      state: state,
    })

    try {
      await CliUx.ux.open(authorizationUri)
    } catch (error) {
      this.error(`Couldn't open a browser for web authentication: ${error}`, {
        exit: 1,
        suggestions: [
          `Get a token from ${chalk.bold.blue('https://martindstone.github.io/PDOAuth/')}`,
          `Then run ${chalk.bold.blue('pd auth:set')}`,
        ],
      })
    }

    const server = http.createServer()

    // Maintain a hash of all connected sockets
    const sockets: Record<any, any> = {}
    let nextSocketId = 0
    server.on('connection', function (socket) {
      // Add a newly connected socket
      const socketId = nextSocketId++
      sockets[socketId] = socket

      // Remove the socket when it closes
      socket.on('close', function () {
        delete sockets[socketId]
      })
    })

    server.on('request', (req, res) => {
      // eslint-disable-next-line node/no-unsupported-features/node-builtins
      const urlParts = new URL(req.url as string, `http://${req.headers.host}`)
      if (urlParts.pathname === '/callback' && urlParts.searchParams.has('code')) {
        const tokenParams: AuthorizationTokenConfig = {
          code: urlParts.searchParams.get('code') as string,
          redirect_uri: 'http://127.0.0.1:8000/callback',
          scope: 'user',
        }
        client.getToken(tokenParams).then(accessToken => {
          if (accessToken && accessToken.token && accessToken.token.access_token) {
            const token = accessToken.token.access_token
            CliUx.ux.action.start(`Checking token ${chalk.bold.blue(token)}`)
            // sometimes PD gives an error when immediately making a request
            setTimeout(this.checkToken, 2_000, accessToken, this, flags)
          } else {
            CliUx.ux.action.stop(chalk.bold.red('failed - response didn\'t contain a token'))
            this.error('Missing token', {exit: 1, suggestions: ['Get a token from the web at https://martindstone.github.io/PDOAuth']})
          }
        }, _ => {
          CliUx.ux.action.stop(chalk.bold.red('grant request failed'))
          this.error('Grant request error', {exit: 1, suggestions: ['Get a token from the web at https://martindstone.github.io/PDOAuth']})
        })

        res.statusCode = 200
        res.end('\n\n  ok you can close the browser window now')

        server.close()
        setTimeout(() => {
          for (const socket of Object.values(sockets)) {
            socket.destroy()
          }
        }, 500)
      } else if (urlParts.searchParams.has('error_description')) {
        CliUx.ux.action.stop(chalk.bold.red('failed'))
        // eslint-disable-next-line no-console
        console.error(urlParts.searchParams.get('error_description'))
        res.statusCode = 200
        res.end('\n\n  ok you can close the browser window now')
        server.close()
        setTimeout(() => {
          for (const socket of Object.values(sockets)) {
            socket.destroy()
          }
        }, 500)
      } else {
        CliUx.ux.action.stop(chalk.bold.red('failed'))
        // eslint-disable-next-line no-console
        console.error('Authentication failed')
        res.statusCode = 200
        res.end('\n\n  ok you can close the browser window now')
        server.close()
        setTimeout(() => {
          for (const socket of Object.values(sockets)) {
            socket.destroy()
          }
        }, 500)
      }
    })

    try {
      server.listen(8000, () => {
        CliUx.ux.action.start('Waiting for browser authentication')
      })
    } catch (error) {
      this.error('Couldn\'t start a local server for web authentication', {
        exit: 1,
        suggestions: [
          `Get a token from ${chalk.bold.blue('https://martindstone.github.io/PDOAuth/')}`,
          `Then run ${chalk.bold.blue('pd auth:set')}`,
        ],
      })
    }
  }

  checkToken(body: AccessToken, self: any, flags?: any) {
    Config.configForTokenResponseBody(body, flags?.alias).then(configSubdomain => {
      const verb = self._config.has(configSubdomain.alias) ? 'updated' : 'added'
      self._config.put(configSubdomain, flags?.default)
      self._config.save()
      CliUx.ux.action.stop(chalk.bold.green('done'))
      if (flags.default) {
        self.log(`${chalk.bold(`Domain ${verb} -`)} you are logged in to ${chalk.bold.blue(self._config.getCurrentSubdomain())} as ${chalk.bold.blue(self._config.get()?.user.email)}`)
      } else {
        self.log(`${chalk.bold(`Domain ${verb}, default unchanged -`)} you are logged in to ${chalk.bold.blue(self._config.getCurrentSubdomain())} as ${chalk.bold.blue(self._config.get()?.user.email)} (alias: ${chalk.bold.blue(self._config.defaultAlias())})`)
      }
    }).catch(error => {
      CliUx.ux.action.stop(chalk.bold.red(`failed: ${error.message}`))
    })
  }
}
