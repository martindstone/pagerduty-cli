import { AuthenticatedBaseCommand } from '../../../base/authenticated-base-command'
import {CliUx, Flags} from '@oclif/core'
import chalk from 'chalk'
import getStream from 'get-stream'
import * as utils from '../../../utils'
import { PD } from '../../../pd'

export default class IncidentFieldSet extends AuthenticatedBaseCommand<typeof IncidentFieldSet> {
  static description = 'Set Custom Field Values on PagerDuty Incidents'

  static flags = {
    me: Flags.boolean({
      char: 'm',
      description: 'Update all incidents that are currently assigned to me',
      exclusive: ['ids', 'pipe'],
    }),
    ids: Flags.string({
      char: 'i',
      description: 'Incident ID\'s to update. Specify multiple times for multiple incidents.',
      multiple: true,
      exclusive: ['me', 'pipe'],
    }),
    names: Flags.string({
      char: 'n',
      description: 'Custom Field names to set. Specify multiple times to set multiple fields.',
      required: true,
      multiple: true,
    }),
    values: Flags.string({
      char: 'v',
      description: 'Custom Field values to set. To set multiple name/values, specify multiple times in the same order as the names.',
      required: true,
      multiple: true,
    }),
    jsonvalues: Flags.boolean({
      description: 'Interpret values as JSON [default: true]',
      default: true,
      allowNo: true,
    }),
    pipe: Flags.boolean({
      char: 'p',
      description: 'Read incident ID\'s from stdin.',
      exclusive: ['me', 'ids'],
    }),
  }

  private valueForDatatype(v: string, datatype: string, multi: boolean) {
    let value
    switch(datatype) {
      case 'integer':
        if (!v.match(/^[\d]+$/)) throw `${v} is not an integer`
        value = parseInt(v)
        break
      case 'float':
        if (!v.match(/^-?[\d]+\.?[\d]+?$/)) throw `${v} is not a float`
        value = parseFloat(v)
        break
      case 'boolean':
        if (v.toLowerCase() !== 'false' && v.toLowerCase() != 'true') throw `${v} is not a boolean`
        value = v.toLowerCase() === 'true'
        break
      case 'datetime':
        value = new Date(v)
        if (isNaN(value.valueOf())) throw `${v} is not a datetime`
        break
      case 'url':
        try {
          value = new URL(v)
        } catch (e) {
          throw `${v} is not a valid URL`
        }
        if (value.protocol !== 'http:' && value.protocol !== 'https:') throw `${v} is not a http/https URL`
        value = v
      default:
        value = v
    }
    return multi ? [value] : value
  }

  async run() {
    const headers = {
      'X-EARLY-ACCESS': 'flex-service-early-access',
    }

    const {
      me,
      ids,
      pipe,
      names,
      values,
      jsonvalues,
    } = this.flags

    if (names.length !== values.length) {
      this.error('You must specify the same number of names and values for this to work.', {exit: 1})
    }

    const attributes: Record<string, any>[] = []
    let value: any
    for (const [i, name] of names.entries()) {
      value = values[i]
      if (jsonvalues) {
        try {
          const jsonvalue = JSON.parse(value)
          if (jsonvalue instanceof Array && jsonvalue.length > 0) {
            value = jsonvalue.map(x => x.toString())
          }
        } catch (e) {}
      }
      attributes.push({name, value})
    }

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

    const schemaRequests: PD.Request[] = incident_ids.map((incident_id: any) => ({
      endpoint: `incidents/${incident_id}/field_values/schema`,
      method: 'GET',
      headers,
    }))
    let rs = await this.pd.batchedRequestWithSpinner(schemaRequests, {
      activityDescription: `Getting field schemas for ${schemaRequests.length} incidents`,
      stopSpinnerWhenDone: false,
    })
    if (rs.getFailedIndices().length > 0) {
      const failedStrs = rs.getFailedIndices().map(i => chalk.bold.blue(rs.requests[i].endpoint.split('/')[1]))
      this.error(`Failed to get field schemas for incidents ${failedStrs.join(', ')}! Are you sure you had a schema assigned to the service when the incident was created?`, {exit: 1})
    }

    const incidentSchemas: Record<string, any> = {}
    const incidentFields: Record<string, any> = {}
    for (const [i, v] of rs.results.entries()) {
      const incident_id = rs.requests[i].endpoint.split('/')[1]
      const data = v.getData()
      const fieldsByName = Object.assign({}, ...data.schema.field_configurations.map((config: any) => ({
        [config.field.name]: config.field
      })))
      incidentSchemas[incident_id] = data.schema
      incidentFields[incident_id] = fieldsByName
    }

    for (const name of names) {
      const incidentsMissingField = incident_ids.filter(incident_id => !incidentFields[incident_id][name])
      if (incidentsMissingField.length > 0) {
        this.error(`Incidents ${chalk.bold.blue(incidentsMissingField.join(', '))} are missing field ${chalk.bold.blue(name)}!`, {exit: 1})
      }
    }

    const fieldSetRequests: PD.Request[] = []
    for (const incident_id of incident_ids) {
      const field_values = []
      for (const attribute of attributes) {
        const datatype = incidentFields[incident_id][attribute.name].datatype
        const multi = incidentFields[incident_id][attribute.name].multi_value
        try {
          let value
          if (attribute.value instanceof Array) {
            if (!multi) throw 'you can\'t set an array value on a non-multivalued field'
            value = attribute.value.map(x => this.valueForDatatype(x, datatype, false))
          } else {
            value = this.valueForDatatype(attribute.value, datatype, multi)
          }
          field_values.push({
            name: attribute.name,
            value: value
          })
        } catch (e) {
          this.error(`Invalid value ${chalk.bold.blue(attribute.value)} for field ${chalk.bold.blue(attribute.name)} on incident ${incident_id}: ${e}`)
        }
      }
      fieldSetRequests.push({
        endpoint: `incidents/${incident_id}/field_values`,
        method: 'PUT',
        data: {field_values},
        headers
      })
    }
    rs = await this.pd.batchedRequestWithSpinner(fieldSetRequests, {
      activityDescription: `Setting ${chalk.bold.blue(names.join(', '))} on incidents ${chalk.bold.blue(incident_ids.join(', '))}`,
      stopSpinnerWhenDone: false,
    })
    if (rs.getFailedIndices().length > 0) {
      const failedStrs = rs.getFailedIndices().map(i => chalk.bold.blue(rs.requests[i].endpoint.split('/')[1]))
      this.error(`Failed to set fields on incidents: ${failedStrs.join(', ')}`, {exit: 1})
    }
    CliUx.ux.action.stop(chalk.bold.green('done'))
  }
}
