import Command from '../../base'
import {CliUx, Flags} from '@oclif/core'
import * as utils from '../../utils'
import jp from 'jsonpath'

export default class ScheduleList extends Command {
  static description = 'List PagerDuty Schedules'

  static flags = {
    ...Command.flags,
    ...Command.listCommandFlags,
    name: Flags.string({
      char: 'n',
      description: 'Select schedules whose names contain the given text',
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
      description: 'Print schedule ID\'s only to stdout, for use with pipes.',
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
    const {flags} = await this.parse(ScheduleList)

    const params: Record<string, any> = {}

    if (flags.name) {
      params.query = flags.name
    }

    const schedules = await this.pd.fetchWithSpinner('schedules', {
      params: params,
      activityDescription: 'Getting schedules from PD',
      fetchLimit: flags.limit,
    })
    if (schedules.length === 0) {
      this.error('No schedules found.', {exit: 1})
    }

    if (flags.json) {
      await utils.printJsonAndExit(schedules)
    }

    const columns: Record<string, object> = {
      id: {
        header: 'ID',
      },
      name: {
        header: 'Name',
      },
      users: {
        get: (row: { users: any[] }) => row.users.map((e: any) => e.summary).join(flags.delimiter),
      },
      escalation_policies: {
        get: (row: { escalation_policies: any[] }) => row.escalation_policies.map((e: any) => e.summary).join(flags.delimiter),
      },
      team_names: {
        get: (row: { teams: any[] }) => row.teams.map((e: any) => e.summary).join(flags.delimiter),
        extended: true,
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
    CliUx.ux.table(schedules, columns, options)
  }
}
