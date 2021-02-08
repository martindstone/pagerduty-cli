/* eslint-disable complexity */
import Command from '../../base'
import {flags} from '@oclif/command'
import chalk from 'chalk'
import cli from 'cli-ux'
import getStream from 'get-stream'
import * as pd from '../../pd'
import * as utils from '../../utils'

export default class IncidentAssign extends Command {
  static description = 'Assign/Reassign PagerDuty Incidents'

  static aliases = ['incident:reassign']

  static flags = {
    ...Command.flags,
    me: flags.boolean({
      char: 'm',
      description: 'Reassign all incidents that are currently assigned to me',
      exclusive: ['ids', 'pipe'],
    }),
    ids: flags.string({
      char: 'i',
      description: 'Incident ID\'s to assign. Specify multiple times for multiple incidents.',
      multiple: true,
      exclusive: ['me', 'pipe'],
    }),
    assign_to_user_ids: flags.string({
      char: 'u',
      description: 'User ID\'s to assign incidents to. Specify multiple times for multiple assignees.',
      multiple: true,
      exclusive: ['assign_to_ep_id', 'assign_to_ep_name'],
    }),
    assign_to_user_emails: flags.string({
      char: 'U',
      description: 'User emails to assign incidents to. Specify multiple times for multiple assignees.',
      multiple: true,
      exclusive: ['assign_to_ep_id', 'assign_to_ep_name'],
    }),
    assign_to_ep_id: flags.string({
      char: 'e',
      description: 'Escalation policy ID to assign incidents to.',
      exclusive: ['assign_to_ep_name'],
    }),
    assign_to_ep_name: flags.string({
      char: 'E',
      description: 'Escalation policy name to assign incidents to.',
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
    const {flags} = this.parse(IncidentAssign)

    // get a validated token from base class
    const token = this.token
    const headers: Record<string, string> = {}
    if (flags.from) {
      headers.From = flags.from
    }

    let incident_ids: string[] = []
    if (flags.me) {
      const me = await this.me()

      const params = {user_ids: [me.user.id]}
      cli.action.start('Getting incidents from PD')
      const r = await pd.fetch(token, '/incidents', params)
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

    let invalid_ids = utils.invalidPagerDutyIDs(incident_ids)
    if (invalid_ids && invalid_ids.length > 0) {
      this.error(`Invalid incident ID's: ${invalid_ids.join(', ')}`, {exit: 1})
    }

    const body: any = {
      incident: {
        type: 'incident_reference',
      },
    }

    let assignments: any[] = []
    if (flags.assign_to_user_ids) {
      invalid_ids = utils.invalidPagerDutyIDs(flags.assign_to_user_ids)
      if (invalid_ids && invalid_ids.length > 0) {
        this.error(`Invalid user ID's: ${invalid_ids.join(', ')}`, {exit: 1})
      }
      for (const user_id of flags.assign_to_user_ids) {
        assignments = [...assignments, {
          assignee: {
            id: user_id,
            type: 'user_reference',
          },
        }]
      }
    }

    if (flags.assign_to_user_emails) {
      for (const user_email of flags.assign_to_user_emails) {
        cli.action.start(`Finding user ID for ${chalk.bold.blue(user_email)}`)
        // eslint-disable-next-line no-await-in-loop
        const user_id = await pd.userIDForEmail(token, user_email)
        if (!user_id) {
          this.error(`No user or multiple users found for email ${user_email}`, {exit: 1})
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

    if (flags.assign_to_ep_id) {
      invalid_ids = utils.invalidPagerDutyIDs([flags.assign_to_ep_id])
      if (invalid_ids && invalid_ids.length > 0) {
        this.error(`Invalid escalation policy ID: ${invalid_ids.join(', ')}`, {exit: 1})
      }
      body.incident.escalation_policy = {
        id: flags.assign_to_ep_id,
        type: 'escalation_policy_reference',
      }
    }

    if (flags.assign_to_ep_name) {
      cli.action.start(`Finding EP ID for ${chalk.bold.blue(flags.assign_to_ep_name)}`)
      const ep_id = await pd.epIDForName(token, flags.assign_to_ep_name)
      if (!ep_id) {
        this.error(`No EP or multiple EPs found for name ${flags.assign_to_ep_name}`, {exit: 1})
      }
      body.incident.escalation_policy = {
        id: ep_id,
        type: 'escalation_policy_reference',
      }
    }

    if (!(body.incident.assignments) && !(body.incident.escalation_policy)) {
      this.error('No assignees specified.', {exit: 1})
    }

    const requests: any[] = []
    cli.action.start(`Assigning incident(s) ${chalk.bold.blue(incident_ids.join(', '))}`)
    for (const incident_id of incident_ids) {
      requests.push({
        token: token,
        endpoint: `/incidents/${incident_id}`,
        method: 'PUT',
        params: {},
        data: body,
        headers: headers,
      })
    }
    const r = await pd.batchedRequest(requests)
    this.dieIfFailed(r, {prefixMessage: 'Assign request failed'})
    cli.action.stop(chalk.bold.green('done'))
  }
}
