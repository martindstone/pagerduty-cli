import Command from '../../base'
import {Flags, CliUx} from '@oclif/core'
import chalk from 'chalk'

export default class OrchestrationList extends Command {
  static description = 'Add a PagerDuty Event Orchestration'

  static flags = {
    ...Command.flags,
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
    const {flags} = await this.parse(this.ctor)

    if (flags.team_name) {
      const teamsList = await this.pd.fetchWithSpinner('teams', {
        activityDescription: 'Getting team names',
        stopSpinnerWhenDone: false,
      })
      const team = teamsList.find((team: any) => team.name === flags.team_name)
      if (!team) {
        this.error(`No team with the name ${chalk.bold.blue(flags.team_name)} was found}`, {exit: 1})
      }
      flags.team_id = team.id
    }

    const body: any = {
      orchestration: {
        name: flags.name,
      },
    }
    if (flags.description) {
      body.orchestration.description = flags.description
    }
    if (flags.team_id) {
      body.orchestration.team = {
        id: flags.team_id,
      }
    }

    CliUx.ux.action.start(`Adding orchestration ${chalk.bold.blue(flags.name)}`)
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
