import { ListBaseCommand } from '../../base/list-base-command'
import { Flags, CliUx } from '@oclif/core'
import chalk from 'chalk'
import * as chrono from 'chrono-node'
import { PD } from '../../pd'

export default class IncidentList extends ListBaseCommand<typeof IncidentList> {
  static pdObjectName = 'incident'
  static pdObjectNamePlural = 'incidents'
  static description = 'List PagerDuty Incidents'

  static flags = {
    me: Flags.boolean({
      char: 'm',
      description: 'Return incidents assigned to me',
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
      description: 'Return incidents assigned to PD accounts whose login emails contain this text. Specify multiple times for multiple assignee filters.',
      multiple: true,
      exclusive: ['me'],
    }),
    exact_assignees: Flags.string({
      char: 'E',
      description: 'Return incidents assigned to the PD account whose login email is exactly this text. Specify multiple times for multiple assignees.',
      multiple: true,
      exclusive: ['me'],
    }),
    teams: Flags.string({
      char: 't',
      description: 'Return incidents belonging to teams whose names contain this text. Specify multiple times for multiple team filters.',
      multiple: true,
    }),
    exact_teams: Flags.string({
      char: 'T',
      description: 'Return incidents belonging to the team whose name is exactly this text. Specify multiple times for multiple teams.',
      multiple: true,
    }),
    services: Flags.string({
      char: 'S',
      description: 'Return incidents in services whose names contain this text. Specify multiple times for multiple service filters.',
      multiple: true,
    }),
    exact_services: Flags.string({
      char: 'X',
      description: 'Return incidents in the service whose name is exactly this text. Specify multiple times for multiple services.',
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
      this.error('You are looking for resolved incidents with assignees. PagerDuty incidents that are resolved are not considered to have any assignees, so this will never return any incidents.', { exit: 1 })
    }

    if (this.flags.urgencies) {
      params.urgencies = this.flags.urgencies
    }

    const user_ids: string[] = []

    if (this.flags.me) {
      const me = await this.me(true)
      if (!me) {
        this.error('You specified -m but you are using a Legacy API token which does not belong to any PD user', { exit: 1 })
      }
      user_ids.push(me.user.id)
    }

    if (this.flags.assignees) {
      CliUx.ux.action.start('Finding users')
      for (const email of this.flags.assignees) {
        // eslint-disable-next-line no-await-in-loop
        const r = await this.pd.fetch('users', { params: { query: email } })
        if (r.length === 0) {
          this.warn(`No users found for filter ${chalk.bold.blue(email)}`)
        } else {
          user_ids.push(...r.map((e: { id: string }) => e.id))
        }
      }
    }

    if (this.flags.exact_assignees) {
      CliUx.ux.action.start('Finding users')
      for (const email of this.flags.exact_assignees) {
        // eslint-disable-next-line no-await-in-loop
        const r = await this.pd.userIDForEmail(email)
        if (r) {
          user_ids.push(r)
        } else {
          this.warn(`No user found for email ${chalk.bold.blue(email)}`)
        }
      }
    }

    if (this.flags.me || this.flags.assignees || this.flags.exact_assignees) {
      if (user_ids.length === 0) {
        this.error('No users were found.', { exit: 1 })
      }
      params.user_ids = [...new Set(user_ids)]
    }

    const team_ids: string[] = []

    if (this.flags.teams) {
      CliUx.ux.action.start('Finding teams')
      for (const name of this.flags.teams) {
        // eslint-disable-next-line no-await-in-loop
        const r = await this.pd.fetch('teams', { params: { query: name } })
        if (r.length === 0) {
          this.warn(`No teams found for filter ${chalk.bold.blue(name)}`)
        } else {
          team_ids.push(...r.map((e: { id: string }) => e.id))
        }
      }
    }

    if (this.flags.exact_teams) {
      CliUx.ux.action.start('Finding teams')
      for (const name of this.flags.exact_teams) {
        // eslint-disable-next-line no-await-in-loop
        const r = await this.pd.teamIDForName(name)
        if (r) {
          team_ids.push(r)
        } else {
          this.warn(`No team found for name ${chalk.bold.blue(name)}`)
        }
      }
    }

    if (this.flags.teams || this.flags.exact_teams) {
      if (team_ids.length === 0) {
        this.error('No teams were found.', { exit: 1 })
      }
      params.team_ids = [...new Set(team_ids)]
    }

    const service_ids: string[] = []

    if (this.flags.services) {
      CliUx.ux.action.start('Finding services')
      for (const name of this.flags.services) {
        // eslint-disable-next-line no-await-in-loop
        const r = await this.pd.fetch('services', { params: { query: name } })
        if (r.length === 0) {
          this.warn(`No services found for filter ${chalk.bold.blue(name)}`)
        } else {
          service_ids.push(...r.map((e: { id: string }) => e.id))
        }
      }
    }

    if (this.flags.exact_services) {
      CliUx.ux.action.start('Finding services')
      for (const name of this.flags.exact_services) {
        // eslint-disable-next-line no-await-in-loop
        const r = await this.pd.serviceIDForName(name)
        if (r) {
          service_ids.push(r)
        } else {
          this.warn(`No service found for name ${chalk.bold.blue(name)}`)
        }
      }
    }

    if (this.flags.services || this.flags.exact_services) {
      if (service_ids.length === 0) {
        this.error('No services were found.', { exit: 1 })
      }
      params.service_ids = [...new Set(service_ids)]
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
      this.error('No incidents found', { exit: 0 })
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
        this.error('Error getting incident notes', { exit: 1 })
      }
      for (const [i, notes] of noteses.entries()) {
        incidents[i].notes = notes.notes
      }
    }

    if (this.flags.json) {
      await this.printJsonAndExit(incidents)
    }

    const columns: Record<string, object> = {
      id: {
        header: 'ID',
      },
      incident_number: {
        header: '#',
      },
      status: {
        get: (row: { status: string }) => {
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
        get: (row: { service: { summary: string } }) => row.service.summary,
      },
      assigned_to: {
        get: (row: { assignments: any[] }) => {
          if (row.assignments && row.assignments.length > 0) {
            return row.assignments.map(e => e.assignee.summary).join(this.flags.delimiter)
          }
          return ''
        },
      },
      teams: {
        get: (row: { teams: any[] }) => {
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

    this.printTable(incidents, columns, this.flags)
  }
}
