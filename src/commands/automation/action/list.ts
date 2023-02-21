import { ListBaseCommand } from '../../../base/list-base-command'

export default class AutomationActionList extends ListBaseCommand<typeof AutomationActionList> {
  static pdObjectName = 'automation action'
  static pdObjectNamePlural = 'automation actions'
  static description = 'List PagerDuty Automation Actions'

  async run() {
    const params: Record<string, any> = {}

    if (this.flags.name) {
      params.name = this.flags.name
    }

    const runners = await this.pd.fetchWithSpinner('automation_actions/runners', {
      params: {},
      activityDescription: 'Getting runners',
      stopSpinnerWhenDone: false,
    })

    const runnersDict = Object.assign({}, ...runners.map(runner => ({ [runner.id]: runner })))

    const actions = await this.pd.fetchWithSpinner('automation_actions/actions', {
      params: params,
      activityDescription: 'Getting automation actions',
      fetchLimit: this.flags.limit,
    })

    if (actions.length === 0) {
      this.error('No actions found. Please check your search.', { exit: 1 })
    }

    if (this.flags.json) {
      await this.printJsonAndExit(actions)
    }

    const columns: Record<string, object> = {
      id: {
        header: 'ID',
      },
      name: {
      },
      description: {
        extended: true,
      },
      created_at: {
        get: (row: { creation_time: string }) => (new Date(row.creation_time)).toLocaleString(),
        extended: true,
      },
      last_run: {
        get: (row: { last_run: string }) => row.last_run ? (new Date(row.last_run)).toLocaleString() : '',
      },
      last_modified: {
        get: (row: { modify_time: string }) => (new Date(row.modify_time)).toLocaleString(),
        extended: true,
      },
      type: {
        get: (row: { action_type: string }) => row.action_type,
      },
      category: {
        get: (row: { action_classification: string }) => row.action_classification ? row.action_classification : '',
      },
      runner_id: {
        get: (row: { runner: string }) => row.runner
      },
      runner_name: {
        get: (row: { runner: string }) => runnersDict[row.runner].name,
      },
    }

    const options = {
      ...this.flags, // parsed flags
    }

    this.printTable(actions, columns, this.flags)
  }
}
