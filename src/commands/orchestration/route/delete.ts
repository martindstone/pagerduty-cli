import Command from '../../../base'
import {Flags, CliUx} from '@oclif/core'
import chalk from 'chalk'

export default class OrchestrationRouteDelete extends Command {
  static description = 'Delete a Route from a PagerDuty Event Orchestration'

  static flags = {
    ...Command.flags,
    id: Flags.string({
      char: 'i',
      description: 'The ID of the orchestration to delete a route from',
      required: true,
    }),
    route_ids: Flags.string({
      char: 'r',
      description: 'The ID of the route to delete. Specify multiple times to delete multiple routes.',
      multiple: true,
    }),
    service_ids: Flags.string({
      char: 's',
      description: 'Delete routes that route to the PagerDuty service with this ID. Specify multiple times to delete multiple routes.',
      multiple: true,
    }),
    service_names: Flags.string({
      char: 'S',
      description: 'Delete routes that route to the PagerDuty service with this name. Specify multiple times to delete multiple routes.',
      multiple: true,
    }),
  }

  async run() {
    const {flags} = await this.parse(this.ctor)

    if (!(flags.route_ids || flags.service_ids || flags.service_names)) {
      this.error(chalk.bold.red('You must specify at least one of: -r, -s, -S'), {exit: 1})
    }

    if (flags.route_ids === undefined) flags.route_ids = []
    if (flags.service_ids === undefined) flags.service_ids = []

    let r

    if (flags.service_names) {
      const servicesList: Record<string, any> = await this.pd.fetchWithSpinner('services', {
        activityDescription: 'Getting service IDs',
        stopSpinnerWhenDone: false,
      })
      const servicesMap: Record<string, string> = Object.assign({}, ...servicesList.map((service: any) => ({[service.name]: service.id})))
      for (const serviceName of flags.service_names) {
        if (!servicesMap[serviceName]) {
          this.error(`No service was found with the name ${chalk.bold.blue(serviceName)}`, {exit: 1})
        }
        flags.service_ids.push(servicesMap[serviceName])
      }
    }

    CliUx.ux.action.start(`Getting routes for orchestration ${chalk.bold.blue(flags.id)}`)
    r = await this.pd.request({
      endpoint: `event_orchestrations/${flags.id}/router`,
    })

    if (r.isFailure) {
      CliUx.ux.action.stop(chalk.bold.red('failed!'))
      this.error(`${chalk.bold.red('Failed to get orchestration ')}${chalk.bold.blue(flags.id)}: ${r.getFormattedError()}`, {exit: 1})
    }

    const orchestration = r.getData()

    let rules = orchestration.orchestration_path.sets[0].rules

    const rulesToDelete = rules.filter((rule: any) => {
      return flags.route_ids.includes(rule.id) || flags.service_ids.includes(rule.actions.route_to)
    })
    if (rulesToDelete.length === 0) {
      this.error(chalk.bold.red('No rules found to delete'))
    }

    rules = rules.filter((rule: any) => {
      return !(flags.route_ids.includes(rule.id) || flags.service_ids.includes(rule.actions.route_to))
    })

    const newOrchestration = {
      type: 'router',
      orchestration_path: {
        parent: orchestration.orchestration_path.parent,
        sets: orchestration.orchestration_path.sets,
        catch_all: orchestration.orchestration_path.catch_all,
      },
    }
    newOrchestration.orchestration_path.sets[0].rules = rules

    const howManyRoutes = `${rulesToDelete.length} route${rulesToDelete.length > 1 ? 's' : ''}`
    CliUx.ux.action.start(`Deleting ${chalk.bold.blue(howManyRoutes)} in orchestration ${chalk.bold.blue(flags.id)}`)
    r = await this.pd.request({
      method: 'PUT',
      endpoint: `event_orchestrations/${flags.id}/router`,
      data: newOrchestration,
    })
    if (r.isFailure) {
      CliUx.ux.action.stop(chalk.bold.red('failed!'))
      this.error(`${chalk.bold.red('Failed to update orchestration ')}${chalk.bold.blue(flags.id)}: ${r.getFormattedError()}`, {exit: 1})
    }
    CliUx.ux.action.stop(chalk.bold.green('done'))
  }
}
