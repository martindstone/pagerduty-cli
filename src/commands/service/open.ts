import Command from '../../base'
import {CliUx, Flags} from '@oclif/core'
import chalk from 'chalk'
import getStream from 'get-stream'
import * as utils from '../../utils'

export default class ServiceOpen extends Command {
  static description = 'Open PagerDuty Services in the browser'

  static flags = {
    ...Command.flags,
    name: Flags.string({
      char: 'n',
      description: 'Open services matching this string.',
      exclusive: ['ids', 'pipe'],
    }),
    ids: Flags.string({
      char: 'i',
      description: 'The IDs of services to open.',
      exclusive: ['name', 'pipe'],
      multiple: true,
    }),
    pipe: Flags.boolean({
      char: 'p',
      description: 'Read service ID\'s from stdin.',
      exclusive: ['ids', 'name'],
    }),
  }

  async run() {
    const {flags} = await this.parse(ServiceOpen)

    const params: Record<string, any> = {}

    let service_ids = []
    if (flags.name) {
      params.query = flags.name
      CliUx.ux.action.start('Finding services in PD')
      const services = await this.pd.fetch('services', {params: params})
      if (services.length === 0) {
        CliUx.ux.action.stop(chalk.bold.red('no services found matching ') + chalk.bold.blue(flags.name))
        this.exit(0)
      }
      for (const service of services) {
        service_ids.push(service.id)
      }
    } else if (flags.ids) {
      const invalid_ids = utils.invalidPagerDutyIDs(flags.ids)
      if (invalid_ids.length > 0) {
        this.error(`Invalid service IDs ${chalk.bold.blue(invalid_ids.join(', '))}`, {exit: 1})
      }
      service_ids = flags.ids
    } else if (flags.pipe) {
      const str: string = await getStream(process.stdin)
      service_ids = utils.splitDedupAndFlatten([str])
    } else {
      this.error('You must specify one of: -i, -n, -p', {exit: 1})
    }
    if (service_ids.length === 0) {
      CliUx.ux.action.stop(chalk.bold.red('no services specified'))
      this.exit(0)
    }
    CliUx.ux.action.start('Finding your PD domain')
    const domain = await this.pd.domain()

    this.log('Service URLs:')
    const urlstrings: string[] = service_ids.map(x => chalk.bold.blue(`https://${domain}.pagerduty.com/services/${x}`))
    this.log(urlstrings.join('\n') + '\n')

    CliUx.ux.action.start('Opening your browser')
    try {
      for (const service_id of service_ids) {
        await CliUx.ux.open(`https://${domain}.pagerduty.com/services/${service_id}`)
      }
    } catch (error) {
      CliUx.ux.action.stop(chalk.bold.red('failed!'))
      this.error('Couldn\'t open browser. Are you running as root?', {exit: 1})
    }
    CliUx.ux.action.stop(chalk.bold.green('done'))
  }
}
