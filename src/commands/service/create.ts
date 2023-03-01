import { AuthenticatedBaseCommand } from '../../base/authenticated-base-command'
import { CliUx, Flags } from '@oclif/core'
import chalk from 'chalk'
import * as utils from '../../utils'
import * as chrono from 'chrono-node'

export default class ServiceCreate extends AuthenticatedBaseCommand<typeof ServiceCreate> {
  static description = 'Create a PagerDuty Service'

  static flags = {
    name: Flags.string({
      char: 'n',
      description: 'The service\'s name',
      required: true,
    }),
    description: Flags.string({
      char: 'd',
      description: 'The service\'s description',
    }),
    escalation_policy_id: Flags.string({
      char: 'e',
      description: 'The ID of the service\'s escalation policy.',
      exclusive: ['escalation_policy_name'],
    }),
    escalation_policy_name: Flags.string({
      char: 'E',
      description: 'The name of the service\'s escalation policy.',
      exclusive: ['escalation_policy_id'],
    }),
    auto_resolve_timeout: Flags.integer({
      char: 'r',
      description: 'Automatically resolve incidents after this number of minutes',
    }),
    ack_timeout: Flags.integer({
      char: 't',
      description: 'Automatically re-trigger incidents after this number of minutes',
    }),
    create_alerts: Flags.boolean({
      description: 'Turn on alert support in the service (default: true)',
      default: true,
    }),
    urgency: Flags.string({
      char: 'u',
      description: 'The urgency of incidents in the service',
      options: ['high', 'low', 'use_support_hours', 'severity_based'],
    }),
    Ss: Flags.string({
      description: 'The time of day when support hours start',
    }),
    Se: Flags.string({
      description: 'The time of day when support hours end',
    }),
    Sd: Flags.string({
      description: 'A day when support hours are active. Specify multiple times for multiple days.',
      multiple: true,
    }),
    Ud: Flags.string({
      description: 'Incident urgency during support hours.',
      options: ['high', 'low', 'severity_based'],
    }),
    Uo: Flags.string({
      description: 'Incident urgency outside of support hours.',
      options: ['high', 'low', 'severity_based'],
    }),
    Uc: Flags.boolean({
      description: 'Change unacknowledged incidents to high urgency when entering high-urgency support hours',
    }),
    Gd: Flags.integer({
      description: 'Do time based alert grouping for this number of minutes.',
      exclusive: ['Gi', 'Gc', 'Gf'],
    }),
    Gi: Flags.boolean({
      description: 'Do intelligent alert grouping',
      exclusive: ['Gd', 'Gc', 'Gf'],
    }),
    Gc: Flags.string({
      description: 'Do content-based alert grouping. Specify the fields to look at with --Gf and choose \'any\' or \'all\' fields.',
      options: ['any', 'all'],
      exclusive: ['Gd', 'Gi'],
    }),
    Gf: Flags.string({
      description: 'The fields to look at for content based alert grouping. Specify multiple times for multiple fields.',
      multiple: true,
      exclusive: ['Gd', 'Gi'],
    }),
    from: Flags.string({
      char: 'F',
      description: 'Login email of a PD user account for the "From:" header. Use only with legacy API tokens.',
    }),
    open: Flags.boolean({
      char: 'o',
      description: 'Open the new service in the browser',
    }),
    pipe: Flags.boolean({
      char: 'p',
      description: 'Print the service ID only to stdout, for use with pipes.',
      exclusive: ['open'],
    }),
  }

  async run() {
    const headers: Record<string, string> = {}

    let ep_id: string | null = null
    if (this.flags.escalation_policy_id) {
      ep_id = this.flags.escalation_policy_id
      if (utils.invalidPagerDutyIDs([ep_id]).length > 0) {
        this.error(`Invalid escalation policy ID ${chalk.bold.blue(ep_id)}`)
      }
    } else if (this.flags.escalation_policy_name) {
      ep_id = await this.pd.epIDForName(this.flags.escalation_policy_name)
      if (!ep_id) {
        this.error(`No escalation policy was found with the name ${chalk.bold.blue(this.flags.escalation_policy_name)}`, { exit: 1 })
      }
    } else {
      this.error('No escalation policy was specified. Please specify one with -e or -E')
    }

    const service: any = {
      service: {
        type: 'service',
        name: this.flags.name,
        escalation_policy: {
          type: 'escalation_policy_reference',
          id: ep_id,
        },
      },
    }

    service.service.alert_creation = this.flags.create_alerts ? 'create_alerts_and_incidents' : 'create_incidents'

    if (this.flags.description) service.service.description = this.flags.description
    if (this.flags.ack_timeout) {
      service.service.acknowledgement_timeout = this.flags.ack_timeout * 60
    }
    if (this.flags.auto_resolve_timeout) {
      service.service.auto_resolve_timeout = this.flags.auto_resolve_timeout * 60
    }
    if (this.flags.urgency) {
      if (['high', 'low', 'severity_based'].includes(this.flags.urgency)) {
        service.service.incident_urgency_rule = {
          type: 'constant',
          urgency: this.flags.urgency,
        }
      } else {
        // support hours based
        if (!(this.flags.Ss && this.flags.Se && this.flags.Sd)) {
          this.error('Support hours were not specified. Please specify support hours with --Ss, --Se, and --Sd', { exit: 1 })
        }
        if (!(this.flags.Ud && this.flags.Uo)) {
          this.error('Incident urgency during and outside of support hours was not specified. Please specify with --Ud and --Uo', { exit: 1 })
        }
        if (this.flags.Ud === this.flags.Uo) {
          this.error('Urgency during and outside support hours must be different.', { exit: 1 })
        }
        const start = chrono.parseDate(this.flags.Ss)
        const end = chrono.parseDate(this.flags.Se)
        if (!start) {
          this.error(`Invalid support hours start time: '${start}'`, { exit: 1 })
        }
        if (!end) {
          this.error(`Invalid support hours end time: '${end}'`, { exit: 1 })
        }
        const days_of_week_flags = utils.splitDedupAndFlatten(this.flags.Sd)
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
            this.error(`Invalid support hours day of week: '${w}'`, { exit: 1 })
          }
        }
        service.service.incident_urgency_rule = {
          type: 'use_support_hours',
          during_support_hours: {
            type: 'constant',
            urgency: this.flags.Ud,
          },
          outside_support_hours: {
            type: 'constant',
            urgency: this.flags.Uo,
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
        if (this.flags.Uc) {
          if (this.flags.Ud === 'high') {
            time_name = 'support_hours_start'
          } else if (this.flags.Uo === 'high') {
            time_name = 'support_hours_end'
          } else {
            this.error('You can\'t change urgency of incidents to high because there are no support hours when urgency is high', { exit: 1 })
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

    if (this.flags.Gd) {
      service.service.alert_grouping_parameters = {
        type: 'time',
        config: {
          timeout: this.flags.Gd,
        },
      }
    } else if (this.flags.Gi) {
      service.service.alert_grouping_parameters = {
        type: 'intelligent',
      }
    } else if (this.flags.Gc || this.flags.Gf) {
      if (!(this.flags.Gc && this.flags.Gf)) {
        this.error('You have to specify both --Gc and --Gf for content based alert grouping', { exit: 1 })
      }

      const fields = utils.splitDedupAndFlatten(this.flags.Gf)
      const acceptable_fields = ['class', 'component', 'group', 'source', 'severity', 'summary']
      if (fields.some(x => !(acceptable_fields.includes(x) || x.startsWith('custom_details.')))) {
        this.error(`Content-based alert grouping fields must be one of ${acceptable_fields.map(x => chalk.bold(x)).join(', ')}, or begin with ${chalk.bold('custom_details.')}`, { exit: 1 })
      }

      service.service.alert_grouping_parameters = {
        type: 'content_based',
        config: {
          aggregate: this.flags.Gc,
          fields,
        },
      }
    }

    CliUx.ux.action.start('Creating a PagerDuty service')
    const r = await this.pd.request({
      endpoint: 'services',
      method: 'POST',
      data: service,
      headers: headers,
    })
    if (r.isFailure) {
      CliUx.ux.action.stop(chalk.bold.red('failed!'))
      this.error(`Failed to create service: ${r.getFormattedError()}`, { exit: 1 })
    }
    CliUx.ux.action.stop(chalk.bold.green('done'))
    const returned_service = r.getData()

    if (this.flags.pipe) {
      this.log(returned_service.service.id)
    } else if (this.flags.open) {
      await CliUx.ux.wait(1000)
      CliUx.ux.action.start(`Opening ${chalk.bold.blue(returned_service.service.html_url)} in the browser`)
      try {
        await CliUx.ux.open(returned_service.service.html_url)
      } catch (error) {
        CliUx.ux.action.stop(chalk.bold.red('failed!'))
        this.error('Couldn\'t open your browser. Are you running as root?', { exit: 1 })
      }
      CliUx.ux.action.stop(chalk.bold.green('done'))
    } else {
      this.log(`Your new service is at ${chalk.bold.blue(returned_service.service.html_url)}`)
    }
  }
}
