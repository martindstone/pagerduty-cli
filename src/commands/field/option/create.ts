import Command from '../../../base'
import {CliUx, Flags} from '@oclif/core'
import chalk from 'chalk'
import * as utils from '../../../utils'

export default class FieldOptionCreate extends Command {
  static description = 'Create an option for a fixed-options Custom Field'

  static flags = {
    ...Command.flags,
    id: Flags.string({
      char: 'i',
      description: 'The ID of a fixed-options Field to add an option to.',
      required: true,
    }),
    value: Flags.string({
      char: 'v',
      description: 'The field option value to add',
      required: true,
    }),
    pipe: Flags.boolean({
      char: 'p',
      description: 'Print the new field option ID only to stdout, for use with pipes.',
    }),
  }

  private valueForDatatype(v: string, datatype: string, multi: boolean) {
    let value
    switch(datatype) {
      case 'integer':
        if (!v.match(/^\-?[\d]+$/)) throw `${v} is not an integer`
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
    const {flags} = await this.parse(this.ctor)

    const headers = {
      'X-EARLY-ACCESS': 'flex-service-early-access',
    }

    const {
      id,
      value,
    } = flags

    if (utils.invalidPagerDutyIDs([id]).length > 0) {
      this.error(`Invalid PagerDuty ID ${chalk.bold.blue(id)}`, {exit: 1})
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

    const datatype = field.field.datatype

    let valueToSet
    try {
      valueToSet = this.valueForDatatype(value, datatype, false)
    } catch (e) {
      this.error(`${chalk.bold.blue(value)} is not a valid ${datatype}`, {exit: 1})
    }

    const fieldOption = {
      field_option: {
        data: {
          datatype,
          value: valueToSet
        }
      }
    }

    CliUx.ux.action.start('Creating PagerDuty field option')
    r = await this.pd.request({
      endpoint: `fields/${id}/field_options`,
      method: 'POST',
      data: fieldOption,
      headers,
    })
    if (r.isFailure) {
      this.error(`Failed to create field option: ${r.getFormattedError()}`, {exit: 1})
    }
    CliUx.ux.action.stop(chalk.bold.green('done'))
    const returned_field = r.getData()

    if (flags.pipe) {
      this.log(returned_field.field_option.id)
    } else {
      this.log(`Created field option ${chalk.bold.blue(returned_field.field_option.id)}`)
    }
  }
}
