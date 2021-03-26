/* eslint-disable complexity */
import Command from '../../base'
import {flags} from '@oclif/command'
import chalk from 'chalk'
import cli from 'cli-ux'
import * as utils from '../../utils'
import * as chrono from 'chrono-node'

export default class ServiceCreate extends Command {
  static description = 'Create a PagerDuty Service'

  static flags = {
    ...Command.flags,
    name: flags.string({
      char: 'n',
      description: 'The service\'s name',
      required: true,
    }),
    description: flags.string({
      char: 'd',
      description: 'The service\'s description',
    }),
    escalation_policy_id: flags.string({
      char: 'e',
      description: 'The ID of the service\'s escalation policy.',
      exclusive: ['escalation_policy_name'],
    }),
    escalation_policy_name: flags.string({
      char: 'E',
      description: 'The name of the service\'s escalation policy.',
      exclusive: ['user_id'],
    }),
    auto_resolve_timeout: flags.integer({
      char: 'r',
      description: 'Automatically resolve incidents after this number of minutes',
    }),
    ack_timeout: flags.integer({
      char: 't',
      description: 'Automatically re-trigger incidents after this number of minutes',
    }),
    create_alerts: flags.boolean({
      description: 'Turn on alert support in the service (default: true)',
      default: true,
    }),
    urgency: flags.string({
      char: 'u',
      description: 'The urgency of incidents in the service',
      options: ['high', 'low', 'use_support_hours', 'severity_based'],
    }),
    Ss: flags.string({
      description: 'The time of day when support hours start',
    }),
    Se: flags.string({
      description: 'The time of day when support hours end',
    }),
    Sd: flags.string({
      description: 'A day when support hours are active. Specify multiple times for multiple days.',
      multiple: true,
    }),
    Ud: flags.string({
      description: 'Incident urgency during support hours.',
      options: ['high', 'low', 'severity_based'],
    }),
    Uo: flags.string({
      description: 'Incident urgency outside of support hours.',
      options: ['high', 'low', 'severity_based'],
    }),
    Uc: flags.boolean({
      description: 'Change unacknowledged incidents to high urgency when entering high-urgency support hours',
    }),
    Gd: flags.integer({
      description: 'Do time based alert grouping for this number of minutes.',
      exclusive: ['Gi', 'Gc', 'Gf'],
    }),
    Gi: flags.boolean({
      description: 'Do intelligent alert grouping',
      exclusive: ['Gd', 'Gc', 'Gf'],
    }),
    Gc: flags.string({
      description: 'Do content-based alert grouping. Specify the fields to look at with --Gf and choose \'any\' or \'all\' fields.',
      options: ['any', 'all'],
      exclusive: ['Gd', 'Gi'],
    }),
    Gf: flags.string({
      description: 'The fields to look at for content based alert grouping. Specify multiple times for multiple fields.',
      multiple: true,
      exclusive: ['Gd', 'Gi'],
    }),
    from: flags.string({
      char: 'F',
      description: 'Login email of a PD user account for the "From:" header. Use only with legacy API tokens.',
    }),
    open: flags.boolean({
      char: 'o',
      description: 'Open the new service in the browser',
    }),
    pipe: flags.boolean({
      char: 'p',
      description: 'Print the service ID only to stdout, for use with pipes.',
      exclusive: ['open'],
    }),
  }

  async run() {
    const {flags} = this.parse(ServiceCreate)

    const headers: Record<string, string> = {}

    let ep_id: string | null = null
    if (flags.escalation_policy_id) {
      ep_id = flags.escalation_policy_id
      if (utils.invalidPagerDutyIDs([ep_id]).length > 0) {
        this.error(`Invalid escalation policy ID ${chalk.bold.blue(ep_id)}`)
      }
    } else if (flags.escalation_policy_name) {
      ep_id = await this.pd.epIDForName(flags.escalation_policy_name)
      if (!ep_id) {
        this.error(`No escalation policy was found with the name ${chalk.bold.blue(flags.escalation_policy_name)}`, {exit: 1})
      }
    } else {
      this.error('No escalation policy was specified. Please specify one with -e or -E')
    }

    const service: any = {
      service: {
        type: 'service',
        name: flags.name,
        escalation_policy: {
          type: 'escalation_policy_reference',
          id: ep_id,
        },
      },
    }

    service.service.alert_creation = flags.create_alerts ? 'create_alerts_and_incidents' : 'create_incidents'

    if (flags.description) service.service.description = flags.description
    if (flags.ack_timeout) {
      service.service.acknowledgement_timeout = flags.ack_timeout * 60
    }
    if (flags.auto_resolve_timeout) {
      service.service.auto_resolve_timeout = flags.auto_resolve_timeout * 60
    }
    if (flags.urgency) {
      if (['high', 'low', 'severity_based'].includes(flags.urgency)) {
        service.service.incident_urgency_rule = {
          type: 'constant',
          urgency: flags.urgency,
        }
      } else {
        // support hours based
        if (!(flags.Ss && flags.Se && flags.Sd)) {
          this.error('Support hours were not specified. Please specify support hours with --Ss, --Se, and --Sd', {exit: 1})
        }
        if (!(flags.Ud && flags.Uo)) {
          this.error('Incident urgency during and outside of support hours was not specified. Please specify with --Ud and --Uo', {exit: 1})
        }
        if (flags.Ud === flags.Uo) {
          this.error('Urgency during and outside support hours must be different.', {exit: 1})
        }
        const start = chrono.parseDate(flags.Ss)
        const end = chrono.parseDate(flags.Se)
        if (!start) {
          this.error(`Invalid support hours start time: '${start}'`, {exit: 1})
        }
        if (!end) {
          this.error(`Invalid support hours end time: '${end}'`, {exit: 1})
        }
        const days_of_week_flags = utils.splitDedupAndFlatten(flags.Sd)
        const days_of_week = []
        for (const days_of_week_flag of days_of_week_flags) {
          const w = days_of_week_flag.toLowerCase()
          if (w.startsWith('mon') || w === '1') {
            days_of_week.push(1)
          } else if (w.startsWith('tue') || w === '2') {
            days_of_week.push(2)
          } else if (w.startsWith('wed') || w === '3') {
            days_of_week.push(3)
          } else if (w.startsWith('thu') || w === '4') {
            days_of_week.push(4)
          } else if (w.startsWith('fri') || w === '5') {
            days_of_week.push(5)
          } else if (w.startsWith('sat') || w === '6') {
            days_of_week.push(6)
          } else if (w.startsWith('sun') || w === '0') {
            days_of_week.push(7)
          } else {
            this.error(`Invalid support hours day of week: '${w}'`, {exit: 1})
          }
        }
        service.service.incident_urgency_rule = {
          type: 'use_support_hours',
          during_support_hours: {
            type: 'constant',
            urgency: flags.Ud,
          },
          outside_support_hours: {
            type: 'constant',
            urgency: flags.Uo,
          },
        }
        const start_time = start.toTimeString().split(' ')[0]
        const end_time = end.toTimeString().split(' ')[0]
        service.service.support_hours = {
          type: 'fixed_time_per_day',
          // eslint-disable-next-line new-cap
          time_zone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          days_of_week,
          start_time,
          end_time,
        }
        service.service.scheduled_actions = []
        let time_name = ''
        if (flags.Uc) {
          if (flags.Ud === 'high') {
            time_name = 'support_hours_start'
          } else if (flags.Uo === 'high') {
            time_name = 'support_hours_end'
          } else {
            this.error('You can\'t change urgency of incidents to high because there are no support hours when urgency is high', {exit: 1})
          }
          service.service.scheduled_actions.push({
            type: 'urgency_change',
            at: {
              type: 'named_time',
              name: time_name,
            },
            to_urgency: 'high',
          })
        }
      }
    }

    if (flags.Gd) {
      service.service.alert_grouping_parameters = {
        type: 'time',
        config: {
          timeout: flags.Gd,
        },
      }
    } else if (flags.Gi) {
      service.service.alert_grouping_parameters = {
        type: 'intelligent',
      }
    } else if (flags.Gc || flags.Gf) {
      if (!(flags.Gc && flags.Gf)) {
        this.error('You have to specify both --Gc and --Gf for content based alert grouping', {exit: 1})
      }

      const fields = utils.splitDedupAndFlatten(flags.Gf)
      const acceptable_fields = ['class', 'component', 'group', 'source', 'severity', 'summary']
      if (fields.some(x => !(acceptable_fields.includes(x) || x.startsWith('custom_details.')))) {
        this.error(`Content-based alert grouping fields must be one of ${acceptable_fields.map(x => chalk.bold(x)).join(', ')}, or begin with ${chalk.bold('custom_details.')}`, {exit: 1})
      }

      service.service.alert_grouping_parameters = {
        type: 'content_based',
        config: {
          aggregate: flags.Gc,
          fields,
        },
      }
    }

    cli.action.start('Creating a PagerDuty service')
    const r = await this.pd.request({
      endpoint: 'services',
      method: 'POST',
      data: service,
      headers: headers,
    })
    if (r.isFailure) {
      cli.action.stop(chalk.bold.red('failed!'))
      this.error(`Failed to create service: ${r.getFormattedError()}`, {exit: 1})
    }
    cli.action.stop(chalk.bold.green('done'))
    const returned_service = r.getData()

    if (flags.pipe) {
      this.log(returned_service.service.id)
    } else if (flags.open) {
      await cli.wait(1000)
      cli.action.start(`Opening ${chalk.bold.blue(returned_service.service.html_url)} in the browser`)
      try {
        cli.open(returned_service.service.html_url)
      } catch (error) {
        this.error('Couldn\'t open your browser. Are you running as root?', {exit: 1})
      }
      cli.action.stop(chalk.bold.green('done'))
    } else {
      this.log(`Your new service is at ${chalk.bold.blue(returned_service.service.html_url)}`)
    }
  }
}
