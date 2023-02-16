import { AuthenticatedBaseCommand } from '../../base/authenticated-base-command'
import { CliUx, Flags } from '@oclif/core'
import chalk from 'chalk'
import * as utils from '../../utils'

export default class RestGet extends AuthenticatedBaseCommand<typeof RestGet> {
  static description = 'Make a GET request to PagerDuty'

  static flags = {
    endpoint: Flags.string({
      char: 'e',
      description: 'The path to the endpoint, for example, `/users/PXXXXXX` or `/services`',
      required: true,
    }),
    params: Flags.string({
      char: 'P',
      description: 'Parameters to add, for example, `query=martin` or `include[]=teams`. Specify multiple times for multiple params.',
      multiple: true,
      default: [],
    }),
    headers: Flags.string({
      char: 'H',
      description: 'Headers to add, for example, `From=martin@pagerduty.com`. Specify multiple times for multiple headers.',
      multiple: true,
      default: [],
    }),
  }

  async run() {
    const params: Record<string, any> = {}

    for (const param of this.flags.params) {
      const m = param.match(/([^=]+)=(.+)/)
      if (!m || m.length !== 3) {
        this.error(`Invalid parameter '${param}' - params should be formatted as 'key=value'`, { exit: 1 })
      }
      let key = m[1].trim()
      const value = m[2].trim()
      if (key.endsWith('[]')) {
        key = key.slice(0, -2)
        if (!(key in params)) {
          params[key] = []
        }
        params[key] = [...params[key], value]
      } else {
        params[key] = value
      }
    }

    const headers: Record<string, any> = {}

    for (const header of this.flags.headers) {
      const m = header.match(/([^=]+)=(.+)/)
      if (!m || m.length !== 3) {
        this.error(`Invalid header '${header}' - headers should be formatted as 'key=value'`, { exit: 1 })
      }
      const key = m[1].trim()
      const value = m[2].trim()
      headers[key] = value
    }

    CliUx.ux.action.start('Talking to PD')
    const response = await this.pd.request({
      endpoint: this.flags.endpoint,
      method: 'GET',
      params: params,
      headers: headers,
    })

    if (response.isFailure) {
      CliUx.ux.action.stop(chalk.bold.red('failed!'))
      this.error(`Request failed: ${response.getFormattedError()}`)
    }
    CliUx.ux.action.stop(chalk.bold.green('done'))
    this.printJsonAndExit(response.getData())
  }
}
