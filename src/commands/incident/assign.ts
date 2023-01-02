import { AuthenticatedBaseCommand } from '../../base/authenticated-base-command'
import { CliUx, Flags } from '@oclif/core'
import chalk from 'chalk'
import getStream from 'get-stream'
import * as utils from '../../utils'

export default class IncidentAssign extends AuthenticatedBaseCommand<typeof IncidentAssign> {
  static description = 'Assign/Reassign PagerDuty Incidents'

  static aliases = ['incident:reassign']

  static flags = {
    me: Flags.boolean({
      char: 'm',
      description: 'Reassign all incidents that are currently assigned to me',
      exclusive: ['ids', 'pipe'],
    }),
    ids: Flags.string({
      char: 'i',
      description: 'Incident ID\'s to assign. Specify multiple times for multiple incidents.',
      multiple: true,
      exclusive: ['me', 'pipe'],
    }),
    assign_to_user_ids: Flags.string({
      char: 'u',
      description: 'User ID\'s to assign incidents to. Specify multiple times for multiple assignees.',
      multiple: true,
      exclusive: ['assign_to_ep_id', 'assign_to_ep_name'],
    }),
    assign_to_user_emails: Flags.string({
      char: 'U',
      description: 'User emails to assign incidents to. Specify multiple times for multiple assignees.',
      multiple: true,
      exclusive: ['assign_to_ep_id', 'assign_to_ep_name'],
    }),
    assign_to_ep_id: Flags.string({
      char: 'e',
      description: 'Escalation policy ID to assign incidents to.',
      exclusive: ['assign_to_ep_name'],
    }),
    assign_to_ep_name: Flags.string({
      char: 'E',
      description: 'Escalation policy name to assign incidents to.',
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
    } else {
      this.error('You must specify one of: -i, -m, -p', { exit: 1 })
    }

    let invalid_ids = utils.invalidPagerDutyIDs(incident_ids)
    if (invalid_ids && invalid_ids.length > 0) {
      this.error(`Invalid incident ID's: ${invalid_ids.join(', ')}`, { exit: 1 })
    }

    const body: any = {
      incident: {
        type: 'incident_reference',
      },
    }

    let assignments: any[] = []
    if (this.flags.assign_to_user_ids) {
      invalid_ids = utils.invalidPagerDutyIDs(this.flags.assign_to_user_ids)
      if (invalid_ids && invalid_ids.length > 0) {
        this.error(`Invalid user ID's: ${invalid_ids.join(', ')}`, { exit: 1 })
      }
      for (const user_id of this.flags.assign_to_user_ids) {
        assignments = [...assignments, {
          assignee: {
            id: user_id,
            type: 'user_reference',
          },
        }]
      }
    }

    if (this.flags.assign_to_user_emails) {
      for (const user_email of this.flags.assign_to_user_emails) {
        CliUx.ux.action.start(`Finding user ID for ${chalk.bold.blue(user_email)}`)
        // eslint-disable-next-line no-await-in-loop
        const user_id = await this.pd.userIDForEmail(user_email)
        if (!user_id) {
          this.error(`No user or multiple users found for email ${user_email}`, { exit: 1 })
        }
        assignments = [...assignments, {
          assignee: {
            id: user_id,
            type: 'user_reference',
          },
        }]
      }
    }

    if (assignments.length > 0) {
      body.incident.assignments = assignments
    }

    if (this.flags.assign_to_ep_id) {
      invalid_ids = utils.invalidPagerDutyIDs([this.flags.assign_to_ep_id])
      if (invalid_ids && invalid_ids.length > 0) {
        this.error(`Invalid escalation policy ID: ${invalid_ids.join(', ')}`, { exit: 1 })
      }
      body.incident.escalation_policy = {
        id: this.flags.assign_to_ep_id,
        type: 'escalation_policy_reference',
      }
    }

    if (this.flags.assign_to_ep_name) {
      CliUx.ux.action.start(`Finding EP ID for ${chalk.bold.blue(this.flags.assign_to_ep_name)}`)
      const ep_id = await this.pd.epIDForName(this.flags.assign_to_ep_name)
      if (!ep_id) {
        this.error(`No EP or multiple EPs found for name ${this.flags.assign_to_ep_name}`, { exit: 1 })
      }
      body.incident.escalation_policy = {
        id: ep_id,
        type: 'escalation_policy_reference',
      }
    }

    if (!(body.incident.assignments) && !(body.incident.escalation_policy)) {
      this.error('No assignees specified.', { exit: 1 })
    }

    const requests: any[] = []
    for (const incident_id of incident_ids) {
      requests.push({
        endpoint: `/incidents/${incident_id}`,
        method: 'PUT',
        params: {},
        data: body,
        headers: headers,
      })
    }
    const r = await this.pd.batchedRequestWithSpinner(requests, { activityDescription: `Assigning ${incident_ids.length} incidents` })
    for (const failure of r.getFailedIndices()) {
      // eslint-disable-next-line no-console
      console.error(`${chalk.bold.red('Failed to assign incident ')}${chalk.bold.blue(requests[failure].data.incident.id)}: ${r.results[failure].getFormattedError()}`)
    }
  }
}
