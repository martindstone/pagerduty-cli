import { AuthenticatedBaseCommand } from '../../../base/authenticated-base-command'
import { CliUx, Flags } from '@oclif/core'
import chalk from 'chalk'
import * as utils from '../../../utils'
import { PD } from '../../../pd'

export default class TeamUserRemove extends AuthenticatedBaseCommand<typeof TeamUserRemove> {
  static description = 'Remove PagerDuty users from Teams'

  static flags = {
    name: Flags.string({
      char: 'n',
      description: 'Select teams whose names contain the given text',
    }),
    ids: Flags.string({
      char: 'i',
      description: 'The IDs of teams to remove members from.',
      exclusive: ['name', 'pipe'],
      multiple: true,
    }),
    user_ids: Flags.string({
      char: 'u',
      description: 'Remove a user with this ID. Specify multiple times for multiple users.',
      multiple: true,
    }),
    user_emails: Flags.string({
      char: 'U',
      description: 'Remove a user with this email. Specify multiple times for multiple users.',
      multiple: true,
    }),
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

    let user_ids: string[] = []
    if (this.flags.user_ids) {
      user_ids = [...user_ids, ...this.flags.user_ids]
    }
    if (this.flags.user_emails) {
      for (const email of this.flags.user_emails) {
        // eslint-disable-next-line no-await-in-loop
        const user_id = await this.pd.userIDForEmail(email)
        if (user_id === null) {
          this.error(`No user was found with the email ${chalk.bold.blue(email)}`, { exit: 1 })
        } else {
          user_ids.push(user_id)
        }
      }
    }
    user_ids = [...new Set(user_ids)]

    const invalid_ids = utils.invalidPagerDutyIDs(user_ids)
    if (invalid_ids && invalid_ids.length > 0) {
      this.error(`Invalid User ID's: ${invalid_ids.join(', ')}`, { exit: 1 })
    }

    if (user_ids.length === 0) {
      this.error('No users specified. Please specify some users using -u, -U')
    }

    const requests: PD.Request[] = []

    for (const team_id of team_ids) {
      for (const user_id of user_ids) {
        requests.push({
          endpoint: `teams/${team_id}/users/${user_id}`,
          method: 'DELETE',
        })
      }
    }

    const r = await this.pd.batchedRequestWithSpinner(requests, {
      activityDescription: `Removing ${user_ids.length} users from ${team_ids.length} teams`,
    })
    for (const failure of r.getFailedIndices()) {
      const f = requests[failure] as any
      const [, team_id, , user_id] = f.endpoint.split('/')
      // eslint-disable-next-line no-console
      console.error(`${chalk.bold.red('Failed to remove user ')}${chalk.bold.blue(user_id)}${chalk.bold.red(' from team ')}${chalk.bold.blue(team_id)}: ${r.results[failure].getFormattedError()}`)
    }
  }
}
