import { AuthenticatedBaseCommand } from '../../../base/authenticated-base-command'
import {CliUx, Flags} from '@oclif/core'
import chalk from 'chalk'

export default class FieldSchemaCreate extends AuthenticatedBaseCommand<typeof FieldSchemaCreate> {
  static description = 'Create a PagerDuty Custom Field Schema'

  static flags = {
    title: Flags.string({
      char: 't',
      description: 'An identifier for the schema intended primarily for scripting or other programmatic use.',
      required: true,
    }),
    description: Flags.string({
      char: 'd',
      description: 'A human readable description for the schema',
    }),
    pipe: Flags.boolean({
      char: 'p',
      description: 'Print the schema ID only to stdout, for use with pipes.',
    }),
  }

  async run() {
    const headers = {
      'X-EARLY-ACCESS': 'flex-service-early-access',
    }

    const {
      title,
      description,
      pipe,
    } = this.flags

    const field_schema = {
      schema: {
        title,
        description: description as string,
      }
    }

    CliUx.ux.action.start('Creating PagerDuty field schema')
    const r = await this.pd.request({
      endpoint: 'customfields/schemas',
      method: 'POST',
      data: field_schema,
      headers,
    })
    if (r.isFailure) {
      this.error(`Failed to create schema: ${r.getFormattedError()}`, {exit: 1})
    }
    CliUx.ux.action.stop(chalk.bold.green('done'))
    const returned_field = r.getData()

    if (pipe) {
      this.log(returned_field.field.id)
    } else {
      this.log(`Created field schema ${chalk.bold.blue(returned_field.schema.title)} (${chalk.bold.blue(returned_field.schema.id)})`)
    }
  }
}
