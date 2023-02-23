import { AuthenticatedBaseCommand } from '../../../../base/authenticated-base-command'
import {CliUx, Flags} from '@oclif/core'
import chalk from 'chalk'

export default class FieldSchemaAssignmentList extends AuthenticatedBaseCommand<typeof FieldSchemaAssignmentList> {
  static description = 'List PagerDuty Custom Field Schema Service Assignments'

  static flags = {
    ids: Flags.string({
      char: 'i',
      description: 'A schema ID to list assignments for. Specify multiple times for multiple schemas.',
      multiple: true,
    }),
    service_ids: Flags.string({
      char: 's',
      description: 'A service ID to list assignments for. Specify multiple times for multiple services.',
      multiple: true,
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
    delimiter: Flags.string({
      char: 'd',
      description: 'Delimiter for fields that have more than one value',
      default: '\n',
    }),
    ...CliUx.ux.table.flags(),
  }

  async run() {
    let {
      ids: schema_ids,
      service_ids,
      json,
    } = this.flags

    const headers = {
      'X-EARLY-ACCESS': 'flex-service-early-access',
    }

    if (!service_ids) {
      service_ids = []
    } else {
      service_ids = [...new Set(service_ids)]
    }

    const schemas = await this.pd.fetchWithSpinner('customfields/schemas', {
      activityDescription: 'Getting field schemas from PD',
      headers,
      stopSpinnerWhenDone: false,
    })
    if (schemas.length === 0) {
      this.error('No schemas found. Please check your search.', {exit: 1})
    }

    if (!schema_ids && !service_ids) {
      schema_ids = schemas.map(x => x.id)
    } else {
      schema_ids = [...new Set(schema_ids)]
    }

    const schemasMap = Object.assign({}, ...schemas.map((schema: any) => ({[schema.id]: schema})))

    const services = await this.pd.fetchWithSpinner('services', {
      activityDescription: 'Getting services from PD',
      headers,
      stopSpinnerWhenDone: false,
    })
    if (services.length === 0) {
      this.error('No services found. Please check your search.', {exit: 1})
    }

    const servicesMap = Object.assign({}, ...services.map((service: any) => ({[service.id]: service})))

    let schema_assignments: any[] = []

    for (const schema_id of schema_ids) {
      const r = await this.pd.fetchWithSpinner('customfields/schema_assignments', {
        activityDescription: `Getting schema assignments for schema ${chalk.bold.blue(schema_id)}`,
        stopSpinnerWhenDone: false,
        params: {
          schema_id
        },
        headers,
      })
      schema_assignments.push(...r)
    }
    for (const service_id of service_ids) {
      const r = await this.pd.fetchWithSpinner('customfields/schema_assignments', {
        activityDescription: `Getting schema assignments for service ${chalk.bold.blue(service_id)}`,
        stopSpinnerWhenDone: false,
        params: {
          service_id
        },
        headers,
      })
      schema_assignments.push(...r)
    }

    CliUx.ux.action.stop(chalk.bold.green('done'))

    if (schema_assignments.length === 0) {
      this.error('No schema assignments found.', {exit: 1})
    }

    // deduplicate schema assignments on the schema assignment id
    schema_assignments = schema_assignments.filter((x, idx, self) => {
      return idx === self.findIndex(y => y.id === x.id)
    })

    if (json) {
      await this.printJsonAndExit(schema_assignments)
    }

    const columns: Record<string, object> = {
      assignment_id: {
        get: (row: any) => row.id,
      },
      schema_id: {
        get: (row: any) => row.schema.id,
      },
      schema_name: {
        get: (row: any) => schemasMap[row.schema.id].title,
      },
      service_id: {
        get: (row: any) => row.service.id,
      },
      service_name: {
        get: (row: any) => servicesMap[row.service.id].name,
      }
    }

    this.printTable(schema_assignments, columns, this.flags)
  }
}
