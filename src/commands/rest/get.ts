import Command from '../../base'
import {flags} from '@oclif/command'
import chalk from 'chalk'
import cli from 'cli-ux'
import * as pd from '../../pd'
import * as utils from '../../utils'

export default class RestGet extends Command {
  static description = 'Make a GET request to PagerDuty'

  static flags = {
    ...Command.flags,
    endpoint: flags.string({
      char: 'e',
      description: 'The path to the endpoint, for example, `/users/PXXXXXX` or `/services`',
      required: true,
    }),
    params: flags.string({
      char: 'P',
      description: 'Parameters to add, for example, `query=martin` or `include[]=teams`. Specify multiple times for multiple params.',
      multiple: true,
      default: [],
    }),
    headers: flags.string({
      char: 'H',
      description: 'Headers to add, for example, `From=martin@pagerduty.com`. Specify multiple times for multiple headers.',
      multiple: true,
      default: [],
    }),
  }

  async run() {
    const {flags} = this.parse(RestGet)

    // get a validated token from base class
    const token = this.token as string

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

    cli.action.start('Talking to PD')
    const response = await pd.request(token, flags.endpoint, 'GET', params, undefined, headers)

    this.dieIfFailed(response)
    cli.action.stop(chalk.bold.green('done'))
    await utils.printJsonAndExit(response.getValue())
  }
}
