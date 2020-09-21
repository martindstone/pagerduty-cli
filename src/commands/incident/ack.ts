import Command from '../../base'
import {flags} from '@oclif/command'
import chalk from 'chalk'
import cli from 'cli-ux'
import * as pd from '../../pd'

export default class IncidentAck extends Command {
  static description = 'Acknowledge PagerDuty Incidents'

  static flags = {
    ...Command.flags,
    me: flags.boolean({
      char: 'm',
      description: 'Acknowledge all incidents assigned to me',
      exclusive: ['ids'],
    }),
    ids: flags.string({
      char: 'i',
      description: 'Incident ID\'s to acknowledge. Specify multiple times for multiple incidents.',
      multiple: true,
      exclusive: ['me'],
    }),
  }

  async run() {
    const {flags} = this.parse(IncidentAck)

    // get a validated token from base class
    const token = this.token as string

    let incident_ids: string[] = []
    if (flags.me) {
      const me = await pd.me(token)
      if (!me) {
        this.error('You can\'t use --me with a legacy API token.', {
          exit: 1,
          suggestions: ['pd auth:set', 'pd auth:web'],
        })
      }
      const params = {user_ids: [me.user.id]}
      cli.action.start('Getting incidents from PD')
      const incidents = await pd.fetch(token, '/incidents', params)
      if (incidents.length === 0) {
        cli.action.stop(chalk.bold.red('none found'))
        return
      }
      cli.action.stop(`got ${incidents.length}`)
      incident_ids = incidents.map((e: { id: any }) => e.id)
    } else if (flags.ids) {
      incident_ids = flags.ids
    } else {
      this.error('You must specify one of: -i, -m', {exit: 1})
    }

    const promises: any[] = []
    cli.action.start(`Acknowledging incident(s) ${chalk.bold.blue(incident_ids.join(', '))}`)
    for (const incident_id of incident_ids) {
      const body = {
        incident: {
          type: 'incident_reference',
          status: 'acknowledged',
        },
      }
      promises.push(pd.request(token, `/incidents/${incident_id}`, 'PUT', null, body))
    }
    const rs = await Promise.all(promises)
    let failed = false
    for (const r of rs) {
      if (!(r && r.incident && r.incident.status && r.incident.status === 'acknowledged')) {
        failed = true
      }
    }
    if (failed) {
      cli.action.stop(chalk.bold.red('failed!'))
    } else {
      cli.action.stop(chalk.bold.green('done'))
    }
  }
}
