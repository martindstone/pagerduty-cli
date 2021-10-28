/* eslint-disable complexity */
import Command from '../../base'
import {flags} from '@oclif/command'
import chalk from 'chalk'
import cli from 'cli-ux'
import * as utils from '../../utils'

export default class IncidentCreate extends Command {
  static description = 'Create a PagerDuty Incident'

  static flags = {
    ...Command.flags,
    service: flags.string({
      char: 'S',
      description: 'The name of the service to create the incident in',
      exclusive: ['service_id'],
    }),
    service_id: flags.string({
      description: 'The ID of the service to create the incident in',
      exclusive: ['service'],
    }),
    escalation_policy: flags.string({
      char: 'E',
      description: 'The name of the escalation policy to assign the incident to',
      exclusive: ['escalation_policy_id'],
    }),
    escalation_policy_id: flags.string({
      description: 'The ID of the escalation policy to assign the incident to',
      exclusive: ['escalation_policy'],
    }),
    user: flags.string({
      char: 'U',
      description: 'The email of a user to assign the incident to',
      exclusive: ['escalation_policy', 'escalation_policy_id'],
      multiple: true,
    }),
    user_id: flags.string({
      description: 'The ID of a user to assign the incident to',
      exclusive: ['escalation_policy', 'escalation_policy_id'],
      multiple: true,
    }),
    title: flags.string({
      char: 't',
      description: 'Incident title',
      required: true,
    }),
    details: flags.string({
      char: 'd',
      description: 'Incident details',
    }),
    urgency: flags.string({
      char: 'u',
      description: 'Incident urgency',
      options: ['high', 'low'],
    }),
    priority: flags.string({
      char: 'P',
      description: 'Incident priority',
    }),
    key: flags.string({
      char: 'k',
      description: 'Incident key',
    }),
    from: flags.string({
      char: 'F',
      description: 'Login email of a PD user account for the "From:" header. Use only with legacy API tokens.',
    }),
    open: flags.boolean({
      char: 'o',
      description: 'Open the new incident in the browser',
    }),
    pipe: flags.boolean({
      char: 'p',
      description: 'Print the incident ID only to stdout, for use with pipes.',
      exclusive: ['open'],
    }),
  }

  async run() {
    const {flags} = this.parse(IncidentCreate)

    const headers: Record<string, string> = {}

    const incident: any = {
      incident: {
        type: 'incident',
        title: flags.title,
        service: {
          type: 'service_reference',
        },
      },
    }

    if (flags.details) {
      incident.incident.body = {
        type: 'incident_body',
        details: flags.details,
      }
    }

    if (flags.key) {
      incident.incident.incident_key = flags.key
    }

    if (flags.urgency) {
      incident.incident.urgency = flags.urgency
    }

    if (flags.from) {
      headers.From = flags.from
    }

    if (flags.priority) {
      cli.action.start('Getting incident priorities from PD')
      const priorities_map = await this.pd.getPrioritiesMapByName()
      if (priorities_map === {}) {
        cli.action.stop(chalk.bold.red('none found'))
      }
      if (priorities_map[flags.priority]) {
        incident.incident.priority = {
          type: 'priority_reference',
          id: priorities_map[flags.priority].id,
        }
      } else {
        this.error(`No priority was found with the name ${chalk.bold.blue(flags.priority)}`, {exit: 1})
      }
    }

    if (flags.service_id) {
      const invalid_ids = utils.invalidPagerDutyIDs([flags.service_id])
      if (invalid_ids.length > 0) {
        this.error(`Invalid service ID ${chalk.bold.blue(flags.service_id)}`, {exit: 1})
      }
      incident.incident.service.id = flags.service_id
    } else if (flags.service) {
      cli.action.start('Finding service in PD')
      let services = await this.pd.fetch('services', {params: {query: flags.service}})
      services = services.filter((e: { name: string | undefined }) => {
        return e.name === flags.service
      })
      if (services.length === 0) {
        this.error(`No service was found with the name ${chalk.bold.blue(flags.service)}`, {exit: 1})
      }
      incident.incident.service.id = services[0].id
    } else {
      this.error('You must specify one of: --service, --service_id', {exit: 1})
    }

    if (flags.escalation_policy_id) {
      const invalid_ids = utils.invalidPagerDutyIDs([flags.escalation_policy_id])
      if (invalid_ids.length > 0) {
        this.error(`Invalid escalation policy ID ${chalk.bold.blue(flags.escalation_policy_id)}`, {exit: 1})
      }
      incident.incident.escalation_policy = {
        type: 'escalation_policy_reference',
        id: flags.escalation_policy_id,
      }
    } else if (flags.escalation_policy) {
      cli.action.start('Finding escalation policy in PD')
      let eps = await this.pd.fetch('escalation_policies', {params: {query: flags.escalation_policy}})
      eps = eps.filter((e: { name: string | undefined }) => {
        return e.name === flags.escalation_policy
      })
      if (eps.length === 0) {
        this.error(`No escalation policy was found with the name ${chalk.bold.blue(flags.escalation_policy)}`, {exit: 1})
      }
      incident.incident.escalation_policy = {
        type: 'escalation_policy_reference',
        id: eps[0].id,
      }
    }

    if (flags.user) {
      for (const email of flags.user) {
        cli.action.start(`Finding user ${chalk.bold.blue(email)}`)
        // eslint-disable-next-line no-await-in-loop
        const user: any = await this.pd.userIDForEmail(email)
        if (!user) {
          cli.action.stop(chalk.bold.red('failed!'))
          this.error(`No user was found for email ${email}`, {exit: 1})
        }
        if (!incident.incident.assignments) {
          incident.incident.assignments = []
        }
        incident.incident.assignments.push({
          assignee: {
            type: 'user_reference',
            id: user,
          },
        })
      }
    }

    cli.action.start('Creating PagerDuty incident')
    // const r = await pd.request(token, 'incidents', 'POST', null, incident, headers)
    const r = await this.pd.request({
      endpoint: 'incidents',
      method: 'POST',
      data: incident,
      headers: headers,
    })
    if (r.isFailure) {
      this.error(`Failed to create incident: ${r.getFormattedError()}`, {exit: 1})
    }
    cli.action.stop(chalk.bold.green('done'))
    const returned_incident = r.getData()

    if (flags.pipe) {
      this.log(returned_incident.incident.id)
    } else if (flags.open) {
      cli.action.start(`Opening ${chalk.bold.blue(returned_incident.incident.html_url)} in the browser`)
      try {
        await cli.open(returned_incident.incident.html_url)
      } catch (error) {
        cli.action.stop(chalk.bold.red('failed!'))
        this.error('Couldn\'t open your browser. Are you running as root?', {exit: 1})
      }
      cli.action.stop(chalk.bold.green('done'))
    } else {
      this.log(`Your new incident is at ${chalk.bold.blue(returned_incident.incident.html_url)}`)
    }
  }
}
