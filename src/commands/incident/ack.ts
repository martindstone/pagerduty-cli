import { AuthenticatedBaseCommand } from '../../base/authenticated-base-command'
import { Flags } from '@oclif/core'
import chalk from 'chalk'
import getStream from 'get-stream'
import * as utils from '../../utils'
import parse from 'parse-duration'
import log from 'ololog'

export default class IncidentAck extends AuthenticatedBaseCommand<typeof IncidentAck> {
  static description = 'Acknowledge PagerDuty Incidents'

  static aliases = ['incident:acknowledge']

  static flags = {
    me: Flags.boolean({
      char: 'm',
      description: 'Acknowledge all incidents assigned to me',
      exclusive: ['ids', 'pipe'],
    }),
    ids: Flags.string({
      char: 'i',
      description: 'Incident ID\'s to acknowledge. Specify multiple times for multiple incidents.',
      multiple: true,
      exclusive: ['me', 'pipe'],
    }),
    from: Flags.string({
      char: 'F',
      description: 'Login email of a PD user account for the "From:" header. Use only with legacy API tokens.',
    }),
    pipe: Flags.boolean({
      char: 'p',
      description: 'Read incident ID\'s from stdin.',
      exclusive: ['me', 'ids'],
    }),
    snooze: Flags.string({
      char: 'z',
      description: 'Also snooze selected incidents for the specified amount of time (5m, \'1 hour\', default unit is seconds).',
    }),
  }

  async run() {
    let snooze_secs = NaN
    if (this.flags.snooze) {
      snooze_secs = parse(this.flags.snooze, 's') || Number(this.flags.snooze)
      if (isNaN(snooze_secs) || snooze_secs < 60) {
        this.error(`Invalid snooze duration: ${this.flags.snooze}`, { exit: 1 })
      }
    }

    const headers: Record<string, string> = {}
    if (this.flags.from) {
      headers.From = this.flags.from
    }

    let incident_ids: string[] = []
    if (this.flags.me) {
      const me = await this.me(true)

      const params = { user_ids: [me.user.id] }
      const incidents = await this.pd.fetchWithSpinner('incidents', { params: params, activityDescription: 'Getting incidents from PD' })
      if (incidents.length === 0) {
        // eslint-disable-next-line no-console
        log.error.red(chalk.bold.red('No incidents to acknowledge'))
        this.exit(0)
      }
      incident_ids = incidents.map((e: { id: any }) => e.id)
    } else if (this.flags.ids) {
      incident_ids = utils.splitDedupAndFlatten(this.flags.ids)
    } else if (this.flags.pipe) {
      const str: string = await getStream(process.stdin)
      incident_ids = utils.splitDedupAndFlatten([str])
    } else {
      this.error('You must specify one of: -i, -m, -p', { exit: 1 })
    }

    const invalid_ids = utils.invalidPagerDutyIDs(incident_ids)
    if (invalid_ids && invalid_ids.length > 0) {
      this.error(`Invalid incident ID's: ${invalid_ids.join(', ')}`, { exit: 1 })
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

    const r = await this.pd.batchedRequestWithSpinner(requests, { activityDescription: `Acknowledging ${requests.length} incidents` })
    for (const failure of r.getFailedIndices()) {
      // eslint-disable-next-line no-console
      console.error(`${chalk.bold.red('Failed to acknowledge incident ')}${chalk.bold.blue(requests[failure].data.incident.id)}: ${r.results[failure].getFormattedError()}`)
    }
  }
}
