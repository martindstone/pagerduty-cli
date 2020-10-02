/* eslint-disable complexity */
import Command from '../../base'
import {flags} from '@oclif/command'
import chalk from 'chalk'
import cli from 'cli-ux'
import * as pd from '../../pd'
import * as utils from '../../utils'
import dotProp from 'dot-prop'
import * as chrono from 'chrono-node'

export default class IncidentList extends Command {
  static description = 'List PagerDuty Incidents'

  static flags = {
    ...Command.flags,
    me: flags.boolean({
      char: 'm',
      description: 'Return only incidents assigned to me',
      exclusive: ['assignees'],
    }),
    statuses: flags.string({
      char: 's',
      description: 'Return only incidents with the given statuses. Specify multiple times for multiple statuses.',
      multiple: true,
      options: ['open', 'closed', 'triggered', 'acknowledged', 'resolved'],
      default: ['open'],
    }),
    assignees: flags.string({
      char: 'e',
      description: 'Return only incidents assigned to this PD login email. Specify multiple times for multiple assignees.',
      multiple: true,
      exclusive: ['me'],
    }),
    teams: flags.string({
      char: 't',
      description: 'Team names to include. Specify multiple times for multiple teams.',
      multiple: true,
    }),
    services: flags.string({
      char: 'S',
      description: 'Service names to include. Specify multiple times for multiple services.',
      multiple: true,
    }),
    urgencies: flags.string({
      char: 'u',
      description: 'Urgencies to include.',
      multiple: true,
      options: ['high', 'low'],
      default: ['high', 'low'],
    }),
    since: flags.string({
      description: 'The start of the date range over which you want to search.',
    }),
    until: flags.string({
      description: 'The end of the date range over which you want to search.',
    }),
    keys: flags.string({
      char: 'k',
      description: 'Additional fields to display. Specify multiple times for multiple fields.',
      multiple: true,
    }),
    json: flags.boolean({
      char: 'j',
      description: 'output full details as JSON',
      exclusive: ['columns', 'filter', 'sort', 'csv', 'extended'],
    }),
    pipe: flags.boolean({
      char: 'p',
      description: 'Print incident ID\'s only to stdin, for use with pipes.',
      exclusive: ['columns', 'filter', 'sort', 'csv', 'extended', 'json', 'keys'],
    }),
    ...cli.table.flags(),
  }

  async run() {
    const {flags} = this.parse(IncidentList)

    // get a validated token from base class
    const token = this.token as string

    const statuses = [...new Set(flags.statuses)]
    if (statuses.indexOf('open') >= 0) {
      statuses.splice(statuses.indexOf('open'), 1, 'triggered', 'acknowledged')
    }
    if (statuses.indexOf('closed') >= 0) {
      statuses.splice(statuses.indexOf('closed'), 1, 'resolved')
    }
    const params: Record<string, any> = {
      statuses: [...new Set(statuses)],
    }

    if (flags.me) {
      const me = await pd.me(token)
      if (!me) {
        this.error('You can\'t use --me with a legacy API token.', {
          exit: 1,
          suggestions: ['pd auth:set', 'pd auth:web'],
        })
      }
      params.user_ids = [me.user.id]
    }

    if (flags.urgencies) {
      params.urgencies = flags.urgencies
    }

    if (flags.assignees) {
      cli.action.start('Finding users')
      const promises: any[] = []
      flags.assignees.forEach(email => {
        promises.push(pd.fetch(token, '/users', {query: email}))
      })
      const users_raw: any[] = await Promise.all(promises)
      // eslint-disable-next-line prefer-spread
      const users = users_raw.flat()
      const user_ids = users.map(e => e.id)
      if (user_ids.length === 0) {
        cli.action.stop(chalk.bold.red('none found'))
        this.error('No assignee user IDs found. Please check your search.', {exit: 1})
      }
      cli.action.stop(`got ${users.length}: ${chalk.bold.blue(user_ids.join(', '))}`)
      params.user_ids = user_ids
    }

    if (flags.teams) {
      cli.action.start('Finding teams')
      const promises: any[] = []
      flags.teams.forEach(team => {
        promises.push(pd.fetch(token, '/teams', {query: team}))
      })
      const teams_raw = await Promise.all(promises)
      const teams = teams_raw.flat()
      const team_ids = teams.map(e => e.id)
      if (team_ids.length === 0) {
        cli.action.stop(chalk.bold.red('none found'))
        this.error('No teams found. Please check your search.', {exit: 1})
      }
      cli.action.stop(`got ${teams.length}: ${chalk.bold.blue(team_ids.join(', '))}`)
      params.team_ids = team_ids
    }

    if (flags.services) {
      cli.action.start('Finding services')
      const promises: any[] = []
      flags.services.forEach(team => {
        promises.push(pd.fetch(token, '/services', {query: team}))
      })
      const services_raw = await Promise.all(promises)
      const services = services_raw.flat()
      const service_ids = services.map(e => e.id)
      if (service_ids.length === 0) {
        cli.action.stop(chalk.bold.red('none found'))
        this.error('No services found. Please check your search.', {exit: 1})
      }
      cli.action.stop(`got ${services.length}: ${chalk.bold.blue(service_ids.join(', '))}`)
      params.service_ids = service_ids
    }

    if (flags.since) {
      const since = chrono.parseDate(flags.since)
      if (since) {
        params.since = since.toISOString()
      }
    }
    if (flags.until) {
      const until = chrono.parseDate(flags.until)
      if (until) {
        params.until = until.toISOString()
      }
    }

    cli.action.start('Getting incident priorities from PD')
    const priorities = await pd.fetch(token, '/priorities')
    const priorities_map: Record<string, any> = {}
    for (const priority of priorities) {
      priorities_map[priority.id] = priority
    }
    cli.action.start('Getting incidents from PD')
    const incidents = await pd.fetch(token, '/incidents', params)
    if (incidents.length === 0) {
      cli.action.stop(chalk.bold.red('none found'))
      this.exit(0)
    }
    cli.action.stop(`got ${incidents.length}`)
    if (flags.json) {
      this.log(JSON.stringify(incidents, null, 2))
      this.exit(0)
    } else if (flags.pipe) {
      this.log(incidents.map((e: { id: any }) => e.id).join('\n'))
      this.exit(0)
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
          return '--'
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
            return row.assignments.map(e => e.assignee.summary).join(', ')
          }
          return '--'
        },
      },
      teams: {
        get: (row: {teams: any[]}) => {
          if (row.teams && row.teams.length > 0) {
            return row.teams.map(e => e.summary).join(', ')
          }
          return '--'
        },
      },
      html_url: {
        header: 'URL',
        extended: true,
      },
    }

    if (flags.keys) {
      for (const key of flags.keys) {
        columns[key] = {
          header: key,
          get: (row: any) => utils.formatField(dotProp.get(row, key)),
        }
      }
    }

    const options = {
      printLine: this.log,
      ...flags, // parsed flags
    }
    cli.table(incidents, columns, options)
  }
}
