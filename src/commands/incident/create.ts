import { AuthenticatedBaseCommand } from '../../base/authenticated-base-command'
import { CliUx, Flags } from '@oclif/core'
import chalk from 'chalk'
import * as utils from '../../utils'

export default class IncidentCreate extends AuthenticatedBaseCommand<typeof IncidentCreate> {
  static description = 'Create a PagerDuty Incident'

  static flags = {
    service: Flags.string({
      char: 'S',
      description: 'The name of the service to create the incident in',
      exclusive: ['service_id'],
    }),
    service_id: Flags.string({
      description: 'The ID of the service to create the incident in',
      exclusive: ['service'],
    }),
    escalation_policy: Flags.string({
      char: 'E',
      description: 'The name of the escalation policy to assign the incident to',
      exclusive: ['escalation_policy_id'],
    }),
    escalation_policy_id: Flags.string({
      description: 'The ID of the escalation policy to assign the incident to',
      exclusive: ['escalation_policy'],
    }),
    user: Flags.string({
      char: 'U',
      description: 'The email of a user to assign the incident to',
      exclusive: ['escalation_policy', 'escalation_policy_id'],
      multiple: true,
    }),
    user_id: Flags.string({
      description: 'The ID of a user to assign the incident to',
      exclusive: ['escalation_policy', 'escalation_policy_id'],
      multiple: true,
    }),
    title: Flags.string({
      char: 't',
      description: 'Incident title',
      required: true,
    }),
    details: Flags.string({
      char: 'd',
      description: 'Incident details',
    }),
    urgency: Flags.string({
      char: 'u',
      description: 'Incident urgency',
      options: ['high', 'low'],
    }),
    priority: Flags.string({
      char: 'P',
      description: 'Incident priority',
    }),
    key: Flags.string({
      char: 'k',
      description: 'Incident key',
    }),
    from: Flags.string({
      char: 'F',
      description: 'Login email of a PD user account for the "From:" header. Use only with legacy API tokens.',
    }),
    open: Flags.boolean({
      char: 'o',
      description: 'Open the new incident in the browser',
    }),
    pipe: Flags.boolean({
      char: 'p',
      description: 'Print the incident ID only to stdout, for use with pipes.',
      exclusive: ['open'],
    }),
  }

  async run() {
    const headers: Record<string, string> = {}

    const incident: any = {
      incident: {
        type: 'incident',
        title: this.flags.title,
        service: {
          type: 'service_reference',
        },
      },
    }

    if (this.flags.details) {
      const details = this.flags.details.replace(/\\[nt]/g, x => {
        switch (x) {
          case "\\n": return "\n"
          case "\\t": return "\t"
          default: return x
        }
      })
      incident.incident.body = {
        type: 'incident_body',
        details,
      }
    }

    if (this.flags.key) {
      incident.incident.incident_key = this.flags.key
    }

    if (this.flags.urgency) {
      incident.incident.urgency = this.flags.urgency
    }

    if (this.flags.from) {
      headers.From = this.flags.from
    }

    if (this.flags.priority) {
      CliUx.ux.action.start('Getting incident priorities from PD')
      const priorities_map = await this.pd.getPrioritiesMapByName()
      if (Object.keys(priorities_map).length === 0) {
        CliUx.ux.action.stop(chalk.bold.red('none found'))
      }
      if (priorities_map[this.flags.priority]) {
        incident.incident.priority = {
          type: 'priority_reference',
          id: priorities_map[this.flags.priority].id,
        }
      } else {
        this.error(`No priority was found with the name ${chalk.bold.blue(this.flags.priority)}`, { exit: 1 })
      }
    }

    if (this.flags.service_id) {
      const invalid_ids = utils.invalidPagerDutyIDs([this.flags.service_id])
      if (invalid_ids.length > 0) {
        this.error(`Invalid service ID ${chalk.bold.blue(this.flags.service_id)}`, { exit: 1 })
      }
      incident.incident.service.id = this.flags.service_id
    } else if (this.flags.service) {
      CliUx.ux.action.start('Finding service in PD')
      let services = await this.pd.fetch('services', { params: { query: this.flags.service } })
      services = services.filter((e: { name: string | undefined }) => {
        return e.name === this.flags.service
      })
      if (services.length === 0) {
        this.error(`No service was found with the name ${chalk.bold.blue(this.flags.service)}`, { exit: 1 })
      }
      incident.incident.service.id = services[0].id
    } else {
      this.error('You must specify one of: --service, --service_id', { exit: 1 })
    }

    if (this.flags.escalation_policy_id) {
      const invalid_ids = utils.invalidPagerDutyIDs([this.flags.escalation_policy_id])
      if (invalid_ids.length > 0) {
        this.error(`Invalid escalation policy ID ${chalk.bold.blue(this.flags.escalation_policy_id)}`, { exit: 1 })
      }
      incident.incident.escalation_policy = {
        type: 'escalation_policy_reference',
        id: this.flags.escalation_policy_id,
      }
    } else if (this.flags.escalation_policy) {
      CliUx.ux.action.start('Finding escalation policy in PD')
      let eps = await this.pd.fetch('escalation_policies', { params: { query: this.flags.escalation_policy } })
      eps = eps.filter((e: { name: string | undefined }) => {
        return e.name === this.flags.escalation_policy
      })
      if (eps.length === 0) {
        this.error(`No escalation policy was found with the name ${chalk.bold.blue(this.flags.escalation_policy)}`, { exit: 1 })
      }
      incident.incident.escalation_policy = {
        type: 'escalation_policy_reference',
        id: eps[0].id,
      }
    }

    if (this.flags.user) {
      for (const email of this.flags.user) {
        CliUx.ux.action.start(`Finding user ${chalk.bold.blue(email)}`)
        // eslint-disable-next-line no-await-in-loop
        const user: any = await this.pd.userIDForEmail(email)
        if (!user) {
          CliUx.ux.action.stop(chalk.bold.red('failed!'))
          this.error(`No user was found for email ${email}`, { exit: 1 })
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

    CliUx.ux.action.start('Creating PagerDuty incident')
    // const r = await pd.request(token, 'incidents', 'POST', null, incident, headers)
    const r = await this.pd.request({
      endpoint: 'incidents',
      method: 'POST',
      data: incident,
      headers: headers,
    })
    if (r.isFailure) {
      this.error(`Failed to create incident: ${r.getFormattedError()}`, { exit: 1 })
    }
    CliUx.ux.action.stop(chalk.bold.green('done'))
    const returned_incident = r.getData()

    if (this.flags.pipe) {
      this.log(returned_incident.incident.id)
    } else if (this.flags.open) {
      CliUx.ux.action.start(`Opening ${chalk.bold.blue(returned_incident.incident.html_url)} in the browser`)
      try {
        await CliUx.ux.open(returned_incident.incident.html_url)
      } catch (error) {
        CliUx.ux.action.stop(chalk.bold.red('failed!'))
        this.error('Couldn\'t open your browser. Are you running as root?', { exit: 1 })
      }
      CliUx.ux.action.stop(chalk.bold.green('done'))
    } else {
      this.log(`Your new incident is at ${chalk.bold.blue(returned_incident.incident.html_url)}`)
    }
  }
}
