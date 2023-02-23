import Command from '../../../../base'
import {CliUx, Flags} from '@oclif/core'
import chalk from 'chalk'
import * as utils from '../../../../utils'
import jp from 'jsonpath'
import { PD } from '../../../../pd'

export default class FieldSchemaAssignmentList extends Command {
  static description = 'List PagerDuty Custom Field Schema Service Assignments'

  static flags = {
    ...Command.flags,
    ...Command.listCommandFlags,
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
      description: 'Print field ID\'s only to stdout, for use with pipes.',
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

    const headers = {
      'X-EARLY-ACCESS': 'flex-service-early-access',
    }

    const schemas = await this.pd.fetchWithSpinner('field_schemas', {
      activityDescription: 'Getting field schemas from PD',
      headers,
      stopSpinnerWhenDone: false,
    })
    if (schemas.length === 0) {
      this.error('No schemas found. Please check your search.', {exit: 1})
    }

    const schemasMap = Object.assign({}, ...schemas.map((schema: any) => ({[schema.id]: schema})))

    const services = await this.pd.fetchWithSpinner('services', {
      activityDescription: 'Getting services from PD',
      headers,
      stopSpinnerWhenDone: false,
    })
    if (schemas.length === 0) {
      this.error('No services found. Please check your search.', {exit: 1})
    }

    const servicesMap = Object.assign({}, ...services.map((service: any) => ({[service.id]: service})))

    const requests: PD.Request[] = schemas.map((schema: any) => ({
      endpoint: `field_schema_assignments/field_schemas/${schema.id}`,
      method: 'GET',
      params: {
        limit: 100,
      },
      headers,
    }))
    const rs = await this.pd.batchedRequestWithSpinner(requests, {
      activityDescription: `Getting assignments for ${schemas.length} schemas`
    })
    CliUx.ux.action.stop(chalk.bold.green('done'))

    const assignments: any[] = []

    for (const [i, v] of rs.results.entries()) {
      const schema_id = rs.requests[i].endpoint.split('/').pop()
      const data = v.getData()
      for (const resource of data.resources) {
        assignments.push({
          schema_id,
          service_id: resource.id
        })
      }
    }

    if (assignments.length === 0) {
      this.error('No assignments found.', {exit: 1})
    }

    if (flags.json) {
      await utils.printJsonAndExit(assignments)
    }

    const columns: Record<string, object> = {
      schema_id: {},
      schema_name: {
        get: (row: any) => schemasMap[row.schema_id].title,
      },
      service_id: {},
      service_name: {
        get: (row: any) => servicesMap[row.service_id].name,
      }
    }

    if (flags.keys) {
      for (const key of flags.keys) {
        columns[key] = {
          header: key,
          get: (row: any) => utils.formatField(jp.query(row, key), flags.delimiter),
        }
      }
    }

    const options = {
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

    CliUx.ux.table(assignments, columns, options)
  }
}
