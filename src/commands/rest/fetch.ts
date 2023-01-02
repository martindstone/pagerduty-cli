import { AuthenticatedBaseCommand } from '../../base/authenticated-base-command'
import { CliUx, Flags } from '@oclif/core'
import * as utils from '../../utils'
import jp from 'jsonpath'
import { splitDedupAndFlatten } from '../../utils'

export default class RestFetch extends AuthenticatedBaseCommand<typeof RestFetch> {
  static description = 'Fetch objects from PagerDuty'

  static flags = {
    endpoint: Flags.string({
      char: 'e',
      description: 'The path to the endpoint, for example, `users` or `services`',
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
      default: '\\n',
    }),
    limit: Flags.integer({
      description: 'Return no more than this many entries. This option turns off table filtering options.',
      exclusive: ['filter', 'sort'],
    }),
    ...CliUx.ux.table.flags(),
  }

  public async init(): Promise<void> {
    await super.init()
    if (this.flags.delimiter === '\\n') {
      this.flags.delimiter = '\n'
    }
    if (this.flags.keys) {
      this.flags.keys = splitDedupAndFlatten(this.flags.keys)
    }
  }

  async run() {
    if (this.flags.pipe) {
      this.flags.table = true
    }

    const params: Record<string, any> = {}

    const disallowedParams = ['limit', 'offset', 'cursor']

    for (const param of this.flags.params) {
      const m = param.match(/([^=]+)=(.+)/)
      if (!m || m.length !== 3) {
        this.error(`Invalid parameter '${param}' - params should be formatted as 'key=value'`, { exit: 1 })
      }
      let key = m[1].trim()
      if (disallowedParams.includes(key)) {
        this.warn(`Parameter '${key}' is not allowed in rest:fetch - ignoring`)
        continue
      }
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
    const data = await this.pd.fetchWithSpinner(this.flags.endpoint, {
      params: params,
      headers: headers,
      fetchLimit: this.flags.limit,
    })

    if (!this.flags.table) {
      await utils.printJsonAndExit(data)
    }

    const columns: Record<string, object> = {
      id: {
        header: 'ID',
      },
    }

    const options = {
      ...this.flags, // parsed flags
    }

    if (this.flags.pipe) {
      options['no-header'] = true
    }
    if (this.flags.keys) {
      for (const key of this.flags.keys) {
        columns[key] = {
          header: key,
          get: (row: any) => utils.formatField(jp.query(row, key), this.flags.delimiter),
        }
      }
    }

    CliUx.ux.table(data, columns, options)
  }
}
