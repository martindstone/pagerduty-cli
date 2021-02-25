/* eslint-disable no-process-exit */
/* eslint-disable unicorn/no-process-exit */
import Command from '../../base'
import {flags} from '@oclif/command'
import chalk from 'chalk'
import cli from 'cli-ux'
import * as pd from '../../pd'
import * as utils from '../../utils'
import jp from 'jsonpath'

export default class RestFetch extends Command {
  static description = 'Fetch objects from PagerDuty'

  static flags = {
    ...Command.flags,
    endpoint: flags.string({
      char: 'e',
      description: 'The path to the endpoint, for example, `/users/PXXXXXX` or `/services`',
      required: true,
    }),
    params: flags.string({
      char: 'P',
      description: 'Parameters to add, for example, `query=martin` or `include[]=teams. Specify multiple times for multiple params.',
      multiple: true,
      default: [],
    }),
    headers: flags.string({
      char: 'H',
      description: 'Headers to add, for example, `From=martin@pagerduty.com`. Specify multiple times for multiple headers.',
      multiple: true,
      default: [],
    }),
    table: flags.boolean({
      char: 't',
      description: 'Output in table format instead of JSON',
    }),
    keys: flags.string({
      char: 'k',
      description: 'Additional fields to display, for use with `--table`. Specify multiple times for multiple fields.',
      multiple: true,
    }),
    pipe: flags.boolean({
      char: 'p',
      description: 'Print object ID\'s only to stdout, for use with pipes.',
      exclusive: ['columns', 'sort', 'csv', 'extended', 'json', 'keys'],
    }),
    delimiter: flags.string({
      char: 'd',
      description: 'Delimiter for fields that have more than one value, for use with `--table`.',
      default: '\n',
    }),
    ...cli.table.flags(),
  }

  async run() {
    const {flags} = this.parse(RestFetch)

    if (flags.pipe) {
      flags.table = true
    }
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
    const response = await pd.fetch(token, flags.endpoint, params, headers)

    this.dieIfFailed(response)
    const data = response.getValue()
    cli.action.stop(chalk.bold.green('done'))

    if (!flags.table) {
      await utils.printJsonAndExit(data)
    }

    const columns: Record<string, object> = {
      id: {
        header: 'ID',
      },
    }

    const options = {
      printLine: this.log,
      ...flags, // parsed flags
    }

    if (flags.pipe) {
      options['no-header'] = true
    }
    if (flags.keys) {
      for (const key of flags.keys) {
        columns[key] = {
          header: key,
          get: (row: any) => utils.formatField(jp.query(row, key), flags.delimiter),
        }
      }
    }

    cli.table(data, columns, options)
  }
}
