import Command from '../../base'
import {flags} from '@oclif/command'
import cli from 'cli-ux'
import chalk from 'chalk'
import * as pd from '../../pd'
import * as utils from '../../utils'
import dotProp from 'dot-prop'

export default class ScheduleList extends Command {
  static description = 'List PagerDuty Schedules'

  static flags = {
    ...Command.flags,
    name: flags.string({
      char: 'n',
      description: 'Select schedules whose names contain the given text',
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
      description: 'Print user ID\'s only to stdout, for use with pipes.',
      exclusive: ['columns', 'sort', 'csv', 'extended', 'json'],
    }),
    ...cli.table.flags(),
  }

  async run() {
    const {flags} = this.parse(ScheduleList)

    // get a validated token from base class
    const token = this.token as string

    const params: Record<string, any> = {}

    if (flags.name) {
      params.query = flags.name
    }

    cli.action.start('Getting schedules from PD')
    const r = await pd.fetch(token, '/schedules', params)
    this.dieIfFailed(r)
    const schedules = r.getValue()
    if (schedules.length === 0) {
      cli.action.stop(chalk.bold.red('none found'))
      this.exit(0)
    }
    cli.action.stop(chalk.bold.green(`got ${schedules.length}`))

    if (flags.json) {
      this.log(JSON.stringify(schedules, null, 2))
      this.exit(0)
    }

    const columns: Record<string, object> = {
      id: {
        header: 'ID',
      },
      name: {
        header: 'Name',
      },
      users: {
        get: (row: { users: any[] }) => row.users.map((e: any) => e.summary).join('\n'),
      },
      escalation_policies: {
        get: (row: { escalation_policies: any[] }) => row.escalation_policies.map((e: any) => e.summary).join('\n'),
      },
      team_names: {
        get: (row: { teams: any[] }) => row.teams.map((e: any) => e.summary).join('\n'),
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
    if (flags.pipe) {
      for (const k of Object.keys(columns)) {
        if (k !== 'id') {
          const colAny = columns[k] as any
          colAny.extended = true
        }
      }
      options['no-header'] = true
    }
    cli.table(schedules, columns, options)
  }
}
