import Command from '../../../base'
import {CliUx, Flags} from '@oclif/core'
import chalk from 'chalk'
import * as utils from '../../../utils'
import jp from 'jsonpath'

export default class AutomationActionList extends Command {
  static description = 'List Available Automation Actions to run on a PagerDuty Incident'

  static flags = {
    ...Command.flags,
    ...Command.listCommandFlags,
    id: Flags.string({
      char: 'i',
      description: 'Incident ID to list actions for.',
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
    pipe: Flags.boolean({
      char: 'p',
      description: 'Print action ID\'s only to stdout, for use with pipes.',
      exclusive: ['columns', 'sort', 'csv', 'extended', 'json'],
    }),
    delimiter: Flags.string({
      char: 'd',
      description: 'Delimiter for fields that have more than one value',
      default: '\n',
    }),
    ...CliUx.ux.table.flags(),
  }

  async run() {
    const {flags} = await this.parse(this.ctor)

    const params: Record<string, any> = {}

    CliUx.ux.action.start(`Getting incident ${chalk.bold.blue(flags.id)}`)
    const r = await this.pd.request({
      endpoint: `incidents/${flags.id}`,
      method: 'GET'
    })
    const incident = r.getData()
    const service_id = incident.incident.service.id

    const runners = await this.pd.fetchWithSpinner('automation/runners', {
      params: {},
      activityDescription: 'Getting runners',
      stopSpinnerWhenDone: false,
    })

    const runnersDict = Object.assign({}, ...runners.map(runner => ({[runner.id]: runner})))

    const actions = await this.pd.fetchWithSpinner(`automation/services/${service_id}/actions`, {
      params: params,
      activityDescription: 'Getting automation actions',
      fetchLimit: flags.limit,
    })

    if (actions.length === 0) {
      this.error('No actions found. Please check your search.', {exit: 1})
    }


    if (flags.json) {
      await utils.printJsonAndExit(runners)
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
        get: (row: {last_run: string}) => (new Date(row.last_run)).toLocaleString(),
      },
      last_modified: {
        get: (row: {modify_time: string}) => (new Date(row.modify_time)).toLocaleString(),
        extended: true,
      },
      type: {
        get: (row: {action_type: string}) => row.action_type,
      },
      category: {
        get: (row: {action_classification: string}) => row.action_classification,
      },
      runner_id: {
        get: (row: {runner: string}) => row.runner
      },
      runner_name: {
        get: (row: {runner: string}) => runnersDict[row.runner].name,
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

    if (flags.pipe) {
      for (const k of Object.keys(columns)) {
        if (k !== 'id') {
          const colAny = columns[k] as any
          colAny.extended = true
        }
      }
      options['no-header'] = true
    }

    CliUx.ux.table(actions, columns, options)
  }
}
