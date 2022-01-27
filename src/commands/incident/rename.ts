/* eslint-disable complexity */
import Command from '../../base'
import {flags} from '@oclif/command'

import IncidentSet from './set'

export default class IncidentRename extends Command {
  static description = 'Update PagerDuty Incidents'

  static aliases = ['incident:update']

  static flags = {
    ...Command.flags,
    me: flags.boolean({
      char: 'm',
      description: 'Rename all incidents that are currently assigned to me',
      exclusive: ['ids', 'pipe'],
    }),
    ids: flags.string({
      char: 'i',
      description: 'Incident ID\'s to rename. Specify multiple times for multiple incidents.',
      multiple: true,
      exclusive: ['me', 'pipe'],
    }),
    title: flags.string({
      char: 't',
      description: 'Set the incident title to this string',
      required: true,
    }),
    from: flags.string({
      char: 'F',
      description: 'Login email of a PD user account for the "From:" header. Use only with legacy API tokens.',
    }),
    pipe: flags.boolean({
      char: 'p',
      description: 'Read incident ID\'s from stdin.',
      exclusive: ['me', 'ids'],
    }),
  }

  async run() {

    const {flags} = this.parse(IncidentRename)

    let title = flags.title

    let args = ['-k', 'title', '-v', title]
    if (flags.me) {
      args = [...args, '-m']
    }
    if (flags.ids) {
      args = [...args, ...flags.ids.map(e => ['-i', e]).flat()]
    }
    if (flags.from) {
      args = [...args, '-F', flags.from]
    }
    if (flags.pipe) {
      args = [...args, '-p']
    }
    if (flags.useauth) {
      args = [...args, '-b', flags.useauth]
    }
    if (flags.debug) {
      args = [...args, '--debug']
    }
    if (flags.token) {
      args = [...args, '--token', flags.token]
    }

    await IncidentSet.run(args)
  }
}
