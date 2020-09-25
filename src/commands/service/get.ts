import Command from '../../base'
import {flags} from '@oclif/command'
import chalk from 'chalk'
import cli from 'cli-ux'
import * as pd from '../../pd'
import * as utils from '../../utils'

export default class ServiceGet extends Command {
  static description = 'Get PagerDuty Service attributes in a script-friendly format'

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
    all: flags.boolean({
      char: 'a',
      description: 'Select all services.',
      exclusive: ['name', 'ids'],
    }),
    keys: flags.string({
      char: 'k',
      description: 'Attribute names to get. specify multiple times for multiple keys.',
      required: true,
      multiple: true,
    }),
    delimiter: flags.string({
      char: 'd',
      description: 'Output field separator.',
      default: '|',
    }),
  }

  async run() {
    const {flags} = this.parse(ServiceGet)

    // get a validated token from base class
    const token = this.token as string

    let service_ids_set = new Set()
    if (flags.name) {
      cli.action.start('Getting service IDs from PD')
      const services = await pd.fetch(token, '/services', {query: flags.name})
      if (!services || services.length === 0) {
        cli.action.stop(chalk.bold.red('none found'))
      }
      service_ids_set = new Set(services.map((e: {id: string}) => e.id))
    }
    if (flags.ids) {
      service_ids_set = new Set([...service_ids_set, ...flags.ids])
    }
    if (flags.all) {
      const services = await pd.fetch(token, '/services')
      service_ids_set = new Set(services.map((e: {id: string}) => e.id))
    }

    const service_ids: string[] = [...service_ids_set] as string[]

    if (service_ids.length === 0) {
      this.error('No services selected. Please specify --name or --ids', {exit: 1})
    }

    cli.action.start(`Getting ${chalk.bold.blue(flags.keys.join(flags.delimiter))} on service(s) ${chalk.bold.blue(service_ids.join(', '))}`)
    const requests: any[] = []
    for (const service_id of service_ids) {
      requests.push({
        token: token,
        endpoint: `/services/${service_id}`,
        method: 'GET',
      })
    }
    // const rs = await Promise.all(promises)
    const rs = await pd.batchedRequest(requests)
    let failed = false
    for (const r of rs) {
      if (!(r && r.service)) {
        failed = true
      }
    }
    if (failed) {
      cli.action.stop(chalk.bold.red('failed!'))
      this.error('Some requests failed. Please check your services and try again.')
    } else {
      cli.action.stop(chalk.bold.green('done'))
      for (const r of rs) {
        this.log(utils.formatRow(r, 'service', flags.keys, flags.delimiter))
      }
    }
  }
}
