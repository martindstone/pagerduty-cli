import Command from '../../base'
import {flags} from '@oclif/command'
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
    pipe: flags.boolean({
      char: 'p',
      description: 'Read service ID\'s from stdin.',
      exclusive: ['name', 'ids'],
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
    if (flags.pipe) {
      args = [...args, '-p']
    }
    await ServiceSet.run(args)
  }
}
