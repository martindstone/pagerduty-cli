import Command from '../../base'
import {flags} from '@oclif/command'
import cli from 'cli-ux'
import chalk from 'chalk'
import getStream from 'get-stream'
import * as utils from '../../utils'

export default class TeamOpen extends Command {
  static description = 'Open PagerDuty Teams in the browser'

  static flags = {
    ...Command.flags,
    name: flags.string({
      char: 'n',
      description: 'Open teams matching this string.',
      exclusive: ['ids', 'pipe'],
    }),
    ids: flags.string({
      char: 'i',
      description: 'The IDs of teams to open.',
      exclusive: ['name', 'pipe'],
      multiple: true,
    }),
    pipe: flags.boolean({
      char: 'p',
      description: 'Read team ID\'s from stdin.',
      exclusive: ['ids', 'name'],
    }),
  }

  async run() {
    const {flags} = this.parse(TeamOpen)

    const params: Record<string, any> = {}

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
    } else if (flags.pipe) {
      const str: string = await getStream(process.stdin)
      team_ids = utils.splitDedupAndFlatten([str])
    } else {
      this.error('You must specify one of: -i, -n, -p', {exit: 1})
    }
    if (team_ids.length === 0) {
      cli.action.stop(chalk.bold.red('no teams specified'))
      this.exit(0)
    }
    cli.action.start('Finding your PD domain')
    const domain = await this.pd.domain()

    cli.action.start('Opening your browser')
    try {
      for (const team_id of team_ids) {
        cli.open(`https://${domain}.pagerduty.com/teams/${team_id}`)
      }
    } catch (error) {
      cli.action.stop(chalk.bold.red('failed!'))
      this.error('Couldn\'t open browser. Are you running as root?', {exit: 1})
    }
    cli.action.stop(chalk.bold.green('done'))
  }
}
