import { AuthenticatedBaseCommand } from '../../base/authenticated-base-command'
import { Flags } from '@oclif/core'
import ServiceSet from './set'

export default class ServiceEnable extends AuthenticatedBaseCommand<typeof ServiceEnable> {
  static description = 'Enable PagerDuty Services'

  static flags = {
    name: Flags.string({
      char: 'n',
      description: 'Select services whose names contain the given text',
    }),
    ids: Flags.string({
      char: 'i',
      description: 'Select services with the given ID. Specify multiple times for multiple services.',
      multiple: true,
    }),
    pipe: Flags.boolean({
      char: 'p',
      description: 'Read service ID\'s from stdin.',
      exclusive: ['name', 'ids'],
    }),
  }

  async run() {
    let args = ['-k', 'status', '-v', 'active']
    if (this.flags.name) {
      args = [...args, '-n', this.flags.name]
    }
    if (this.flags.ids) {
      args = [...args, ...this.flags.ids.map(e => ['-i', e]).flat()]
    }
    if (this.flags.pipe) {
      args = [...args, '-p']
    }
    if (this.flags.useauth) {
      args = [...args, '-b', this.flags.useauth]
    }

    await ServiceSet.run(args)
  }
}
