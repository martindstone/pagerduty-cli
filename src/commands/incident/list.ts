import {Command, flags} from '@oclif/command'
import * as chalk from 'chalk'
import cli from 'cli-ux'
import * as pd from '../../pd'
import * as config from '../../config'
import * as moment from 'moment'
// import { setFlagsFromString } from 'v8'

export default class IncidentList extends Command {
  static description = 'List PagerDuty Incidents'

  static flags = {
    help: flags.help({char: 'h'}),
    me: flags.boolean({
      char: 'm',
      description: 'Return only incidents assigned to me',
      exclusive: ['assignees'],
    }),
    statuses: flags.string({
      char: 's',
      description: 'Return only incidents with the given statuses. Specify multiple times for multiple statuses.',
      multiple: true,
      options: ['triggered', 'acknowledged', 'resolved'],
      default: ['triggered', 'acknowledged', 'resolved']
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
      multiple: true
    }),
    services: flags.string({
      char: 'S',
      description: 'Service names to include. Specify multiple times for multiple services.',
      multiple: true
    }),
    urgencies: flags.string({
      char: 'u',
      description: 'Urgencies to include.',
      multiple: true,
      options: ['high', 'low'],
      default: ['high', 'low'],
    }),
    json: flags.boolean({
      char: 'j',
      description: 'output full details as JSON',
      exclusive: ['columns', 'filter', 'sort', 'csv', 'extended']
    }),
    ...cli.table.flags(),
  }

  async run() {
    const {flags} = this.parse(IncidentList)

    const token = config.getAuth() as string

    if ( !token ) {
      this.error('No auth token found', {exit: 1, suggestions: ['pd auth:web', 'pd auth:set']})
    }

    if ( !pd.isValidToken(token) ) {
      this.error(`Token '${token}' is not valid`, {exit: 1, suggestions: ['pd auth:web', 'pd auth:set']})
    }

    const params: Record<string, any> = {
      statuses: flags.statuses,
    }

    if (flags.me) {
      const me = await pd.me(token)
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
      const users_raw = await Promise.all(promises)
      const users = [].concat.apply([], users_raw)
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
      const teams = [].concat.apply([], teams_raw)
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
      const services = [].concat.apply([], services_raw)
      const service_ids = services.map(e => e.id)
      if (service_ids.length === 0) {
        cli.action.stop(chalk.bold.red('none found'))
        this.error('No services found. Please check your search.', {exit: 1})
      }
      cli.action.stop(`got ${services.length}: ${chalk.bold.blue(service_ids.join(', '))}`)
      params.service_ids = service_ids
    }
    cli.action.start('Getting incidents from PD')
    const incidents = await pd.fetch(token, '/incidents', params)
    if (incidents.length === 0) {
      cli.action.stop(chalk.bold.red('none found'))
      return
    }
    cli.action.stop(`got ${incidents.length}`)
    if (flags.json) {
      this.log(JSON.stringify(incidents, null, 2))
      return
    }
    const columns = {
      id: {
        header: 'ID',
      },
      incident_number: {
        header: '#',
      },
      status: {
      },
      priority: {
        get: row => {
          if (row.priority && row.priority.summary) {
            return row.priority.summary
          }
          return '--'
        }
      },
      urgency: {
      },
      title: {
      },
      created: {
        get: row => (new Date(row.created_at)).toLocaleString()
      },
      service: {
        get: row => row.service.summary
      },
      assigned_to: {
        get: row => {
          if (row.assignments && row.assignments.length > 0) {
            return row.assignments.map(e => e.assignee.summary).join(', ')
          }
          return '--'
        }
      },
      teams: {
        get: row => {
          if (row.teams && row.teams.length > 0) {
            return row.teams.map(e => e.summary).join(', ')
          }
          return '--'
        }
      },
      html_url: {
        header: 'URL',
        extended: true,
      }
    }
    const options = {
      printLine: this.log,
      ...flags, // parsed flags
    }
    cli.table(incidents, columns, options)
  }
}
