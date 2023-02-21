import { AuthenticatedBaseCommand } from '../../../base/authenticated-base-command'
import { Flags, CliUx } from '@oclif/core'
import chalk from 'chalk'

export default class OrchestrationRouteList extends AuthenticatedBaseCommand<typeof OrchestrationRouteList> {
  static description = 'List PagerDuty Event Orchestration Routes'

  static flags = {
    id: Flags.string({
      char: 'i',
      description: 'The ID of the orchestration whose routes to list',
      required: true,
    }),
    keys: Flags.string({
      char: 'k',
      description: 'Additional fields to display. Specify multiple times for multiple fields.',
      multiple: true,
    }),
    json: Flags.boolean({
      char: 'j',
      description: 'output full details as JSON',
      exclusive: ['columns', 'filter', 'sort', 'csv', 'extended'],
    }),
    pipe: Flags.boolean({
      char: 'p',
      description: 'Print orchestration ID\'s only to stdout, for use with pipes.',
      exclusive: ['columns', 'sort', 'csv', 'extended', 'json'],
    }),
    delimiter: Flags.string({
      char: 'd',
      description: 'Delimiter for fields that have more than one value',
      default: '\\n',
    }),
    ...CliUx.ux.table.flags(),
  }

  public async init(): Promise<void> {
    await super.init()
    if (this.flags.delimiter === '\\n') {
      this.flags.delimiter = '\n'
    }
    if (this.flags.keys) {
      this.flags.keys = this.flags.keys.map(x => x.split(/,\s*/)).flat().filter(x => x)
    }
  }

  async run() {
    CliUx.ux.action.start(
      `Getting routes for orchestration ${chalk.bold.blue(this.flags.id)}`
    )
    const r = await this.pd.request({
      endpoint: `event_orchestrations/${this.flags.id}/router`,
    })

    if (r.isFailure) {
      CliUx.ux.action.stop(chalk.bold.red('failed!'))
      this.error(
        `${chalk.bold.red('Failed to get orchestration ')}${chalk.bold.blue(
          this.flags.id
        )}: ${r.getFormattedError()}`,
        { exit: 1 }
      )
    }
    CliUx.ux.action.stop(chalk.bold.green('done'))

    const orchestration = r.getData()

    const rows = []
    for (const set of orchestration.orchestration_path.sets) {
      for (const rule of set.rules) {
        rows.push({
          id: rule.id,
          description: rule.label,
          conditions: rule.conditions.map((x: any) => x.expression),
          actions: Object.keys(rule.actions).map(
            (x: any) => `${x} ${rule.actions[x]}`
          ),
        })
      }
    }
    const catch_all = orchestration.orchestration_path.catch_all
    rows.push({
      id: 'catch-all',
      description: 'Catch-All Route',
      conditions: [],
      actions: Object.keys(catch_all.actions).map(
        (x: any) => `${x} ${catch_all.actions[x]}`
      ),
    })

    if (this.flags.json) {
      await this.printJsonAndExit(rows)
    }

    const columns: Record<string, object> = {
      id: {},
      description: {
        get: (row: any) => (row.description ? row.description : ''),
      },
      conditions: {
        get: (row: any) => row.conditions.join(this.flags.delimiter),
      },
      actions: {
        get: (row: any) => row.actions.join(this.flags.delimiter),
      },
    }

    this.printTable(rows, columns, this.flags)
  }
}
