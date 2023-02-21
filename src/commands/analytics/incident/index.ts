import { AuthenticatedBaseCommand } from '../../../base/authenticated-base-command'
import { CliUx, Flags } from '@oclif/core'
import chalk from 'chalk'
import * as chrono from 'chrono-node'

export default class AnalyticsIncident extends AuthenticatedBaseCommand<typeof AnalyticsIncident> {
  static description = 'Get PagerDuty Incident Analytics'

  static flags = {
    teams: Flags.string({
      char: 't',
      description: 'Team names to include. Specify multiple times for multiple teams.',
      multiple: true,
    }),
    services: Flags.string({
      char: 'S',
      description: 'Service names to include. Specify multiple times for multiple services.',
      multiple: true,
    }),
    major: Flags.boolean({
      char: 'M',
      description: 'Include only major incidents',
    }),
    urgencies: Flags.string({
      char: 'u',
      description: 'Urgencies to include.',
      multiple: true,
      options: ['high', 'low'],
      default: ['high', 'low'],
    }),
    since: Flags.string({
      description: 'The start of the date range over which you want to search.',
      default: '7 days ago',
    }),
    until: Flags.string({
      description: 'The end of the date range over which you want to search.',
      default: 'now',
    }),
    aggregate_unit: Flags.string({
      char: 'g',
      description: 'The time unit to aggregate metrics by. If no value is provided, the metrics will be aggregated for the entire period.',
      options: ['day', 'week', 'month'],
    }),
    keys: Flags.string({
      char: 'k',
      description: 'Additional fields to display. Specify multiple times for multiple fields.',
      multiple: true,
    }),
    json: Flags.boolean({
      char: 'j',
      description: 'output full details as JSON',
      exclusive: ['columns', 'filter', 'sort', 'csv', 'extended'],
    }),
    delimiter: Flags.string({
      char: 'd',
      description: 'Delimiter for fields that have more than one value',
      default: '\\n',
    }),
    ...CliUx.ux.table.flags(),
  }

  public async init(): Promise<void> {
    await super.init()
    if (this.flags.delimiter === '\\n') {
      this.flags.delimiter = '\n'
    }
    if (this.flags.keys) {
      this.flags.keys = this.flags.keys.map(x => x.split(/,\s*/)).flat().filter(x => x)
    }
  }

  async run() {
    const headers = {
      'X-EARLY-ACCESS': 'analytics-v2',
      'Content-Type': 'application/json',
    }

    const data: Record<string, any> = {
      filters: {
        major: this.flags.major,
      },
    }

    if (this.flags.aggregate_unit) {
      data.aggregate_unit = this.flags.aggregate_unit
    }

    if (this.flags.teams) {
      CliUx.ux.action.start('Finding teams')
      let teams: any[] = []
      for (const name of this.flags.teams) {
        // eslint-disable-next-line no-await-in-loop
        const r = await this.pd.fetch('teams', { params: { query: name } })
        teams = [...teams, ...r.map((e: { id: any }) => e.id)]
      }
      const team_ids = [...new Set(teams)]
      if (team_ids.length === 0) {
        CliUx.ux.action.stop(chalk.bold.red('none found'))
        this.error('No teams found. Please check your search.', { exit: 1 })
      }
      data.filters.team_ids = team_ids
    }

    if (this.flags.services) {
      CliUx.ux.action.start('Finding services')
      let services: any[] = []
      for (const name of this.flags.services) {
        // eslint-disable-next-line no-await-in-loop
        const r = await this.pd.fetch('services', { params: { query: name } })
        services = [...services, ...r.map((e: { id: any }) => e.id)]
      }
      const service_ids = [...new Set(services)]
      if (service_ids.length === 0) {
        CliUx.ux.action.stop(chalk.bold.red('none found'))
        this.error('No services found. Please check your search.', { exit: 1 })
      }
      data.filters.service_ids = service_ids
    }

    if (this.flags.since) {
      const since = chrono.parseDate(this.flags.since)
      if (since) {
        data.filters.created_at_start = since.toISOString()
      }
    }
    if (this.flags.until) {
      const until = chrono.parseDate(this.flags.until)
      if (until) {
        data.filters.created_at_end = until.toISOString()
      }
    }

    const analytics = await this.pd.fetchWithSpinner('analytics/metrics/incidents/all', {
      headers: headers,
      method: 'post',
      data: data,
      activityDescription: 'Getting analytics',
    })

    if (analytics.length === 0) {
      this.error('No analytics found', { exit: 0 })
    }

    if (this.flags.json) {
      await this.printJsonAndExit(analytics)
    }

    const columns: Record<string, any> = {
      range_start: {
        get: (row: { range_start: string }) => (new Date(row.range_start)).toLocaleString(),
      },
      mean_assignment_count: {
        get: (row: { mean_assignment_count: string }) => row.mean_assignment_count === null ? '' : row.mean_assignment_count,
      },
      mean_engaged_seconds: {
        get: (row: { mean_engaged_seconds: string }) => row.mean_engaged_seconds === null ? '' : row.mean_engaged_seconds,
      },
      mean_engaged_user_count: {
        get: (row: { mean_engaged_user_count: string }) => row.mean_engaged_user_count === null ? '' : row.mean_engaged_user_count,
      },
      mean_seconds_to_engage: {
        get: (row: { mean_seconds_to_engage: string }) => row.mean_seconds_to_engage === null ? '' : row.mean_seconds_to_engage,
      },
      mean_seconds_to_first_ack: {
        get: (row: { mean_seconds_to_first_ack: string }) => row.mean_seconds_to_first_ack === null ? '' : row.mean_seconds_to_first_ack,
      },
      mean_seconds_to_mobilize: {
        get: (row: { mean_seconds_to_mobilize: string }) => row.mean_seconds_to_mobilize === null ? '' : row.mean_seconds_to_mobilize,
      },
      mean_seconds_to_resolve: {
        get: (row: { mean_seconds_to_resolve: string }) => row.mean_seconds_to_resolve === null ? '' : row.mean_seconds_to_resolve,
      },
      total_business_hour_interruptions: {
        get: (row: { total_business_hour_interruptions: string }) => row.total_business_hour_interruptions === null ? '' : row.total_business_hour_interruptions,
      },
      total_engaged_seconds: {
        get: (row: { total_engaged_seconds: string }) => row.total_engaged_seconds === null ? '' : row.total_engaged_seconds,
      },
      total_escalation_count: {
        get: (row: { total_escalation_count: string }) => row.total_escalation_count === null ? '' : row.total_escalation_count,
      },
      total_incident_count: {
        get: (row: { total_incident_count: string }) => row.total_incident_count === null ? '' : row.total_incident_count,
      },
      total_off_hour_interruptions: {
        get: (row: { total_off_hour_interruptions: string }) => row.total_off_hour_interruptions === null ? '' : row.total_off_hour_interruptions,
      },
      total_sleep_hour_interruptions: {
        get: (row: { total_sleep_hour_interruptions: string }) => row.total_sleep_hour_interruptions === null ? '' : row.total_sleep_hour_interruptions,
      },
      total_snoozed_seconds: {
        get: (row: { total_snoozed_seconds: string }) => row.total_snoozed_seconds === null ? '' : row.total_snoozed_seconds,
      },
    }
    if (!(this.flags.aggregate_unit)) {
      delete columns.range_start
    }

    if (this.flags.csv || this.flags.output) {
      this.printTable(analytics, columns, this.flags)
      this.exit(0)
    }

    let meanColumnsArr = Object.entries(columns).filter(([k, _v]) => {
      return k === 'range_start' || k.indexOf('mean') > -1
    })
    meanColumnsArr = meanColumnsArr.map(([k, v]) => {
      return [k.replace(/^mean_/, ''), v]
    })
    const meanColumns = Object.fromEntries(meanColumnsArr)
    this.log(chalk.bold.blue('Mean values:'))
    this.printTable(analytics, meanColumns, this.flags)

    let totalColumnsArr = Object.entries(columns).filter(([k, _v]) => {
      return k === 'range_start' || k.indexOf('total') > -1
    })
    totalColumnsArr = totalColumnsArr.map(([k, v]) => {
      return [k.replace(/^total_/, ''), v]
    })
    const totalColumns = Object.fromEntries(totalColumnsArr)
    this.log('')
    this.log(chalk.bold.blue('Total values:'))
    this.printTable(analytics, totalColumns, this.flags)
  }
}
