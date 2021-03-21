import Command from '../../../base'
import {flags} from '@oclif/command'
import cli from 'cli-ux'
import chalk from 'chalk'
import * as utils from '../../../utils'
import jp from 'jsonpath'

export default class TeamUserList extends Command {
  static description = 'List PagerDuty Team Members'

  static flags = {
    ...Command.flags,
    name: flags.string({
      char: 'n',
      description: 'Select teams whose names contain the given text',
    }),
    ids: flags.string({
      char: 'i',
      description: 'The IDs of teams to list members for.',
      exclusive: ['name', 'pipe'],
      multiple: true,
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
    delimiter: flags.string({
      char: 'd',
      description: 'Delimiter for fields that have more than one value',
      default: '\n',
    }),
    ...cli.table.flags(),
  }

  async run() {
    const {flags} = this.parse(TeamUserList)

    const params: Record<string, any> = {}

    if (flags.name) {
      params.query = flags.name
    }

    let team_ids = []
    if (flags.name) {
      params.query = flags.name
      cli.action.start('Finding teams in PD')
      const teams = await this.pd.fetch('teams', {params: params})
      if (teams.length === 0) {
        cli.action.stop(chalk.bold.red('no teams found matching ') + chalk.bold.blue(flags.name))
        this.exit(0)
      }
      for (const team of teams) {
        team_ids.push(team.id)
      }
    } else if (flags.ids) {
      const invalid_ids = utils.invalidPagerDutyIDs(flags.ids)
      if (invalid_ids.length > 0) {
        this.error(`Invalid team IDs ${chalk.bold.blue(invalid_ids.join(', '))}`, {exit: 1})
      }
      team_ids = flags.ids
    } else {
      this.error('You must specify one of: -i, -n', {exit: 1})
    }

    if (team_ids.length === 0) {
      cli.action.stop(chalk.bold.red('no teams specified'))
      this.exit(0)
    }

    let members: any[] = []
    for (const team_id of team_ids) {
      // eslint-disable-next-line no-await-in-loop
      const r = await this.pd.fetchWithSpinner(`teams/${team_id}/members`, {
        activityDescription: `Getting members of team ${chalk.bold.blue(team_id)}`,
        stopSpinnerWhenDone: false,
      })
      for (const m of r) {
        m.team = {id: team_id}
      }
      members = [...members, ...r]
    }
    cli.action.stop(chalk.bold.green('done'))

    if (flags.json) {
      await utils.printJsonAndExit(members)
    }

    const columns: Record<string, object> = {
      team_id: {
        header: 'Team ID',
        get: (row: any) => row.team.id,
      },
      user_id: {
        header: 'User ID',
        get: (row: any) => row.user.id,
      },
      user_name: {
        header: 'User Name',
        get: (row: any) => row.user.summary,
      },
      role: {
        get: (row: any) => row.role,
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
    cli.table(members, columns, options)
  }
}
