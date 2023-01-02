import { AuthenticatedBaseCommand } from '../../base/authenticated-base-command'
import { Flags, CliUx } from '@oclif/core'
import chalk from 'chalk'

export default class OrchestrationAdd extends AuthenticatedBaseCommand<typeof OrchestrationAdd> {
  static description = 'Add a PagerDuty Event Orchestration'

  static flags = {
    name: Flags.string({
      char: 'n',
      description: 'The name of the orchestration to add',
    }),
    description: Flags.string({
      char: 'd',
      description: 'The description of the orchestration to add',
    }),
    team_id: Flags.string({
      char: 't',
      description: 'The ID of the team that owns this orchestration. If none is specified, only admins have access.',
      exclusive: ['team_name'],
    }),
    team_name: Flags.string({
      char: 'T',
      description: 'The name of the team that owns this orchestration. If none is specified, only admins have access.',
      exclusive: ['team_id'],
    }),
  }

  async run() {
    if (this.flags.team_name) {
      const teamsList = await this.pd.fetchWithSpinner('teams', {
        activityDescription: 'Getting team names',
        stopSpinnerWhenDone: false,
      })
      const team = teamsList.find((team: any) => team.name === this.flags.team_name)
      if (!team) {
        this.error(`No team with the name ${chalk.bold.blue(this.flags.team_name)} was found}`, { exit: 1 })
      }
      this.flags.team_id = team.id
    }

    const body: any = {
      orchestration: {
        name: this.flags.name,
      },
    }
    if (this.flags.description) {
      body.orchestration.description = this.flags.description
    }
    if (this.flags.team_id) {
      body.orchestration.team = {
        id: this.flags.team_id,
      }
    }

    CliUx.ux.action.start(`Adding orchestration ${chalk.bold.blue(this.flags.name)}`)
    const r = await this.pd.request({
      endpoint: 'event_orchestrations',
      method: 'POST',
      data: body,
    })
    if (r.isFailure) {
      CliUx.ux.action.stop(chalk.bold.red('failed!'))
      this.error(`Failed to create an orchestration: ${r.getFormattedError()}`)
    }
    const orch = r.getData()
    CliUx.ux.action.stop(chalk.bold.green('done'))
    this.log(`Created orchestration ${chalk.bold.blue(orch.orchestration.id)} with routing key ${chalk.bold.blue(orch.orchestration.integrations[0].parameters.routing_key)}`)
  }
}
