import { AuthenticatedBaseCommand } from '../../../base/authenticated-base-command'
import {CliUx, Flags} from '@oclif/core'
import chalk from 'chalk'
import getStream from 'get-stream'
import * as utils from '../../../utils'
import { PD } from '../../../pd'

export default class IncidentFieldGet extends AuthenticatedBaseCommand<typeof IncidentFieldGet> {
  static description = 'Get Custom Field Values on PagerDuty Incidents'

  static flags = {
    me: Flags.boolean({
      char: 'm',
      description: 'Show all incidents that are currently assigned to me',
      exclusive: ['ids', 'pipe'],
    }),
    ids: Flags.string({
      char: 'i',
      description: 'Incident ID\'s to show. Specify multiple times for multiple incidents.',
      multiple: true,
      exclusive: ['me', 'pipe'],
    }),
    display_name: Flags.boolean({
      char: 'n',
      description: 'Show the display names of fields rather than their canonical names.',
    }),
    pipe: Flags.boolean({
      char: 'p',
      description: 'Read incident ID\'s from stdin.',
      exclusive: ['me', 'ids'],
    }),
    delimiter: Flags.string({
      char: 'd',
      description: 'Delimiter for fields that have more than one value',
      default: '\n',
    }),
  }

  async run() {
    const headers = {
      'X-EARLY-ACCESS': 'flex-service-early-access',
    }

    const {
      me,
      ids,
      pipe,
      delimiter,
      display_name,
    } = this.flags

    let incident_ids: string[] = []
    if (me) {
      const me = await this.me(true)
      const params = {user_ids: [me.user.id]}
      CliUx.ux.action.start('Getting incidents from PD')
      const incidents = await this.pd.fetch('incidents', {params: params})

      if (incidents.length === 0) {
        CliUx.ux.action.stop(chalk.bold.red('none found'))
        this.exit(1)
      }
      incident_ids = incidents.map((e: { id: any }) => e.id)
    } else if (ids) {
      incident_ids = utils.splitDedupAndFlatten(ids)
    } else if (pipe) {
      const str: string = await getStream(process.stdin)
      incident_ids = utils.splitDedupAndFlatten([str])
    } else {
      this.error('You must specify one of: -i, -m, -p', {exit: 1})
    }

    let invalid_ids = utils.invalidPagerDutyIDs(incident_ids)
    if (invalid_ids && invalid_ids.length > 0) {
      this.error(`Invalid incident ID's: ${invalid_ids.join(', ')}`, {exit: 1})
    }

    const incidentRequests: PD.Request[] = incident_ids.map((incident_id: any) => ({
      endpoint: `incidents/${incident_id}/field_values`,
      method: 'GET',
      headers,
    }))
    let rs = await this.pd.batchedRequestWithSpinner(incidentRequests, {
      activityDescription: `Getting field values for ${incidentRequests.length} incidents`,
      stopSpinnerWhenDone: false,
    })
    if (rs.getFailedIndices().length > 0) {
      for (const i of rs.getFailedIndices()) {
        const incidentId = chalk.bold.blue(rs.requests[i].endpoint.split('/')[1])
        const formattedError = rs.results[i].getFormattedError()
        this.warn(`Failed to get field values for incident ${incidentId}: ${formattedError}`)
      }
    }
    CliUx.ux.action.stop(chalk.bold.green('done'))

    const datas = rs.getDatas()
    if (!datas || datas.length === 0) {
      this.error('No field values found', {exit:1})
    }

    const fieldValues = datas.map((v, i) => {
      const incident_id = rs.requests[i].endpoint.split('/')[1]
      return Object.assign({incident_id}, ...v.field_values.map((field_value: any) => ({[display_name ? field_value.display_name : field_value.name]: field_value.value})))
    })

    const fieldNames = [...new Set(fieldValues.map(v => Object.keys(v)).flat())]
    // this.printJsonAndExit(fieldNames)

    const columns: Record<string, object> = Object.assign({}, ...fieldNames.map(n => ({
      [n]: {
        header: n === 'incident_id' ? 'Incident ID' : n,
        get: (row: any) => utils.formatField(row[n], delimiter),
      }
    })))

    const flags: any = {
      ...this.flags
    }
    if (flags.pipe) flags.pipe = 'input'

    this.printTable(fieldValues, columns, flags)

  }
}
