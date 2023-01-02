import { ListBaseCommand } from '../../base/list-base-command'
import {Flags, CliUx} from '@oclif/core'
import chalk from 'chalk'
import * as utils from '../../utils'
import jp from 'jsonpath'
import * as chrono from 'chrono-node'
import {PD} from '../../pd'

export default class IncidentList extends ListBaseCommand<typeof IncidentList> {
  static pdObjectName = 'incident'
  static pdObjectNamePlural = 'incidents'
  static description = 'List PagerDuty Incidents'

  static flags = {
    me: Flags.boolean({
      char: 'm',
      description: 'Return only incidents assigned to me',
      exclusive: ['assignees'],
    }),
    statuses: Flags.string({
      char: 's',
      description: 'Return only incidents with the given statuses. Specify multiple times for multiple statuses.',
      multiple: true,
      options: ['open', 'closed', 'triggered', 'acknowledged', 'resolved'],
      default: ['open'],
    }),
    assignees: Flags.string({
      char: 'e',
      description: 'Return only incidents assigned to this PD login email. Specify multiple times for multiple assignees.',
      multiple: true,
      exclusive: ['me'],
    }),
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
    urgencies: Flags.string({
      char: 'u',
      description: 'Urgencies to include.',
      multiple: true,
      options: ['high', 'low'],
      default: ['high', 'low'],
    }),
    since: Flags.string({
      description: 'The start of the date range over which you want to search.',
    }),
    until: Flags.string({
      description: 'The end of the date range over which you want to search.',
    }),
    notes: Flags.boolean({
      description: 'Also show incident notes (Uses a lot more HTTPS requests!)',
    }),
  }

  async run() {
    const statuses = [...new Set(this.flags.statuses)]
    if (statuses.indexOf('open') >= 0) {
      statuses.splice(statuses.indexOf('open'), 1, 'triggered', 'acknowledged')
    }
    if (statuses.indexOf('closed') >= 0) {
      statuses.splice(statuses.indexOf('closed'), 1, 'resolved')
    }
    const params: Record<string, any> = {
      statuses: [...new Set(statuses)],
    }

    if ((this.flags.me || this.flags.assignees) && statuses.length === 1 && statuses[0] === 'resolved') {
      // looking for assignees on resolved incidents, which will never return anything
      this.error('You are looking for resolved incidents with assignees. PagerDuty incidents that are resolved are not considered to have any assigneed, so this will never return any incidents.', {exit: 1})
    }

    if (this.flags.me) {
      const me = await this.me(true)
      params.user_ids = [me.user.id]
    }

    if (this.flags.urgencies) {
      params.urgencies = this.flags.urgencies
    }

    if (this.flags.assignees) {
      CliUx.ux.action.start('Finding users')
      let users: any[] = []
      for (const email of this.flags.assignees) {
        // eslint-disable-next-line no-await-in-loop
        const r = await this.pd.fetch('users', {params: {query: email}})
        users = [...users, ...r.map((e: { id: any }) => e.id)]
      }
      const user_ids = [...new Set(users)]
      if (user_ids.length === 0) {
        CliUx.ux.action.stop(chalk.bold.red('none found'))
        this.error('No assignee user IDs found. Please check your search.', {exit: 1})
      }
      params.user_ids = user_ids
    }

    if (this.flags.teams) {
      CliUx.ux.action.start('Finding teams')
      let teams: any[] = []
      for (const name of this.flags.teams) {
        // eslint-disable-next-line no-await-in-loop
        const r = await this.pd.fetch('teams', {params: {query: name}})
        teams = [...teams, ...r.map((e: { id: any }) => e.id)]
      }
      const team_ids = [...new Set(teams)]
      if (team_ids.length === 0) {
        CliUx.ux.action.stop(chalk.bold.red('none found'))
        this.error('No teams found. Please check your search.', {exit: 1})
      }
      params.team_ids = team_ids
    }

    if (this.flags.services) {
      CliUx.ux.action.start('Finding services')
      let services: any[] = []
      for (const name of this.flags.services) {
        // eslint-disable-next-line no-await-in-loop
        const r = await this.pd.fetch('services', {params: {query: name}})
        services = [...services, ...r.map((e: { id: any }) => e.id)]
      }
      const service_ids = [...new Set(services)]
      if (service_ids.length === 0) {
        CliUx.ux.action.stop(chalk.bold.red('none found'))
        this.error('No services found. Please check your search.', {exit: 1})
      }
      params.service_ids = service_ids
    }

    if (this.flags.since) {
      const since = chrono.parseDate(this.flags.since)
      if (since) {
        params.since = since.toISOString()
      }
    }
    if (this.flags.until) {
      const until = chrono.parseDate(this.flags.until)
      if (until) {
        params.until = until.toISOString()
      }
    }

    CliUx.ux.action.start('Getting incident priorities from PD')
    const priorities_map = await this.pd.getPrioritiesMapByID()
    if (Object.keys(priorities_map).length === 0) {
      CliUx.ux.action.stop(chalk.bold.red('none found'))
    }

    const incidents = await this.pd.fetchWithSpinner('incidents', {
      params: params,
      activityDescription: 'Getting incidents',
      fetchLimit: this.flags.limit,
    })

    if (incidents.length === 0) {
      this.error('No incidents found', {exit: 0})
    }

    if (this.flags.notes) {
      const notes_requests: PD.Request[] = []
      for (const incident of incidents) {
        notes_requests.push({
          endpoint: `incidents/${incident.id}/notes`,
          method: 'GET',
        })
      }
      const rr = await this.pd.batchedRequestWithSpinner(notes_requests, {
        activityDescription: `Getting notes for ${notes_requests.length} incidents`,
      })
      const noteses = rr.getDatas()
      if (noteses.length !== incidents.length) {
        this.error('Error getting incident notes', {exit: 1})
      }
      for (const [i, notes] of noteses.entries()) {
        incidents[i].notes = notes.notes
      }
    }

    if (this.flags.json) {
      await utils.printJsonAndExit(incidents)
    }

    const columns: Record<string, object> = {
      id: {
        header: 'ID',
      },
      incident_number: {
        header: '#',
      },
      status: {
        get: (row: {status: string}) => {
          switch (row.status) {
          case 'triggered':
            return chalk.bold.red(row.status)
          case 'acknowledged':
            return chalk.bold.keyword('orange')(row.status)
          case 'resolved':
            return chalk.bold.green(row.status)
          default:
            return row.status
          }
        },
      },
      priority: {
        get: (row: { priority: { summary: string; id: string } }) => {
          if (row.priority && row.priority.summary && row.priority.id) {
            if (priorities_map[row.priority.id]) {
              return chalk.bold.hex(priorities_map[row.priority.id].color)(row.priority.summary)
            }
            return row.priority.summary
          }
          return ''
        },
      },
      urgency: {
        get: (row: { urgency: string }) => {
          if (row.urgency === 'high') {
            return chalk.bold(row.urgency)
          }
          return row.urgency
        },
      },
      title: {
      },
      created: {
        get: (row: { created_at: string }) => (new Date(row.created_at)).toLocaleString(),
      },
      service: {
        get: (row: { service: {summary: string}}) => row.service.summary,
      },
      assigned_to: {
        get: (row: {assignments: any[]}) => {
          if (row.assignments && row.assignments.length > 0) {
            return row.assignments.map(e => e.assignee.summary).join(this.flags.delimiter)
          }
          return ''
        },
      },
      teams: {
        get: (row: {teams: any[]}) => {
          if (row.teams && row.teams.length > 0) {
            return row.teams.map(e => e.summary).join(this.flags.delimiter)
          }
          return ''
        },
      },
      html_url: {
        header: 'URL',
        extended: true,
      },
    }

    if (this.flags.notes) {
      columns.notes = {
        header: 'Notes',
        get: (row: any) => {
          const notesArr = row.notes
          const notesTextArr = notesArr.map((x: any) => {
            const friendlyDate = (new Date(x.created_at)).toLocaleString()
            return `${friendlyDate} - ${x.user.summary}: ${x.content}`
          })
          return notesTextArr.join('\n')
        },
      }
    }

    if (this.flags.keys) {
      for (const key of this.flags.keys) {
        columns[key] = {
          header: key,
          get: (row: any) => utils.formatField(jp.query(row, key), this.flags.delimiter),
        }
      }
    }

    const options: any = {
      ...this.flags, // parsed flags
    }

    if (this.flags.pipe) {
      for (const k of Object.keys(columns)) {
        if (k !== 'id') {
          const colAny = columns[k] as any
          colAny.extended = true
        }
      }
      options['no-header'] = true
    }

    CliUx.ux.table(incidents, columns, options)
  }
}
