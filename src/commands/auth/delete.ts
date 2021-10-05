import Command from '../../base'
import {flags} from '@oclif/command'
import chalk from 'chalk'
import cli from 'cli-ux'
import {Config} from '../../config'

export default class AuthDelete extends Command {
  static description = 'Set PagerDuty Auth token'

  static flags = {
    ...Command.flags,
    alias: flags.string({
      char: 'a',
      description: 'The alias of the PD token to delete',
      required: true,
    }),
  }

  async run() {
    const {flags} = this.parse(AuthDelete)
    cli.action.start(`Deleting auth for ${flags.alias}`)
    if (this._config.delete(flags.alias)) {
      this._config.save()
      cli.action.stop(chalk.bold.green('done'))
    } else {
      cli.action.stop(chalk.bold.red('failed!'))
      this.error(`Failed to delete ${flags.alias}. Are you sure it exists?`, {
        suggestions: ['pd auth:list'],
        exit: 1,
      })
    }
  }
}
