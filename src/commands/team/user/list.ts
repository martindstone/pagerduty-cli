import { AuthenticatedBaseCommand } from '../../../base/authenticated-base-command'
import { CliUx, Flags } from '@oclif/core'
import chalk from 'chalk'
import * as utils from '../../../utils'

export default class TeamUserList extends AuthenticatedBaseCommand<typeof TeamUserList> {
  static description = 'List PagerDuty Team Members'

  static flags = {
    name: Flags.string({
      char: 'n',
      description: 'Select teams whose names contain the given text',
    }),
    ids: Flags.string({
      char: 'i',
      description: 'The IDs of teams to list members for.',
      exclusive: ['name'],
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
      description: 'Print user ID\'s only to stdout, for use with pipes.',
      exclusive: ['columns', 'sort', 'csv', 'extended', 'json'],
    }),
    delimiter: Flags.string({
      char: 'd',
      description: 'Delimiter for fields that have more than one value',
      default: '\\n',
    }),
    ...CliUx.ux.table.flags(),
  }

  public async init(): Promise<void> {
    await super.init()
    if (this.flags.delimiter === '\\n') {
      this.flags.delimiter = '\n'
    }
    if (this.flags.keys) {
      this.flags.keys = this.flags.keys.map(x => x.split(/,\s*/)).flat().filter(x => x)
    }
  }

  async run() {
    let team_ids = []
    if (this.flags.name) {
      CliUx.ux.action.start('Finding teams in PD')
      const teams = await this.pd.fetch('teams', { params: { query: this.flags.name } })
      if (teams.length === 0) {
        CliUx.ux.action.stop(chalk.bold.red('no teams found matching ') + chalk.bold.blue(this.flags.name))
        this.exit(0)
      }
      for (const team of teams) {
        team_ids.push(team.id)
      }
    } else if (this.flags.ids) {
      const invalid_ids = utils.invalidPagerDutyIDs(this.flags.ids)
      if (invalid_ids.length > 0) {
        this.error(`Invalid team IDs ${chalk.bold.blue(invalid_ids.join(', '))}`, { exit: 1 })
      }
      team_ids = this.flags.ids
    } else {
      this.error('You must specify one of: -i, -n', { exit: 1 })
    }

    if (team_ids.length === 0) {
      CliUx.ux.action.stop(chalk.bold.red('no teams specified'))
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
        m.team = { id: team_id }
      }
      members = [...members, ...r]
    }
    CliUx.ux.action.stop(chalk.bold.green('done'))

    if (this.flags.json) {
      await this.printJsonAndExit(members)
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

    if (this.flags.pipe) {
      members = members.map(x => ({id: x.user.id}))
    }

    this.printTable(members, columns, this.flags)
  }
}
