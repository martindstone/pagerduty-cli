import { AuthenticatedBaseCommand } from '../../../base/authenticated-base-command'
import { CliUx, Flags } from '@oclif/core'
import chalk from 'chalk'
import getStream from 'get-stream'
import * as utils from '../../../utils'
import { PD } from '../../../pd'

export default class IncidentResponderAdd extends AuthenticatedBaseCommand<typeof IncidentResponderAdd> {
  static description = 'Add Responders to PagerDuty Incidents'

  static flags = {
    me: Flags.boolean({
      char: 'm',
      description: 'Add responders to all incidents that are currently assigned to me',
      exclusive: ['ids', 'pipe'],
    }),
    ids: Flags.string({
      char: 'i',
      description: 'Incident ID\'s to add responders to. Specify multiple times for multiple incidents.',
      multiple: true,
      exclusive: ['me', 'pipe'],
    }),
    from: Flags.string({
      char: 'F',
      description: 'Login email of a PD user account for the "From:" header. Use only with legacy API tokens.',
    }),
    user_ids: Flags.string({
      char: 'u',
      description: 'User ID\'s to add as responders. Specify multiple times for multiple users.',
      multiple: true,
    }),
    user_emails: Flags.string({
      char: 'U',
      description: 'User emails to add as responders. Specify multiple times for multiple users.',
      multiple: true,
    }),
    ep_ids: Flags.string({
      char: 'e',
      description: 'Escalation policy IDs to add as responders. Specify multiple times for multiple EPs',
      multiple: true,
    }),
    ep_names: Flags.string({
      char: 'E',
      description: 'Escalation policy names to add as responders. Specify multiple times for multiple EPs',
      multiple: true,
    }),
    message: Flags.string({
      char: 's',
      description: 'A custom message to send to the responders',
    }),
    pipe: Flags.boolean({
      char: 'p',
      description: 'Read incident ID\'s from stdin.',
      exclusive: ['me', 'ids'],
    }),
  }

  async run() {
    this.pd.silent = true
    if (!(this.flags.ep_ids || this.flags.ep_names || this.flags.user_ids || this.flags.user_emails)) {
      this.error('You must specify one of: -u, -U, -e, -E', {exit: 1})
    }

    if (!(this.flags.ids || this.flags.me || this.flags.pipe)) {
      this.error('You must specify one of: -i, -m, -p', { exit: 1 })
    }

    let requester_id: string

    const headers: Record<string, string> = {}
    if (this.flags.from) {
      const r = await this.pd.userIDForEmail(this.flags.from)
      if (!r) {
        this.error(`No user was found for email ${chalk.bold.blue(this.flags.from)}`, {exit: 1})
      }
      requester_id = r
      headers.From = this.flags.from
    } else {
      const me = await this.me(true)
      requester_id = me.user.id
    }

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
      this.error('No incidents to add responder requests to', {exit: 1})
    }

    let invalid_ids = utils.invalidPagerDutyIDs(incident_ids)
    if (invalid_ids && invalid_ids.length > 0) {
      this.error(`Invalid incident ID's: ${invalid_ids.join(', ')}`, { exit: 1 })
    }

    let responder_request_targets: any[] = []
    if (this.flags.user_ids) {
      invalid_ids = utils.invalidPagerDutyIDs(this.flags.user_ids)
      if (invalid_ids && invalid_ids.length > 0) {
        this.error(`Invalid user ID's: ${invalid_ids.join(', ')}`, { exit: 1 })
      }
      for (const user_id of this.flags.user_ids) {
        responder_request_targets = [...responder_request_targets, {
          responder_request_target: {
            id: user_id,
            type: 'user_reference',
          },
        }]
      }
    }

    if (this.flags.user_emails) {
      for (const user_email of this.flags.user_emails) {
        CliUx.ux.action.start(`Finding user ID for ${chalk.bold.blue(user_email)}`)
        // eslint-disable-next-line no-await-in-loop
        const user_id = await this.pd.userIDForEmail(user_email)
        if (!user_id) {
          this.error(`No user or multiple users found for email ${user_email}`, { exit: 1 })
        }
        responder_request_targets = [...responder_request_targets, {
          responder_request_target: {
            id: user_id,
            type: 'user_reference',
          },
        }]
      }
    }

    if (this.flags.ep_ids) {
      invalid_ids = utils.invalidPagerDutyIDs(this.flags.ep_ids)
      if (invalid_ids && invalid_ids.length > 0) {
        this.error(`Invalid escalation policy IDs: ${invalid_ids.join(', ')}`, { exit: 1 })
      }
      for (const ep_id of this.flags.ep_ids) {
        responder_request_targets = [...responder_request_targets, {
          responder_request_target: {
            id: ep_id,
            type: 'escalation_policy_reference',
          },
        }]
      }
    }

    if (this.flags.ep_names) {
      CliUx.ux.action.start(`Finding EP ID for ${chalk.bold.blue(this.flags.ep_names)}`)
      for (const ep_name of this.flags.ep_names) {
        // eslint-disable-next-line no-await-in-loop
        const ep_id = await this.pd.epIDForName(ep_name)
        if (!ep_id) {
          this.error(`No EP or multiple EPs found for name ${this.flags.ep_names}`, { exit: 1 })
        }
        responder_request_targets = [...responder_request_targets, {
          responder_request_target: {
            id: ep_id,
            type: 'escalation_policy_reference',
          },
        }]
      }
    }

    if (responder_request_targets.length === 0) {
      this.error('No targets for responder request', {exit: 1})
    }

    const messages: Record<string, string> = {}
    if (!this.flags.message) {
      const requests: PD.Request[] = incident_ids.map(incident_id => ({
        endpoint: `incidents/${incident_id}`,
        method: 'GET',
      }))
      const r = await this.pd.batchedRequestWithSpinner(requests, {
        activityDescription: `Getting info for ${incident_ids.length} incidents`,
        stopSpinnerWhenDone: false,
      })
      if (r.getFailedIndices().length > 0) {
        CliUx.ux.action.stop(chalk.bold.yellow('warning'))
        for (const i of r.getFailedIndices()) {
          const incident_id = r.requests[i].endpoint.split('/')[1]
          const message = r.results[i].getFormattedError()
          this.warn(`Failed to get incident ${chalk.bold.blue(incident_id)}: ${chalk.bold.red(message)}`)
          incident_ids = incident_ids.filter(x => x !== incident_id)
        }
      }

      if (incident_ids.length === 0) {
        this.error('No incidents to add responder requests to', {exit: 1})
      }

      const incidents = r.getDatas()
      for (const incident of incidents) {
        messages[incident.incident.id] = `Please help with "${incident.incident.title}"`
      }
    }

    const requests: any[] = []
    for (const incident_id of incident_ids) {
      const body = {
        requester_id,
        message: this.flags.message || messages[incident_id],
        responder_request_targets,
      }

      requests.push({
        endpoint: `incidents/${incident_id}/responder_requests`,
        method: 'POST',
        params: {},
        data: body,
        headers: headers,
      })
    }
    const r = await this.pd.batchedRequestWithSpinner(requests, { activityDescription: `Adding responder requests for ${incident_ids.length} incidents` })
    for (const failure of r.getFailedIndices()) {
      // eslint-disable-next-line no-console
      console.error(`${chalk.bold.red('Failed to add responders to incident ')}${chalk.bold.blue(r.requests[failure].endpoint.split('/')[1])}: ${r.results[failure].getFormattedError()}`)
    }
  }
}
