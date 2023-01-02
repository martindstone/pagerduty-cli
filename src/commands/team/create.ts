import { AuthenticatedBaseCommand } from '../../base/authenticated-base-command'
import {CliUx, Flags} from '@oclif/core'
import chalk from 'chalk'
import * as utils from '../../utils'

export default class TeamCreate extends AuthenticatedBaseCommand<typeof TeamCreate> {
  static description = 'Create an empty PagerDuty Team. You can add escalation policies and users later with team:ep and team:user'

  static flags = {
    name: Flags.string({
      char: 'n',
      description: 'The name of the team to add.',
      required: true,
    }),
    description: Flags.string({
      description: 'The description of the team',
    }),
    parent_id: Flags.string({
      char: 'a',
      description: 'The ID of the new team\'s parent team',
      exclusive: ['parent_name'],
    }),
    parent_name: Flags.string({
      char: 'A',
      description: 'The name of the new team\'s parent team',
      exclusive: ['parent_id'],
    }),
    open: Flags.boolean({
      char: 'o',
      description: 'Open the new team in the browser',
    }),
    pipe: Flags.boolean({
      char: 'p',
      description: 'Print the team ID only to stdout, for use with pipes.',
      exclusive: ['open'],
    }),
  }

  async run() {
    const body: any = {
      team: {
        type: 'team',
        name: this.flags.name,
      },
    }

    if (this.flags.description) {
      body.team.description = this.flags.description
    }

    if (this.flags.parent_id) {
      if (utils.invalidPagerDutyIDs([this.flags.parent_id]).length > 0) {
        this.error(`Invalid team ID: ${chalk.bold.blue(this.flags.parent_id)}`, {exit: 1})
      }
      body.team.parent = {
        id: this.flags.parent_id,
        type: 'team_reference',
      }
    } else if (this.flags.parent_name) {
      const parent_id = await this.pd.teamIDForName(this.flags.parent_name)
      if (!parent_id) {
        this.error(`No team was found with the name ${chalk.bold.blue(this.flags.parent_name)}`, {exit: 1})
      }
      body.team.parent = {
        id: parent_id,
        type: 'team_reference',
      }
    }

    const r = await this.pd.request({
      endpoint: 'teams',
      method: 'POST',
      data: body,
    })

    if (r.isFailure) {
      this.error(`Failed to create team: ${r.getFormattedError()}`, {exit: 1})
    }
    CliUx.ux.action.stop(chalk.bold.green('done'))
    const returned_team = r.getData()

    if (this.flags.pipe) {
      this.log(returned_team.team.id)
    } else if (this.flags.open) {
      CliUx.ux.action.start(`Opening ${chalk.bold.blue(returned_team.team.html_url)} in the browser`)
      try {
        await CliUx.ux.open(returned_team.team.html_url)
      } catch (error) {
        CliUx.ux.action.stop(chalk.bold.red('failed!'))
        this.error('Couldn\'t open your browser. Are you running as root?', {exit: 1})
      }
      CliUx.ux.action.stop(chalk.bold.green('done'))
    } else {
      this.log(`Your new team is at ${chalk.bold.blue(returned_team.team.html_url)}`)
    }
  }
}
