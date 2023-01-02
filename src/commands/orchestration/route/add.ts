import { AuthenticatedBaseCommand } from '../../../base/authenticated-base-command'
import { Flags, CliUx } from '@oclif/core'
import chalk from 'chalk'

export default class OrchestrationRouteAdd extends AuthenticatedBaseCommand<typeof OrchestrationRouteAdd> {
  static description = 'Add a Route to a PagerDuty Event Orchestration'

  static flags = {
    id: Flags.string({
      char: 'i',
      description: 'The ID of the orchestration to add a route to',
      required: true,
    }),
    description: Flags.string({
      char: 'd',
      description: 'A human-readable description of what the route does',
    }),
    conditions: Flags.string({
      char: 'c',
      description: 'The conditions that must be true for the route action to occur',
      multiple: true,
    }),
    service_id: Flags.string({
      char: 's',
      description: 'The ID of a PagerDuty service to route to',
      exclusive: ['service_name'],
    }),
    service_name: Flags.string({
      char: 'S',
      description: 'The name of a PagerDuty service to route to',
      exclusive: ['service_id'],
    }),
  }

  async run() {
    if (!(this.flags.service_id || this.flags.service_name)) {
      this.error('You must specify at least one of: -s, -S', { exit: 1 })
    }

    if (this.flags.service_name) {
      let servicesList: Record<string, any> = await this.pd.fetchWithSpinner('services', {
        activityDescription: 'Getting service IDs',
        stopSpinnerWhenDone: false,
      })
      servicesList = servicesList.filter((service: any) => service.name === this.flags.service_name)
      if (servicesList.length === 0) {
        this.error(`No service was found with the name ${chalk.bold.blue(this.flags.service_name)}`, { exit: 1 })
      }
      if (servicesList.length > 1) {
        this.error(`Multiple services were found with the name ${chalk.bold.blue(this.flags.service_name)}`, { exit: 1 })
      }
      this.flags.service_id = servicesList[0].id
    }

    CliUx.ux.action.start(`Getting routes for orchestration ${chalk.bold.blue(this.flags.id)}`)
    let r = await this.pd.request({
      endpoint: `event_orchestrations/${this.flags.id}/router`,
    })

    if (r.isFailure) {
      CliUx.ux.action.stop(chalk.bold.red('failed!'))
      this.error(`${chalk.bold.red('Failed to get orchestration ')}${chalk.bold.blue(this.flags.id)}: ${r.getFormattedError()}`, { exit: 1 })
    }

    const orchestration = r.getData()
    const newOrchestration = {
      type: 'router',
      orchestration_path: {
        parent: orchestration.orchestration_path.parent,
        sets: orchestration.orchestration_path.sets,
        catch_all: orchestration.orchestration_path.catch_all,
      },
    }
    const newRule: any = {
      conditions: this.flags.conditions!.map((x: string) => ({ expression: x })),
      actions: {
        route_to: this.flags.service_id,
      },
    }
    if (this.flags.description) {
      newRule.label = this.flags.description
    }
    newOrchestration.orchestration_path.sets[0].rules.push(newRule)

    CliUx.ux.action.start(`Adding a route in orchestration ${chalk.bold.blue(this.flags.id)}`)
    r = await this.pd.request({
      method: 'PUT',
      endpoint: `event_orchestrations/${this.flags.id}/router`,
      data: newOrchestration,
    })
    if (r.isFailure) {
      CliUx.ux.action.stop(chalk.bold.red('failed!'))
      this.error(`${chalk.bold.red('Failed to update orchestration ')}${chalk.bold.blue(this.flags.id)}: ${r.getFormattedError()}`, { exit: 1 })
    }
    CliUx.ux.action.stop(chalk.bold.green('done'))
  }
}
