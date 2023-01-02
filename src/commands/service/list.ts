import { ListBaseCommand } from '../../base/list-base-command'
import { CliUx, Flags } from '@oclif/core'
import chalk from 'chalk'
import * as utils from '../../utils'
import jp from 'jsonpath'

export default class ServiceList extends ListBaseCommand<typeof ServiceList> {
  static pdObjectName = 'service'
  static pdObjectNamePlural = 'services'
  static description = 'List PagerDuty Services'

  static flags = {
    teams: Flags.string({
      char: 't',
      description: 'Team names to include. Specify multiple times for multiple teams.',
      multiple: true,
    }),
  }

  async run() {
    const params: Record<string, any> = {
      include: ['auto_pause_notifications_parameters']
    }

    if (this.flags.name) {
      params.query = this.flags.name
    }

    if (this.flags.teams) {
      CliUx.ux.action.start('Finding teams')
      let teams: any[] = []
      for (const name of this.flags.teams) {
        // eslint-disable-next-line no-await-in-loop
        const r = await this.pd.fetch('teams', { params: { query: name } })
        teams = [...teams, ...r]
      }
      const team_ids = [...new Set(teams.map(x => x.id))]
      if (team_ids.length === 0) {
        CliUx.ux.action.stop(chalk.bold.red('none found'))
        this.error('No teams found. Please check your search.', { exit: 1 })
      }
      params.team_ids = team_ids
    }

    const services = await this.pd.fetchWithSpinner('services', {
      params: params,
      activityDescription: 'Getting services from PD',
      fetchLimit: this.flags.limit,
    })
    if (services.length === 0) {
      this.error('No services found. Please check your search.', { exit: 1 })
    }

    if (this.flags.json) {
      await utils.printJsonAndExit(services)
    }

    const columns: Record<string, object> = {
      id: {
        header: 'ID',
      },
      status: {
        get: (row: { status: string }) => {
          switch (row.status) {
            case 'active': return chalk.bold.green(row.status)
            case 'disabled':
            case 'maintenance':
              return chalk.dim(row.status)
            case 'warning': return chalk.bold.keyword('orange')(row.status)
            case 'critical': return chalk.bold.red(row.status)
            default: return row.status
          }
        },
      },
      name: {
        header: 'Name',
      },
      ep: {
        header: 'Escalation policy name',
        get: (row: { escalation_policy: { summary: string } }) => row.escalation_policy.summary,
      },
      team_names: {
        get: (row: { teams: any[] }) => {
          if (row.teams && row.teams.length > 0) {
            return row.teams.map(e => e.summary).join(this.flags.delimiter)
          }
          return ''
        },
      },
    }

    if (this.flags.keys) {
      for (const key of this.flags.keys) {
        columns[key] = {
          header: key,
          get: (row: any) => utils.formatField(jp.query(row, key), this.flags.delimiter),
        }
      }
    }

    const options = {
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

    CliUx.ux.table(services, columns, options)
  }
}
