/* eslint-disable no-process-exit */
/* eslint-disable unicorn/no-process-exit */
import Command from '../../base'
import {CliUx, Flags} from '@oclif/core'
import * as utils from '../../utils'
import jp from 'jsonpath'

export default class RestFetch extends Command {
  static description = 'Fetch objects from PagerDuty'

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
    table: Flags.boolean({
      char: 't',
      description: 'Output in table format instead of JSON',
    }),
    keys: Flags.string({
      char: 'k',
      description: 'Additional fields to display, for use with `--table`. Specify multiple times for multiple fields.',
      multiple: true,
    }),
    pipe: Flags.boolean({
      char: 'p',
      description: 'Print object ID\'s only to stdout, for use with pipes.',
      exclusive: ['columns', 'sort', 'csv', 'extended', 'json', 'keys'],
    }),
    delimiter: Flags.string({
      char: 'd',
      description: 'Delimiter for fields that have more than one value, for use with `--table`.',
      default: '\n',
    }),
    ...CliUx.ux.table.flags(),
  }

  async run() {
    const {flags} = await this.parse(RestFetch)

    if (flags.pipe) {
      flags.table = true
    }

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

    CliUx.ux.action.start('Talking to PD')
    const data = await this.pd.fetchWithSpinner(flags.endpoint, {
      params: params,
      headers: headers,
    })

    if (!flags.table) {
      await utils.printJsonAndExit(data)
    }

    const columns: Record<string, object> = {
      id: {
        header: 'ID',
      },
    }

    const options = {
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

    CliUx.ux.table(data, columns, options)
  }
}
