import { ListBaseCommand } from '../../base/list-base-command'
import { CliUx } from '@oclif/core'
import chalk from 'chalk'

export default class EpList extends ListBaseCommand<typeof EpList> {
  static pdObjectName = 'escalation policy'
  static pdObjectNamePlural = 'escalation policies'
  static description = 'List PagerDuty Escalation Policies'

  async run() {
    const params: Record<string, any> = {}

    if (this.flags.name) {
      params.query = this.flags.name
    }

    const eps = await this.pd.fetchWithSpinner('escalation_policies', {
      params: params,
      activityDescription: 'Getting escalation policies from PD',
      fetchLimit: this.flags.limit,
    })

    if (eps.length === 0) {
      CliUx.ux.action.stop(chalk.bold.red('none found'))
      this.exit(0)
    }
    CliUx.ux.action.stop(chalk.bold.green(`got ${eps.length}`))

    if (this.flags.json) {
      this.printJsonAndExit(eps)
    }

    const columns: Record<string, object> = {
      id: {
        header: 'ID',
      },
      name: {
        header: 'Name',
      },
      '# Rules': {
        get: (row: { escalation_rules: any[] }) => row.escalation_rules.length,
      },
      service_names: {
        get: (row: { services: any[] }) => row.services.map((e: any) => e.summary).join(this.flags.delimiter),
        extended: true,
      },
      team_names: {
        get: (row: { teams: any[] }) => row.teams.map((e: any) => e.summary).join(this.flags.delimiter),
        extended: true,
      },
      '# Loops': {
        get: (row: any) => row.num_loops,
      },
    }

    this.printTable(eps, columns, this.flags)
  }
}
