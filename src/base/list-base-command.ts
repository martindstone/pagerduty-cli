import { Command, Flags, Interfaces, CliUx } from '@oclif/core'
import { AuthenticatedBaseCommand } from './authenticated-base-command'
import { splitDedupAndFlatten } from '../utils'

export type Flags<T extends typeof Command> = Interfaces.InferredFlags<typeof ListBaseCommand['globalFlags'] & T['flags']>

export abstract class ListBaseCommand<T extends typeof Command> extends AuthenticatedBaseCommand<typeof ListBaseCommand> {
  // add the --json flag
  static enableJsonFlag = true

  // define flags that can be inherited by any command that extends BaseCommand
  static globalFlags = {
    ...super.globalFlags,
    name: Flags.string({
      char: 'n',
      description: 'Select <%= command.pdObjectNamePlural || "objects" %> whose names contain the given text',
    }),
    keys: Flags.string({
      char: 'k',
      description: 'Additional fields to display. Specify multiple times for multiple fields.',
      multiple: true,
    }),
    limit: Flags.integer({
      description: 'Return no more than this many entries. This option turns off table filtering options.',
      exclusive: ['filter', 'sort'],
    }),
    json: Flags.boolean({
      char: 'j',
      description: 'output full details as JSON',
      exclusive: ['columns', 'filter', 'sort', 'csv', 'extended'],
    }),
    pipe: Flags.boolean({
      char: 'p',
      description: 'Print <%= command.pdObjectName || "object" %> ID\'s only to stdout, for use with pipes.',
      exclusive: ['columns', 'sort', 'csv', 'extended', 'json'],
    }),
    delimiter: Flags.string({
      char: 'd',
      description: 'Delimiter for fields that have more than one value',
      default: '\\n',
    }),
    ...CliUx.ux.table.flags(),
  }

  protected flags!: Flags<T>

  public async init(): Promise<void> {
    await super.init()
    if (this.flags.delimiter === '\\n') {
      this.flags.delimiter = '\n'
    }
    if (this.flags.keys) {
      this.flags.keys = splitDedupAndFlatten(this.flags.keys)
    }
  }

  protected async catch(err: Error & { exitCode?: number }): Promise<any> {
    // add any custom logic to handle errors from the command
    // or simply return the parent class error handling
    return super.catch(err)
  }

  protected async finally(_: Error | undefined): Promise<any> {
    // called after run and catch regardless of whether or not the command errored
    return super.finally(_)
  }
}
