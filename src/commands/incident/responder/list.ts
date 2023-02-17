import { AuthenticatedBaseCommand } from '../../../base/authenticated-base-command'
import { CliUx, Flags } from '@oclif/core'
import chalk from 'chalk'
import getStream from 'get-stream'
import * as utils from '../../../utils'
import { PD } from '../../../pd'

export default class IncidentResponderList extends AuthenticatedBaseCommand<typeof IncidentResponderList> {
  static description = 'List Responders on PagerDuty Incidents'

  static flags = {
    me: Flags.boolean({
      char: 'm',
      description: 'List responders on all incidents that are currently assigned to me',
      exclusive: ['ids', 'pipe'],
    }),
    ids: Flags.string({
      char: 'i',
      description: 'Incident ID\'s to list responders on. Specify multiple times for multiple incidents.',
      multiple: true,
      exclusive: ['me', 'pipe'],
    }),
    pipe: Flags.boolean({
      char: 'p',
      description: 'Read incident ID\'s from stdin.',
      exclusive: ['me', 'ids'],
    }),
  }

  async run() {
    this.pd.silent = true

    if (!(this.flags.ids || this.flags.me || this.flags.pipe)) {
      this.error('You must specify one of: -i, -m, -p', { exit: 1 })
    }

    let incident_ids: string[] = []
    if (this.flags.me) {
      const me = await this.me(true)
      const params = { user_ids: [me.user.id] }
      CliUx.ux.action.start('Getting incidents from PD')
      const incidents = await this.pd.fetch('incidents', { params: params })

      if (incidents.length === 0) {
        CliUx.ux.action.stop(chalk.bold.red('none found'))
        this.exit(1)
      }
      incident_ids = incidents.map((e: { id: any }) => e.id)
    } else if (this.flags.ids) {
      incident_ids = utils.splitDedupAndFlatten(this.flags.ids)
    } else if (this.flags.pipe) {
      const str: string = await getStream(process.stdin)
      incident_ids = utils.splitDedupAndFlatten([str])
    }

    if (incident_ids.length === 0) {
      this.error('No incidents to list responder requests on', {exit: 1})
    }

    let invalid_ids = utils.invalidPagerDutyIDs(incident_ids)
    if (invalid_ids && invalid_ids.length > 0) {
      this.error(`Invalid incident ID's: ${invalid_ids.join(', ')}`, { exit: 1 })
    }
    
    const requests: PD.Request[] = incident_ids.map(incident_id => ({
      endpoint: `incidents/${incident_id}`,
      method: 'GET',
    }))
    const r = await this.pd.batchedRequestWithSpinner(requests, {
      activityDescription: `Getting info for ${incident_ids.length} incidents`,
    })
    if (r.getFailedIndices().length > 0) {
      CliUx.ux.action.stop(chalk.bold.yellow('warning'))
      for (const i of r.getFailedIndices()) {
        const incident_id = r.requests[i].endpoint.split('/')[1]
        const message = r.results[i].getFormattedError()
        this.warn(`Failed to get incident ${chalk.bold.blue(incident_id)}: ${chalk.bold.red(message)}`)
        incident_ids = incident_ids.filter(x => x !== incident_id)
      }
    }

    const incidents = r.getDatas()
    let responder_requests = incidents.map(x => x.incident.responder_requests).flat()
    let responder_request_targets = responder_requests.map(x => x.responder_request_targets).flat()
    const rows: any[] = []
    for (const target of responder_request_targets) {
      const {type: target_type, id: target_id, summary: target_summary, incidents_responders} = target.responder_request_target
      for (const responder of incidents_responders) {
        rows.push({
          target_type,
          target_id,
          target_summary,
          ...responder,
        })
      }
    }

    const columns: Record<string, any> = {
      incident_id: {
        get: (row: any) => row.incident.id,
      },
      requester_id: {
        get: (row: any) => row.requester.id,
      },
      requester_name: {
        get: (row: any) => row.requester.summary,
      },
      target_type: {},
      target_id: {
        get: (row: any) => row.target_type === 'user' ? '' : row.target_id,
      },
      target_summary: {},
      state: {},
      responder_id: {
        get: (row: any) => row.user.id
      },
      responder_summary: {
        get: (row: any) => row.user.summary
      },
      requested_at: {
        get: (row: any) => (new Date(row.requested_at)).toLocaleString()
      }
    }

    const flags: any = {
      ...this.flags,
    }
    if (flags.pipe) flags.pipe = 'input'

    this.printTable(rows, columns, flags)
  }
}
