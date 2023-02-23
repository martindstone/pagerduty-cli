import Command from '../../../base'
import {CliUx, Flags} from '@oclif/core'
import chalk from 'chalk'
import * as utils from '../../../utils'
import jp from 'jsonpath'

export default class FieldOptionList extends Command {
  static description = 'List PagerDuty Custom Field Options'

  static flags = {
    ...Command.flags,
    ...Command.listCommandFlags,
    id: Flags.string({
      char: 'i',
      description: 'The ID of a fixed-options Field to list options for.',
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
      description: 'Print field option ID\'s only to stdout, for use with pipes.',
      exclusive: ['columns', 'sort', 'csv', 'extended', 'json'],
    }),
    ...CliUx.ux.table.flags(),
  }

  async run() {
    const {flags} = await this.parse(this.ctor)

    const {
      id,
    } = flags

    if (utils.invalidPagerDutyIDs([id]).length > 0) {
      this.error(`Invalid PagerDuty ID ${chalk.bold.blue(id)}`, {exit: 1})
    }

    const headers = {
      'X-EARLY-ACCESS': 'flex-service-early-access',
    }

    CliUx.ux.action.start(`Getting field details from PD`)
    let r = await this.pd.request({
      endpoint: `fields/${id}`,
      method: 'GET',
      headers
    })

    if (r.isFailure) {
      this.error(`Couldn't get field ${chalk.bold.blue(id)}: ${r.getFormattedError()}`)
    }
    const field = r.getData()

    if (!field.field.fixed_options) {
      this.error(`${chalk.bold.blue(id)} is not a fixed-options field`)
    }

    const fieldOptions = await this.pd.fetchWithSpinner(`fields/${id}/field_options`, {
      activityDescription: 'Getting field options from PD',
      fetchLimit: flags.limit,
      headers,
    })
    if (fieldOptions.length === 0) {
      this.error('No field options found. Please check your field ID.', {exit: 1})
    }

    if (flags.json) {
      await utils.printJsonAndExit(fieldOptions)
    }

    const columns: Record<string, object> = {
      id: {
        header: 'ID',
      },
      created: {
        get: (row: { created_at: string }) => (new Date(row.created_at)).toLocaleString(),
        extended: true,
      },
      updated: {
        get: (row: { updated_at: string }) => (new Date(row.updated_at)).toLocaleString(),
        extended: true,
      },
      value: {
        get: (row: any) => row.data.value,
      },
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

    CliUx.ux.table(fieldOptions, columns, options)
  }
}
