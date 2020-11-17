import Command from '../../base'
import {flags} from '@oclif/command'
import chalk from 'chalk'
import cli from 'cli-ux'
import getStream from 'get-stream'
import * as pd from '../../pd'
import * as utils from '../../utils'
import parse from 'parse-duration'

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
    snooze: flags.string({
      char: 'z',
      description: 'Also snooze selected incidents for the specified amount of time (5m, \'1 hour\', default unit is seconds).',
    }),
  }

  async run() {
    const {flags} = this.parse(IncidentAck)

    let snooze_secs = NaN
    if (flags.snooze) {
      snooze_secs = parse(flags.snooze, 's') || Number(flags.snooze)
      if (isNaN(snooze_secs)) {
        this.error(`Invalid snooze duration: ${flags.snooze}`, {exit: 1})
      }
    }

    // get a validated token from base class
    const token = this.token as string

    let incident_ids: string[] = []
    if (flags.me) {
      let r = await pd.me(token)
      this.dieIfFailed(r, {prefixMessage: 'Request to /users/me failed'})
      const me = r.getValue()

      const params = {user_ids: [me.user.id]}
      cli.action.start('Getting incidents from PD')
      r = await pd.fetch(token, '/incidents', params)
      this.dieIfFailed(r, {prefixMessage: 'Request to list incidents failed'})

      const incidents = r.getValue()
      if (incidents.length === 0) {
        cli.action.stop(chalk.bold.red('none found'))
        return
      }

      cli.action.stop(`got ${incidents.length} before filtering`)
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
      if (!isNaN(snooze_secs)) {
        body.incident.duration = snooze_secs
      }
      requests.push({
        token: token,
        endpoint: `/incidents/${incident_id}`,
        method: 'PUT',
        params: {},
        data: body,
      })
    }
    const r = await pd.batchedRequest(requests)
    this.dieIfFailed(r, {prefixMessage: 'Acknowledge request failed'})

    const returnedIncidents = r.getValue()
    const failed = []
    for (const r of returnedIncidents) {
      if (!(r && r.incident && r.incident.status && r.incident.status === 'acknowledged')) {
        failed.push(r.incident.id)
      }
    }
    if (failed.length > 0) {
      cli.action.stop(chalk.bold.red('failed!'))
      this.error(`Acknowledge request failed for incidents ${chalk.bold.red(failed.join(', '))}`)
    } else {
      cli.action.stop(chalk.bold.green('done'))
    }
  }
}
