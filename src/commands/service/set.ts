/* eslint-disable complexity */
import Command from '../../base'
import {CliUx, Flags} from '@oclif/core'
import chalk from 'chalk'
import getStream from 'get-stream'
import * as utils from '../../utils'

export default class ServiceSet extends Command {
  static description = 'Set PagerDuty Service attributes'

  static flags = {
    ...Command.flags,
    name: Flags.string({
      char: 'n',
      description: 'Select services whose names contain the given text',
    }),
    ids: Flags.string({
      char: 'i',
      description: 'Select services with the given ID. Specify multiple times for multiple services.',
      multiple: true,
    }),
    key: Flags.string({
      char: 'k',
      description: 'Attribute key to set',
      required: true,
    }),
    value: Flags.string({
      char: 'v',
      description: 'Attribute value to set',
      required: true,
    }),
    pipe: Flags.boolean({
      char: 'p',
      description: 'Read service ID\'s from stdin.',
      exclusive: ['name', 'ids'],
    }),
  }

  async run() {
    const {flags} = await this.parse(ServiceSet)

    if (!(flags.name || flags.ids || flags.pipe)) {
      this.error('You must specify one of: -i, -n, -p', {exit: 1})
    }
    let service_ids: string[] = []
    if (flags.name) {
      CliUx.ux.action.start('Getting service IDs from PD')
      const services = await this.pd.fetch('services', {params: {query: flags.name}})
      if (!services || services.length === 0) {
        CliUx.ux.action.stop(chalk.bold.red('none found'))
      }
      service_ids = services.map((e: { id: any }) => e.id)
    } else if (flags.ids) {
      service_ids = utils.splitDedupAndFlatten(flags.ids)
    } else if (flags.pipe) {
      const str: string = await getStream(process.stdin)
      service_ids = utils.splitDedupAndFlatten([str])
    }
    const invalid_ids = utils.invalidPagerDutyIDs(service_ids)
    if (invalid_ids && invalid_ids.length > 0) {
      this.error(`Invalid service ID's: ${invalid_ids.join(', ')}`, {exit: 1})
    }

    const key = flags.key
    const value = flags.value.trim().length > 0 ? flags.value : null

    const requests: any[] = []
    for (const service_id of service_ids) {
      const body: Record<string, any> = utils.putBodyForSetAttribute('service', service_id, key, value)
      requests.push({
        endpoint: `/services/${service_id}`,
        method: 'PUT',
        params: {},
        data: body,
      })
    }
    const r = await this.pd.batchedRequestWithSpinner(requests, {
      activityDescription: `Setting ${chalk.bold.blue(flags.key)} = '${chalk.bold.blue(flags.value)}' on ${service_ids.length} services`,
    })
    for (const failure of r.getFailedIndices()) {
      // eslint-disable-next-line no-console
      console.error(`${chalk.bold.red('Failed to set service ')}${chalk.bold.blue(requests[failure].data.service.id)}: ${r.results[failure].getFormattedError()}`)
    }
    for (const s of r.getDatas()) {
      if (s.service[key] !== value) {
        if (key === 'status' && value === 'active') {
          // special case when setting status = active, it can come back as active, warning or critical
          if (['active', 'warning', 'critical'].indexOf(s.service[key]) > -1) {
            continue
          }
        }
        // eslint-disable-next-line no-console
        console.error(`${chalk.bold.red('Failed to set value on service ')}${chalk.bold.blue(s.service.id)}`)
      }
    }
  }
}
