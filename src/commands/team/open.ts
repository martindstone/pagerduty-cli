import { AuthenticatedBaseCommand } from '../../base/authenticated-base-command'
import { CliUx, Flags } from '@oclif/core'
import chalk from 'chalk'
import getStream from 'get-stream'
import * as utils from '../../utils'

export default class TeamOpen extends AuthenticatedBaseCommand<typeof TeamOpen> {
  static description = 'Open PagerDuty Teams in the browser'

  static flags = {
    name: Flags.string({
      char: 'n',
      description: 'Open teams matching this string.',
      exclusive: ['ids', 'pipe'],
    }),
    ids: Flags.string({
      char: 'i',
      description: 'The IDs of teams to open.',
      exclusive: ['name', 'pipe'],
      multiple: true,
    }),
    pipe: Flags.boolean({
      char: 'p',
      description: 'Read team ID\'s from stdin.',
      exclusive: ['ids', 'name'],
    }),
  }

  async run() {
    const params: Record<string, any> = {}

    let team_ids = []
    if (this.flags.name) {
      params.query = this.flags.name
      CliUx.ux.action.start('Finding teams in PD')
      const teams = await this.pd.fetch('teams', { params: params })
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
    } else if (this.flags.pipe) {
      const str: string = await getStream(process.stdin)
      team_ids = utils.splitDedupAndFlatten([str])
    } else {
      this.error('You must specify one of: -i, -n, -p', { exit: 1 })
    }
    if (team_ids.length === 0) {
      CliUx.ux.action.stop(chalk.bold.red('no teams specified'))
      this.exit(0)
    }
    CliUx.ux.action.start('Finding your PD domain')
    const domain = await this.pd.domain()

    this.log('Team URLs:')
    const urlstrings: string[] = team_ids.map(x => chalk.bold.blue(`https://${domain}.pagerduty.com/teams/${x}`))
    this.log(urlstrings.join('\n') + '\n')

    CliUx.ux.action.start('Opening your browser')
    try {
      for (const team_id of team_ids) {
        await CliUx.ux.open(`https://${domain}.pagerduty.com/teams/${team_id}`)
      }
    } catch (error) {
      CliUx.ux.action.stop(chalk.bold.red('failed!'))
      this.error('Couldn\'t open browser. Are you running as root?', { exit: 1 })
    }
    CliUx.ux.action.stop(chalk.bold.green('done'))
  }
}
