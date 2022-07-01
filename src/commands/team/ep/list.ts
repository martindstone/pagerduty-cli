import Command from '../../../base'
import {CliUx, Flags} from '@oclif/core'
import chalk from 'chalk'
import * as utils from '../../../utils'
import jp from 'jsonpath'

export default class TeamEpList extends Command {
  static description = 'List the Escalation Policies for a PagerDuty Team'

  static flags = {
    ...Command.flags,
    name: Flags.string({
      char: 'n',
      description: 'Select teams whose names contain the given text',
    }),
    ids: Flags.string({
      char: 'i',
      description: 'The IDs of teams to list escalation policies for.',
      exclusive: ['name', 'pipe'],
      multiple: true,
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
      description: 'Print escalation policy ID\'s only to stdout, for use with pipes.',
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
    const {flags} = await this.parse(TeamEpList)

    const params: Record<string, any> = {}

    if (flags.name) {
      params.query = flags.name
    }

    let team_ids = []
    if (flags.name) {
      params.query = flags.name
      CliUx.ux.action.start('Finding teams in PD')
      const teams = await this.pd.fetch('teams', {params: params})
      if (teams.length === 0) {
        CliUx.ux.action.stop(chalk.bold.red('no teams found matching ') + chalk.bold.blue(flags.name))
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
      CliUx.ux.action.stop(chalk.bold.red('no teams specified'))
      this.exit(0)
    }

    let eps: any[] = []
    for (const team_id of team_ids) {
      // eslint-disable-next-line no-await-in-loop
      const r = await this.pd.fetchWithSpinner(`escalation_policies`, {
        params: {
          team_ids: [team_id],
        },
        activityDescription: `Getting escalation policies of team ${chalk.bold.blue(team_id)}`,
        stopSpinnerWhenDone: false,
      })
      for (const m of r) {
        m.team = {id: team_id}
      }
      eps = [...eps, ...r]
    }
    CliUx.ux.action.stop(chalk.bold.green('done'))

    if (flags.json) {
      await utils.printJsonAndExit(eps)
    }

    const columns: Record<string, object> = {
      team_id: {
        header: 'Team ID',
        get: (row: any) => row.team.id,
      },
      user_id: {
        header: 'Escalation Policy ID',
        get: (row: any) => row.id,
      },
      escalation_policy_name: {
        header: 'Escalation Policy Name',
        get: (row: any) => row.summary,
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
    CliUx.ux.table(eps, columns, options)
  }
}
