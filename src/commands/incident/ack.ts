import Command from '../../base'
import {flags} from '@oclif/command'
import chalk from 'chalk'
import cli from 'cli-ux'
import getStream from 'get-stream'
import * as pd from '../../pd'
import * as utils from '../../utils'

export default class IncidentAck extends Command {
  static description = 'Acknowledge PagerDuty Incidents'

  static flags = {
    ...Command.flags,
    me: flags.boolean({
      char: 'm',
      description: 'Acknowledge all incidents assigned to me',
      exclusive: ['ids', 'pipe'],
    }),
    ids: flags.string({
      char: 'i',
      description: 'Incident ID\'s to acknowledge. Specify multiple times for multiple incidents.',
      multiple: true,
      exclusive: ['me', 'pipe'],
    }),
    pipe: flags.boolean({
      char: 'p',
      description: 'Read incident ID\'s from stdin.',
      exclusive: ['me', 'ids'],
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
      incident_ids = utils.splitDedupAndFlatten(flags.ids)
    } else if (flags.pipe) {
      const str: string = await getStream(process.stdin)
      incident_ids = utils.splitDedupAndFlatten([str])
    } else {
      this.error('You must specify one of: -i, -m, -p', {exit: 1})
    }

    const invalid_ids = utils.invalidPagerDutyIDs(incident_ids)
    if (invalid_ids && invalid_ids.length > 0) {
      this.error(`Invalid incident ID's: ${invalid_ids.join(', ')}`, {exit: 1})
    }

    const requests: any[] = []
    cli.action.start(`Acknowledging incident(s) ${chalk.bold.blue(incident_ids.join(', '))}`)
    for (const incident_id of incident_ids) {
      const body: Record<string, any> = pd.putBodyForSetAttribute('incident', incident_id, 'status', 'acknowledged')
      requests.push({
        token: token,
        endpoint: `/incidents/${incident_id}`,
        method: 'PUT',
        params: {},
        data: body,
      })
    }
    const rs = await pd.batchedRequest(requests)
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
