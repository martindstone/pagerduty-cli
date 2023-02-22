import { AuthenticatedBaseCommand } from '../../../base/authenticated-base-command'
import { CliUx, Flags } from '@oclif/core'
import chalk from 'chalk'
import getStream from 'get-stream'
import * as utils from '../../../utils'
import { PD } from '../../../pd'

export default class IncidentSubscriberRemove extends AuthenticatedBaseCommand<typeof IncidentSubscriberRemove> {
  static description = 'Remove Subscribers from PagerDuty Incidents'

  static flags = {
    me: Flags.boolean({
      char: 'm',
      description: 'Remove subscribers from all incidents that are currently assigned to me',
      exclusive: ['ids', 'pipe'],
    }),
    ids: Flags.string({
      char: 'i',
      description: 'Incident ID\'s to remove subscribers from. Specify multiple times for multiple incidents.',
      multiple: true,
      exclusive: ['me', 'pipe'],
    }),
    user_ids: Flags.string({
      char: 'u',
      description: 'User ID\'s to remove. Specify multiple times for multiple users.',
      multiple: true,
    }),
    user_emails: Flags.string({
      char: 'U',
      description: 'User emails to remove. Specify multiple times for multiple users.',
      multiple: true,
    }),
    team_ids: Flags.string({
      char: 't',
      description: 'Team IDs to remove. Specify multiple times for multiple teams',
      multiple: true,
    }),
    team_names: Flags.string({
      char: 'T',
      description: 'Team names to remove. Specify multiple times for multiple teams',
      multiple: true,
    }),
    pipe: Flags.boolean({
      char: 'p',
      description: 'Read incident ID\'s from stdin.',
      exclusive: ['me', 'ids'],
    }),
  }

  async run() {
    this.pd.silent = true
    if (!(this.flags.team_ids || this.flags.team_names || this.flags.user_ids || this.flags.user_emails)) {
      this.error('You must specify one of: -u, -U, -t, -T', {exit: 1})
    }

    if (!(this.flags.ids || this.flags.me || this.flags.pipe)) {
      this.error('You must specify one of: -i, -m, -p', { exit: 1 })
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
      this.error('No incidents to add subscribers to', {exit: 1})
    }

    let invalid_ids = utils.invalidPagerDutyIDs(incident_ids)
    if (invalid_ids && invalid_ids.length > 0) {
      this.error(`Invalid incident ID's: ${invalid_ids.join(', ')}`, { exit: 1 })
    }

    const user_ids: string[] = []
    const team_ids: string[] = []

    if (this.flags.user_ids) {
      invalid_ids = utils.invalidPagerDutyIDs(this.flags.user_ids)
      if (invalid_ids && invalid_ids.length > 0) {
        this.error(`Invalid user ID's: ${invalid_ids.join(', ')}`, { exit: 1 })
      }
      user_ids.push(...this.flags.user_ids)
    }

    if (this.flags.user_emails) {
      for (const user_email of this.flags.user_emails) {
        CliUx.ux.action.start(`Finding user ID for ${chalk.bold.blue(user_email)}`)
        // eslint-disable-next-line no-await-in-loop
        const user_id = await this.pd.userIDForEmail(user_email)
        if (!user_id) {
          this.error(`No user or multiple users found for email ${user_email}`, { exit: 1 })
        }
        user_ids.push(user_id)
      }
    }

    if (this.flags.team_ids) {
      invalid_ids = utils.invalidPagerDutyIDs(this.flags.team_ids)
      if (invalid_ids && invalid_ids.length > 0) {
        this.error(`Invalid team IDs: ${invalid_ids.join(', ')}`, { exit: 1 })
      }
      team_ids.push(...this.flags.team_ids)
    }

    if (this.flags.team_names) {
      for (const team_name of this.flags.team_names) {
        CliUx.ux.action.start(`Finding team ID for ${chalk.bold.blue(team_name)}`)
        // eslint-disable-next-line no-await-in-loop
        const team_id = await this.pd.teamIDForName(team_name)
        if (!team_id) {
          this.error(`No team or multiple teams found for name ${team_name}`, { exit: 1 })
        }
        team_ids.push(team_id)
      }
    }

    const subscribers = [
      ...user_ids.map(subscriber_id => ({
        subscriber_id,
        subscriber_type: 'user',
      })),
      ...team_ids.map(subscriber_id => ({
        subscriber_id,
        subscriber_type: 'team'
      }))
    ]

    const requests: any[] = [
      ...incident_ids.map(incident_id => ({
        endpoint: `incidents/${incident_id}/status_updates/unsubscribe`,
        method: 'POST',
        data: {
          subscribers,
        },
      }))
    ]

    const r = await this.pd.batchedRequestWithSpinner(requests, { activityDescription: `Removing ${subscribers.length} subscribers from ${incident_ids.length} incidents` })
    for (const failure of r.getFailedIndices()) {
      // eslint-disable-next-line no-console
      console.error(`${chalk.bold.red('Failed to remove subscribers from incident ')}${chalk.bold.blue(r.requests[failure].endpoint.split('/')[1])}: ${r.results[failure].getFormattedError()}`)
    }
    for (const [idx, data] of r.getDatas().entries()) {
      const incident_id = r.requests[idx].endpoint.split('/')[1]
      const {
        deleted_count,
        unauthorized_count,
        non_existent_count
      } = data
      if (unauthorized_count || non_existent_count) {
        const failed_count = unauthorized_count + non_existent_count
        let err_str = `Failed to remove ${failed_count} subscribers from incident ${chalk.bold.blue(incident_id)} - ${deleted_count} unsubscribed`
        if (unauthorized_count) err_str += `, ${unauthorized_count} unauthorized`
        if (non_existent_count) err_str += `, ${non_existent_count} non-existent`
        console.log(err_str)
      }
    }
  }
}
