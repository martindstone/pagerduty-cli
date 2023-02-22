import { AuthenticatedBaseCommand } from '../../../base/authenticated-base-command'
import { CliUx, Flags } from '@oclif/core'
import chalk from 'chalk'
import getStream from 'get-stream'
import * as utils from '../../../utils'
import { PD } from '../../../pd'

export default class IncidentSubscriberUpdate extends AuthenticatedBaseCommand<typeof IncidentSubscriberUpdate> {
  static description = 'Send a ststus update to PagerDuty Incident Subscribers'

  static flags = {
    me: Flags.boolean({
      char: 'm',
      description: 'Send a status update to subscribers on all incidents that are currently assigned to me',
      exclusive: ['ids', 'pipe'],
    }),
    ids: Flags.string({
      char: 'i',
      description: 'Send a status update to subscribers on these Incident ID\'s. Specify multiple times for multiple incidents.',
      multiple: true,
      exclusive: ['me', 'pipe'],
    }),
    from: Flags.string({
      char: 'F',
      description: 'Login email of a PD user account for the "From:" header. Use only with legacy API tokens.',
    }),
    message: Flags.string({
      description: 'The message to be posted as a status update.',
      required: true,
    }),
    html_message: Flags.string({
      description: 'The html content to be sent for the custom html email status update. Required if sending custom html email.',
      dependsOn: ['subject'],
    }),
    subject: Flags.string({
      description: 'The subject to be sent for the custom html email status update. Required if sending custom html email.',
      dependsOn: ['html_message'],
    }),
    pipe: Flags.boolean({
      char: 'p',
      description: 'Read incident ID\'s from stdin.',
      exclusive: ['me', 'ids'],
    }),
  }

  async run() {
    const {
      from: from,
      message,
      subject,
      html_message
    } = this.flags

    const headers: Record<string, string> = {}
    if (from) headers.From = from

    let incident_ids: string[] = []
    if (this.flags.me) {
      const me = await this.me(true)
      const params = { user_ids: [me.user.id] }
      CliUx.ux.action.start('Getting incidents from PD')
      const incidents = await this.pd.fetch('incidents', { params: params })

      if (incidents.length === 0) {
        CliUx.ux.action.stop(chalk.bold.red('none found'))
        this.exit(1)
      }
      incident_ids = incidents.map((e: { id: any }) => e.id)
    } else if (this.flags.ids) {
      incident_ids = utils.splitDedupAndFlatten(this.flags.ids)
    } else if (this.flags.pipe) {
      const str: string = await getStream(process.stdin)
      incident_ids = utils.splitDedupAndFlatten([str])
    }

    if (incident_ids.length === 0) {
      this.error('No incidents to send updates for', {exit: 1})
    }

    let invalid_ids = utils.invalidPagerDutyIDs(incident_ids)
    if (invalid_ids && invalid_ids.length > 0) {
      this.error(`Invalid incident ID's: ${invalid_ids.join(', ')}`, { exit: 1 })
    }

    const data = {
      message,
      subject,
      html_message,
    }

    const requests: any[] = [
      ...incident_ids.map(incident_id => ({
        endpoint: `incidents/${incident_id}/status_updates`,
        method: 'POST',
        headers,
        data,
      }))
    ]

    const r = await this.pd.batchedRequestWithSpinner(requests, { activityDescription: `Sending a status update on ${incident_ids.length} incidents` })
    for (const failure of r.getFailedIndices()) {
      // eslint-disable-next-line no-console
      console.error(`${chalk.bold.red('Failed to send a status update for incident ')}${chalk.bold.blue(r.requests[failure].endpoint.split('/')[1])}: ${r.results[failure].getFormattedError()}`)
    }
  }
}
