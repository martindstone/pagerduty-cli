/* eslint-disable complexity */
import Command from '../../base'
import {flags} from '@oclif/command'
import chalk from 'chalk'
import cli from 'cli-ux'
import getStream from 'get-stream'
import * as pd from '../../pd'
import * as utils from '../../utils'

export default class ServiceSet extends Command {
  static description = 'Set PagerDuty Service attributes'

  static flags = {
    ...Command.flags,
    name: flags.string({
      char: 'n',
      description: 'Select services whose names contain the given text',
    }),
    ids: flags.string({
      char: 'i',
      description: 'Select services with the given ID. Specify multiple times for multiple services.',
      multiple: true,
    }),
    key: flags.string({
      char: 'k',
      description: 'Attribute key to set',
      required: true,
    }),
    value: flags.string({
      char: 'v',
      description: 'Attribute value to set',
      required: true,
    }),
    pipe: flags.boolean({
      char: 'p',
      description: 'Read service ID\'s from stdin.',
      exclusive: ['name', 'ids'],
    }),
  }

  async run() {
    const {flags} = this.parse(ServiceSet)

    // get a validated token from base class
    const token = this.token as string

    if (!(flags.name || flags.ids || flags.pipe)) {
      this.error('You must specify one of: -i, -n, -p', {exit: 1})
    }
    let service_ids: string[] = []
    if (flags.name) {
      cli.action.start('Getting service IDs from PD')
      // const services = await pd.fetch(token, '/services', {query: flags.name})
      const r = await pd.fetch(token, '/services', {query: flags.name})
      this.dieIfFailed(r)
      const services = r.getValue()
      if (!services || services.length === 0) {
        cli.action.stop(chalk.bold.red('none found'))
      }
      service_ids = services.map((e: { id: any }) => e.id)
    }
    if (flags.ids) {
      service_ids = [...new Set([...service_ids, ...utils.splitDedupAndFlatten(flags.ids)])]
    }
    if (flags.pipe) {
      const str: string = await getStream(process.stdin)
      service_ids = utils.splitDedupAndFlatten([str])
    }
    const invalid_ids = utils.invalidPagerDutyIDs(service_ids)
    if (invalid_ids && invalid_ids.length > 0) {
      this.error(`Invalid service ID's: ${invalid_ids.join(', ')}`, {exit: 1})
    }

    const key = flags.key
    const value = flags.value.trim().length > 0 ? flags.value : null

    cli.action.start(`Setting ${chalk.bold.blue(flags.key)} = '${chalk.bold.blue(flags.value)}' on service(s) ${chalk.bold.blue(service_ids.join(', '))}`)
    const requests: any[] = []
    for (const service_id of service_ids) {
      const body: Record<string, any> = pd.putBodyForSetAttribute('service', service_id, key, value)
      requests.push({
        token: token,
        endpoint: `/services/${service_id}`,
        method: 'PUT',
        params: {},
        data: body,
      })
    }
    const r = await pd.batchedRequest(requests)
    this.dieIfFailed(r)
    const returnedIncidents = r.getValue()
    const failed = []
    for (const r of returnedIncidents) {
      if (!(r && r.service && key in r.service && r.service[key] === value)) {
        if (key === 'status' && value === 'active') {
          // special case when setting status = active, it can come back as active, warning or critical
          if (['active', 'warning', 'critical'].indexOf(r.service[key]) === -1) {
            failed.push(r.incident.id)
          }
        } else {
          failed.push(r.incident.id)
        }
      }
    }
    if (failed.length > 0) {
      cli.action.stop(chalk.bold.red('failed!'))
      this.error(`Service set request failed for incidents ${chalk.bold.red(failed.join(', '))}`)
    } else {
      cli.action.stop(chalk.bold.green('done'))
    }
  }
}
