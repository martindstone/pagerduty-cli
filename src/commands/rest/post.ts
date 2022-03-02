import Command from '../../base'
import {CliUx, Flags} from '@oclif/core'
import chalk from 'chalk'
import * as utils from '../../utils'

export default class RestPost extends Command {
  static description = 'Make a POST request to PagerDuty'

  static flags = {
    ...Command.flags,
    endpoint: Flags.string({
      char: 'e',
      description: 'The path to the endpoint, for example, `/users/PXXXXXX` or `/services`',
      required: true,
    }),
    params: Flags.string({
      char: 'P',
      description: 'Parameters to add, for example, `query=martin` or `include[]=teams. Specify multiple times for multiple params.',
      multiple: true,
      default: [],
    }),
    headers: Flags.string({
      char: 'H',
      description: 'Headers to add, for example, `From=martin@pagerduty.com`. Specify multiple times for multiple headers.',
      multiple: true,
      default: [],
    }),
    data: Flags.string({
      char: 'd',
      description: 'JSON data to send',
      required: true,
    }),
  }

  async run() {
    const {flags} = await this.parse(RestPost)

    const params: Record<string, any> = {}

    for (const param of flags.params) {
      const m = param.match(/([^=]+)=(.+)/)
      if (!m || m.length !== 3) {
        this.error(`Invalid parameter '${param}' - params should be formatted as 'key=value'`, {exit: 1})
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

    for (const header of flags.headers) {
      const m = header.match(/([^=]+)=(.+)/)
      if (!m || m.length !== 3) {
        this.error(`Invalid header '${header}' - headers should be formatted as 'key=value'`, {exit: 1})
      }
      const key = m[1].trim()
      const value = m[2].trim()
      headers[key] = value
    }

    let data: object
    try {
      data = JSON.parse(flags.data)
    } catch (error) {
      this.error(`Error parsing request body: ${(error as any).message}`, {exit: 1})
    }

    CliUx.ux.action.start('Talking to PD')
    const response = await this.pd.request({
      endpoint: flags.endpoint,
      method: 'POST',
      params: params,
      data: data,
      headers: headers,
    })

    if (response.isFailure) {
      CliUx.ux.action.stop(chalk.bold.red('failed!'))
      this.error(`Request failed: ${response.getFormattedError()}`)
    }
    CliUx.ux.action.stop(chalk.bold.green('done'))
    await utils.printJsonAndExit(response.getData())
  }
}
