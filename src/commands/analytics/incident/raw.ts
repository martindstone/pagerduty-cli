/* eslint-disable no-await-in-loop */
/* eslint-disable complexity */
import Command from '../../../base'
import {CliUx, Flags} from '@oclif/core'
import chalk from 'chalk'
import * as utils from '../../../utils'
import jp from 'jsonpath'
import * as chrono from 'chrono-node'

export default class AnalyticsRaw extends Command {
  static description = 'Get PagerDuty Raw Incident Analytics'

  static flags = {
    ...Command.flags,
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
    since: Flags.string({
      description: 'The start of the date range over which you want to search.',
    }),
    until: Flags.string({
      description: 'The end of the date range over which you want to search.',
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
      default: '\n',
    }),
    ...CliUx.ux.table.flags(),
  }

  async run() {
    const {flags} = await this.parse(AnalyticsRaw)

    const headers = {
      'X-EARLY-ACCESS': 'analytics-v2',
      'Content-Type': 'application/json',
    }

    const data: Record<string, any> = {
      filters: {},
      // aggregate_unit: 'day',
    }

    if (flags.teams) {
      CliUx.ux.action.start('Finding teams')
      let teams: any[] = []
      for (const name of flags.teams) {
        // eslint-disable-next-line no-await-in-loop
        const r = await this.pd.fetch('teams', {params: {query: name}})
        teams = [...teams, ...r.map((e: { id: any }) => e.id)]
      }
      const team_ids = [...new Set(teams)]
      if (team_ids.length === 0) {
        CliUx.ux.action.stop(chalk.bold.red('none found'))
        this.error('No teams found. Please check your search.', {exit: 1})
      }
      data.filters.team_ids = team_ids
    }

    if (flags.services) {
      CliUx.ux.action.start('Finding services')
      let services: any[] = []
      for (const name of flags.services) {
        // eslint-disable-next-line no-await-in-loop
        const r = await this.pd.fetch('services', {params: {query: name}})
        services = [...services, ...r.map((e: { id: any }) => e.id)]
      }
      const service_ids = [...new Set(services)]
      if (service_ids.length === 0) {
        CliUx.ux.action.stop(chalk.bold.red('none found'))
        this.error('No services found. Please check your search.', {exit: 1})
      }
      data.filters.service_ids = service_ids
    }

    if (flags.since) {
      const since = chrono.parseDate(flags.since)
      if (since) {
        data.filters.created_at_start = since.toISOString()
      }
    }
    if (flags.until) {
      const until = chrono.parseDate(flags.until)
      if (until) {
        data.filters.created_at_end = until.toISOString()
      }
    }

    const analytics = await this.pd.fetchWithSpinner('analytics/raw/incidents', {
      params: {limit: 1000},
      headers: headers,
      method: 'post',
      data: data,
      activityDescription: 'Getting analytics',
    })

    if (analytics.length === 0) {
      this.error('No analytics found', {exit: 0})
    }

    if (flags.json) {
      await utils.printJsonAndExit(analytics)
    }

    const columns: Record<string, object> = {
      id: {
        header: 'ID',
      },
      incident_number: {
        header: '#',
      },
      urgency: {
        get: (row: { urgency: string }) => {
          if (row.urgency === 'high') {
            return chalk.bold(row.urgency)
          }
          return row.urgency
        },
      },
      priority: {
        get: (row: { priority_name: string }) => row.priority_name ? row.priority_name : '',
      },
      description: {
      },
      created: {
        get: (row: { created_at: string }) => (new Date(row.created_at)).toLocaleString(),
      },
      resolved: {
        get: (row: { resolved_at: string }) => row.resolved_at ? (new Date(row.resolved_at)).toLocaleString() : '',
      },
      seconds_to_engage: {
        header: 'Sec to engage',
        get: (row: { seconds_to_engage: string }) => row.seconds_to_engage === null ? '' : row.seconds_to_engage,
      },
      seconds_to_first_ack: {
        header: 'Sec to ack',
        get: (row: { seconds_to_first_ack: string }) => row.seconds_to_first_ack === null ? '' : row.seconds_to_first_ack,
      },
      seconds_to_mobilize: {
        header: 'Sec to mobilize',
        get: (row: { seconds_to_mobilize: string }) => row.seconds_to_mobilize === null ? '' : row.seconds_to_mobilize,
      },
      seconds_to_resolve: {
        header: 'Sec to resolve',
        get: (row: { seconds_to_resolve: string }) => row.seconds_to_resolve === null ? '' : row.seconds_to_resolve,
      },
      service_name: {
      },
    }

    if (flags.keys) {
      for (const key of flags.keys) {
        columns[key] = {
          header: key,
          get: (row: any) => utils.formatField(jp.query(row, key), flags.delimiter),
        }
      }
    }

    const options = {
      ...flags, // parsed flags
    }

    CliUx.ux.table(analytics, columns, options)
  }
}
