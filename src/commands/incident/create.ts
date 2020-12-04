import Command from '../../base'
import {flags} from '@oclif/command'
import chalk from 'chalk'
import cli from 'cli-ux'
import * as pd from '../../pd'
import * as utils from '../../utils'
import { throws } from 'assert'

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
    open: flags.boolean({
      char: 'o',
      description: 'Open the new incident in the browser',
    }),
    pipe: flags.boolean({
      char: 'p',
      description: 'Print the incident ID only to stdout, for use with pipes.',
      exclusive: ['open'],
    }),
    ...cli.table.flags(),
  }

  async run() {
    const {flags} = this.parse(IncidentCreate)

    // get a validated token from base class
    const token = this.token as string

    let incident: any = {
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

    if (flags.priority) {
      cli.action.start('Getting incident priorities from PD')
      const r = await pd.getPrioritiesMapByName(token)
      this.dieIfFailed(r)
      const priorities_map = r.getValue()
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
      const r = await pd.fetch(token, '/services', {query: flags.service})
      this.dieIfFailed(r)
      let services = r.getValue()
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
      const r = await pd.fetch(token, '/escalation_policies', {query: flags.escalation_policy})
      this.dieIfFailed(r)
      let eps = r.getValue()
      eps = eps.filter((e: { name: string | undefined }) => {
        return e.name === flags.escalation_policy
      })
      if (eps.length === 0) {
        this.error(`No escalation policy was found with the name ${chalk.bold.blue(flags.escalation_policy)}`, {exit: 1})
        this.exit(0)
      }
      incident.incident.escalation_policy = {
        type: 'escalation_policy_reference',
        id: eps[0].id,
      }
    }

    cli.action.start('Creating PagerDuty incident')
    const r = await pd.request(token, 'incidents', 'POST', null, incident)
    this.dieIfFailed(r, {prefixMessage: 'Incident create request failed'})
    incident = r.getValue()
    cli.action.stop(chalk.bold.green('done'))
    if (flags.pipe) {
      this.log(incident.incident.id)
    } else if (flags.open) {
      cli.action.start(`Opening ${chalk.bold.blue(incident.incident.html_url)} in the browser`)
      try {
        cli.open(incident.incident.html_url)
      } catch (error) {
        this.error('Couldn\'t open your browser. Are you running as root?', {exit: 1})
      }
      cli.action.stop(chalk.bold.green('done'))
    } else {
      this.log(`Your new incident is at ${chalk.bold.blue(incident.incident.html_url)}`)
    }
  }
}
