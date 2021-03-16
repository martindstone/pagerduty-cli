import Command from '../../base'
import {flags} from '@oclif/command'
import chalk from 'chalk'
// import cli from 'cli-ux'
import getStream from 'get-stream'
// import * as pd from '../../pd'
import * as utils from '../../utils'
import parse from 'parse-duration'
import log from 'ololog'

export default class IncidentAck extends Command {
  static description = 'Acknowledge PagerDuty Incidents'

  static aliases = ['incident:acknowledge']

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
    from: flags.string({
      char: 'F',
      description: 'Login email of a PD user account for the "From:" header. Use only with legacy API tokens.',
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
      if (isNaN(snooze_secs) || snooze_secs < 60) {
        this.error(`Invalid snooze duration: ${flags.snooze}`, {exit: 1})
      }
    }

    const headers: Record<string, string> = {}
    if (flags.from) {
      headers.From = flags.from
    }

    let incident_ids: string[] = []
    if (flags.me) {
      const me = await this.pd.me()

      const params = {user_ids: [me.user.id]}
      const incidents = await this.pd.fetchWithSpinner('incidents', {params: params, activityDescription: 'Getting incidents from PD'})
      if (incidents.length === 0) {
        // eslint-disable-next-line no-console
        log.error.red(chalk.bold.red('No incidents to acknowledge'))
        this.exit(0)
      }
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
    for (const incident_id of incident_ids) {
      const body: Record<string, any> = utils.putBodyForSetAttribute('incident', incident_id, 'status', 'acknowledged')
      if (!isNaN(snooze_secs)) {
        body.incident.duration = snooze_secs
      }
      requests.push({
        endpoint: `/incidents/${incident_id}`,
        method: 'PUT',
        params: {},
        data: body,
        headers: headers,
      })
    }

    const r = await this.pd.batchedRequestWithSpinner(requests, {activityDescription: `Acknowledging ${requests.length} incidents`})
    for (const failure of r.getFailedIndices()) {
      // eslint-disable-next-line no-console
      console.error(`${chalk.bold.red('Failed to acknowledge incident ')}${chalk.bold.blue(requests[failure].data.incident.id)}: ${r.results[failure].getFormattedError()}`)
    }
  }
}
