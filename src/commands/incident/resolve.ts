import { AuthenticatedBaseCommand } from '../../base/authenticated-base-command'
import { Flags } from '@oclif/core'
import chalk from 'chalk'
import getStream from 'get-stream'
import * as utils from '../../utils'

export default class IncidentResolve extends AuthenticatedBaseCommand<typeof IncidentResolve> {
  static description = 'Resolve PagerDuty Incidents'

  static flags = {
    me: Flags.boolean({
      char: 'm',
      description: 'Resolve all incidents assigned to me',
      exclusive: ['ids', 'pipe'],
    }),
    ids: Flags.string({
      char: 'i',
      description: 'Incident ID\'s to resolve. Specify multiple times for multiple incidents.',
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
  }

  async run() {
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
        console.warn(chalk.bold.red('No incidents to resolve'))
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
      const body: Record<string, any> = utils.putBodyForSetAttribute('incident', incident_id, 'status', 'resolved')
      requests.push({
        endpoint: `/incidents/${incident_id}`,
        method: 'PUT',
        params: {},
        data: body,
        headers: headers,
      })
    }

    const r = await this.pd.batchedRequestWithSpinner(requests, { activityDescription: `Resolving ${requests.length} incidents` })
    for (const failure of r.getFailedIndices()) {
      // eslint-disable-next-line no-console
      console.error(`${chalk.bold.red('Failed to resolve incident ')}${chalk.bold.blue(requests[failure].data.incident.id)}: ${r.results[failure].getFormattedError()}`)
    }
  }
}
