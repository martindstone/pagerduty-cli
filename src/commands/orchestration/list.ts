import Command from '../../base'
import {Flags, CliUx} from '@oclif/core'
import * as utils from '../../utils'
import jp from 'jsonpath'
import {PD} from '../../pd'

export default class OrchestrationList extends Command {
  static description = 'List PagerDuty Event Orchestrations'

  static flags = {
    ...Command.flags,
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
      default: '\n',
    }),
    ...CliUx.ux.table.flags(),
  }

  async run() {
    const {flags} = await this.parse(this.ctor)

    const teamsList = await this.pd.fetchWithSpinner('teams', {
      activityDescription: 'Getting team names',
      stopSpinnerWhenDone: false,
    })
    const teams = Object.assign({}, ...teamsList.map((x: any) => ({[x.id]: x})))

    const globalOrchestrations = await this.pd.fetchWithSpinner('event_orchestrations', {
      activityDescription: 'Getting global orchestrations',
      stopSpinnerWhenDone: false,
    })
    if (globalOrchestrations.length === 0) {
      this.error('No global orchestrations found', {exit: 0})
    }

    const reqs: PD.Request[] = []
    for (const orch of globalOrchestrations) {
      const req: PD.Request = {
        endpoint: `event_orchestrations/${orch.id}`,
      }
      reqs.push(req)
    }
    const r = await this.pd.batchedRequestWithSpinner(reqs, {
      activityDescription: 'Getting global orchestration routing keys',
    })
    const orchestrationDetails = r.getDatas()

    for (const orch of orchestrationDetails) {
      const i = globalOrchestrations.findIndex(x => x.id === orch.orchestration.id)
      globalOrchestrations[i].integrations = orch.orchestration.integrations
    }

    if (flags.json) {
      await utils.printJsonAndExit(globalOrchestrations)
    }

    const columns: Record<string, object> = {
      id: {
        header: 'ID',
      },
      name: {},
      description: {
        get: (row: any) => row.description ? row.description : '',
      },
      team: {
        get: (row: any) => row.team ? teams[row.team.id].summary : '',
      },
      routing_key: {
        get: (row: any) => row.integrations ? row.integrations.map((x: any) => x.parameters.routing_key).join(flags.delimiter) : '',
      },
      routes: {},
    }

    if (flags.keys) {
      for (const key of flags.keys) {
        columns[key] = {
          header: key,
          get: (row: any) => utils.formatField(jp.query(row, key), flags.delimiter),
        }
      }
    }

    const options: any = {
      ...flags, // parsed flags
    }

    if (flags.pipe) {
      for (const k of Object.keys(columns)) {
        if (k !== 'id') {
          const colAny = columns[k] as any
          colAny.extended = true
        }
      }
      options['no-header'] = true
    }

    CliUx.ux.table(globalOrchestrations, columns, options)
  }
}
