import Command from '../../base'
import {flags} from '@oclif/command'
import chalk from 'chalk'
import cli from 'cli-ux'
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
  }

  async run() {
    const {flags} = this.parse(ServiceSet)

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
      service_ids_set = new Set([...service_ids_set, ...utils.splitStringArrayOnWhitespace(flags.ids)])
    }

    const key = flags.key
    const value = flags.value.trim().length > 0 ? flags.value : null
    const service_ids: string[] = [...service_ids_set] as string[]

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
    // const rs = await Promise.all(promises)
    const rs = await pd.batchedRequest(requests)
    let failed = false
    for (const r of rs) {
      if (!(r && r.service && key in r.service && r.service[key] === value)) {
        failed = true
      }
    }
    if (failed) {
      cli.action.stop(chalk.bold.red('failed!'))
      this.error('Some requests failed. Please check your services and try again.')
    } else {
      cli.action.stop(chalk.bold.green('done'))
    }
  }
}
