import Command from '../../base'
import {flags} from '@oclif/command'
// import chalk from 'chalk'
// import cli from 'cli-ux'
// import * as pd from '../../pd'
import ServiceSet from './set'

export default class ServiceDisable extends Command {
  static description = 'Disable PagerDuty Services'

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
  }

  async run() {
    const {flags} = this.parse(ServiceDisable)
    let args = ['-k', 'status', '-v', 'disabled']
    if (flags.name) {
      args = [...args, '-n', flags.name]
    }
    if (flags.ids) {
      args = [...args, ...flags.ids.map(e => ['-i', e]).flat()]
    }
    await ServiceSet.run(args)
  }
}
