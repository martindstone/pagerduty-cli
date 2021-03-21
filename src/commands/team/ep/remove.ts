/* eslint-disable complexity */
import Command from '../../../base'
import {flags} from '@oclif/command'
import cli from 'cli-ux'
import chalk from 'chalk'
import * as utils from '../../../utils'
import {PD} from '../../../pd'

export default class TeamEpRemove extends Command {
  static description = 'Remove PagerDuty escalation policies from Teams.'

  static flags = {
    ...Command.flags,
    name: flags.string({
      char: 'n',
      description: 'Select teams whose names contain the given text',
    }),
    ids: flags.string({
      char: 'i',
      description: 'The IDs of teams to remove escalation policies from.',
      exclusive: ['name', 'pipe'],
      multiple: true,
    }),
    ep_ids: flags.string({
      char: 'e',
      description: 'Remove an escalation policy with this ID. Specify multiple times for multiple escalation policies.',
      multiple: true,
    }),
    ep_names: flags.string({
      char: 'E',
      description: 'Remove an escalation policy with this name. Specify multiple times for multiple escalation policies.',
      multiple: true,
    }),
  }

  async run() {
    const {flags} = this.parse(TeamEpRemove)

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

    let ep_ids: string[] = []
    if (flags.ep_ids) {
      ep_ids = [...ep_ids, ...flags.ep_ids]
    }
    if (flags.ep_names) {
      for (const name of flags.ep_names) {
        // eslint-disable-next-line no-await-in-loop
        const ep_id = await this.pd.epIDForName(name)
        if (ep_id === null) {
          this.error(`No escalation policy was found with the name ${chalk.bold.blue(name)}`, {exit: 1})
        } else {
          ep_ids.push(ep_id)
        }
      }
    }
    ep_ids = [...new Set(ep_ids)]

    const invalid_ids = utils.invalidPagerDutyIDs(ep_ids)
    if (invalid_ids && invalid_ids.length > 0) {
      this.error(`Invalid escalation policy ID's: ${invalid_ids.join(', ')}`, {exit: 1})
    }

    if (ep_ids.length === 0) {
      this.error('No escalation policies specified. Please specify some EPs using -e, -E')
    }

    const requests: PD.Request[] = []

    for (const team_id of team_ids) {
      for (const ep_id of ep_ids) {
        requests.push({
          endpoint: `teams/${team_id}/escalation_policies/${ep_id}`,
          method: 'DELETE',
        })
      }
    }

    const r = await this.pd.batchedRequestWithSpinner(requests, {
      activityDescription: `Removing ${ep_ids.length} escalation policies from ${team_ids.length} teams`,
    })
    for (const failure of r.getFailedIndices()) {
      const f = requests[failure] as any
      const [, team_id, , ep_id] = f.endpoint.split('/')
      // eslint-disable-next-line no-console
      console.error(`${chalk.bold.red('Failed to remove EP ')}${chalk.bold.blue(ep_id)}${chalk.bold.red(' from team ')}${chalk.bold.blue(team_id)}: ${r.results[failure].getFormattedError()}`)
    }
  }
}
