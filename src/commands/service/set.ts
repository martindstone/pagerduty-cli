import { AuthenticatedBaseCommand } from '../../base/authenticated-base-command'
import { CliUx, Flags } from '@oclif/core'
import chalk from 'chalk'
import getStream from 'get-stream'
import jp from 'jsonpath'
import * as utils from '../../utils'

export default class ServiceSet extends AuthenticatedBaseCommand<typeof ServiceSet> {
  static description = 'Set PagerDuty Service attributes'

  static flags = {
    names: Flags.string({
      char: 'n',
      description: 'Select services whose names contain the given text. Specify multiple times for multiple names.',
      multiple: true,
    }),
    exact_names: Flags.string({
      char: 'N',
      description: 'Select a service whose name is this exact text. Specify multiple times for multiple services.',
      multiple: true,
    }),
    ids: Flags.string({
      char: 'i',
      description: 'Select services with the given ID. Specify multiple times for multiple services.',
      multiple: true,
    }),
    keys: Flags.string({
      char: 'k',
      description: 'Attribute keys to set. Specify multiple times to set multiple keys.',
      required: true,
      multiple: true,
    }),
    values: Flags.string({
      char: 'v',
      description: 'Attribute values to set. To set multiple key/values, specify multiple times in the same order as the keys.',
      required: true,
      multiple: true,
    }),
    jsonvalues: Flags.boolean({
      description: 'Interpret values as JSON [default: true]',
      default: true,
      allowNo: true,
    }),
    pipe: Flags.boolean({
      char: 'p',
      description: 'Read service ID\'s from stdin.',
      exclusive: ['names', 'exact_names', 'ids'],
    }),
  }

  async run() {
    if (!(this.flags.names || this.flags.exact_names || this.flags.ids || this.flags.pipe)) {
      this.error('You must specify one of: -i, -n, -N, -p', { exit: 1 })
    }
    if (this.flags.keys.length !== this.flags.values.length) {
      this.error('You must specify the same number of keys and values for this to work.', { exit: 1 })
    }

    let service_ids: string[] = []
    if (this.flags.names) {
      CliUx.ux.action.start('Getting service IDs from PD')
      service_ids = [...service_ids, ...await this.pd.serviceIDsForNames(this.flags.names)]
    }
    if (this.flags.exact_names) {
      CliUx.ux.action.start('Getting service IDs from PD')
      service_ids = [...service_ids, ...await this.pd.serviceIDsForNames(this.flags.exact_names, true)]
    }
    if (this.flags.ids) {
      service_ids = [...service_ids, ...utils.splitDedupAndFlatten(this.flags.ids)]
    }
    if (this.flags.pipe) {
      const str: string = await getStream(process.stdin)
      service_ids = utils.splitDedupAndFlatten([str])
    }
    CliUx.ux.action.stop(chalk.bold.green('done'))
    service_ids = [...new Set(service_ids)]
    if (service_ids.length === 0) {
      this.error('No service ID\'s were found. Please try a different search.', { exit: 1 })
    }
    const invalid_ids = utils.invalidPagerDutyIDs(service_ids)
    if (invalid_ids && invalid_ids.length > 0) {
      this.error(`Invalid service ID's: ${invalid_ids.join(', ')}`, { exit: 1 })
    }

    const attributes = []
    for (const [i, key] of this.flags.keys.entries()) {
      let value = this.flags.values[i]
      if (this.flags.jsonvalues) {
        try {
          const jsonvalue = JSON.parse(value)
          value = jsonvalue
        } catch (e) { }
      }
      attributes.push({ key, value })
    }

    const requests: any[] = []
    for (const service_id of service_ids) {
      const body: Record<string, any> = utils.putBodyForSetAttributes('service', service_id, attributes)
      requests.push({
        endpoint: `/services/${service_id}`,
        method: 'PUT',
        params: {},
        data: body,
      })
    }
    const kvString = attributes.map(a => `${a.key}=${JSON.stringify(a.value)}`).join(', ')
    const r = await this.pd.batchedRequestWithSpinner(requests, {
      activityDescription: `Setting ${chalk.bold.blue(kvString)}' on ${service_ids.length} services`,
    })
    for (const failure of r.getFailedIndices()) {
      // eslint-disable-next-line no-console
      console.error(`${chalk.bold.red('Failed to set service ')}${chalk.bold.blue(requests[failure].data.service.id)}: ${r.results[failure].getFormattedError()}`)
    }
    for (const s of r.getDatas()) {
      for (const { key, value } of attributes) {
        const returnedValues = jp.query(s.service, key)
        const returnedValue = returnedValues ? returnedValues[0] : null
        if (returnedValue !== value) {
          if (typeof value === 'object' && value !== null) {
            // special case when the value to be set was an object
            if (JSON.stringify(returnedValue) === JSON.stringify(value)) {
              continue
            }
          }
          if (key === 'status' && value === 'active') {
            // special case when setting status = active, it can come back as active, warning or critical
            if (['active', 'warning', 'critical'].indexOf(returnedValue) > -1) {
              continue
            }
          }
          // eslint-disable-next-line no-console
          console.error(`${chalk.bold.red('Failed to set value on service ')}${chalk.bold.blue(s.service.id)}`)
        }
      }
    }
  }
}
