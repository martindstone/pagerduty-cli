import { ListBaseCommand } from '../../../base/list-base-command'
import { Flags } from '@oclif/core'
import chalk from 'chalk'
import { PD } from '../../../pd'

export default class AutomationRunnerList extends ListBaseCommand<typeof AutomationRunnerList> {
  static pdObjectName = 'runner'
  static pdObjectNamePlural = 'runners'
  static description = 'List PagerDuty Automation Actions Runners'

  static flags = {
    health: Flags.boolean({
      description: 'Also get runner health info (uses more API requests)'
    }),
  }

  async run() {
    const params: Record<string, any> = {
    }

    if (this.flags.name) {
      params.name = this.flags.name
    }

    const runners = await this.pd.fetchWithSpinner('automation_actions/runners', {
      params: params,
      activityDescription: 'Getting runners',
      fetchLimit: this.flags.limit,
    })
    if (runners.length === 0) {
      this.error('No runners found. Please check your search.', { exit: 1 })
    }

    const healthMap: Record<string, any> = {}
    if (this.flags.health) {
      const health_requests = runners.map(runner => ({
        endpoint: `automation/runners/${runner.id}/health`,
        method: 'GET',
      } as PD.Request))
      const r = await this.pd.batchedRequestWithSpinner(health_requests, {
        activityDescription: 'Getting runner health'
      })
      for (const [i, health] of r.results.entries()) {
        const id = r.requests[i].endpoint.split('/')[2]
        if (health.isFailure) {
          this.warn(`Failed to get health for runner ${chalk.bold.blue(id)}`)
          continue
        }
        healthMap[id] = health.getData()
      }
    }

    if (this.flags.json) {
      this.printJsonAndExit(runners)
    }

    const columns: Record<string, object> = {
      id: {
        header: 'ID',
      },
      runner_type: {
        get: (row: { runner_type: string }) => {
          switch(row.runner_type) {
            case 'sidecar': return 'Process Automation'
            case 'runbook': return 'Runbook Automation'
            default: return ''
          }
        },
      },
      status: {
      },
      name: {
        header: 'Name',
      },
      description: {
        extended: true,
      },
      created_at: {
        get: (row: { creation_time: string }) => (new Date(row.creation_time)).toLocaleString(),
        extended: true,
      },
      last_seen: {
        get: (row: { last_seen: string }) => row.last_seen ? (new Date(row.last_seen)).toLocaleString() : '',
      },
    }

    if (this.flags.health) {
      columns.healthy = {
        get: (row: {id: string}) => healthMap[row.id] ? healthMap[row.id].healthy : '',
        extended: true,
      }
      columns.reason = {
        get: (row: {id: string}) => healthMap[row.id].reason ? healthMap[row.id].reason : '',
        extended: true,
      }
      columns.message = {
        get: (row: {id: string}) => healthMap[row.id].message ? healthMap[row.id].message : '',
      }
    }

    this.printTable(runners, columns, this.flags)
  }
}
