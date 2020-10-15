import Command, {flags} from '@oclif/command'
import {cli} from 'cli-ux'
import chalk from 'chalk'
import * as config from './config'
import * as pd from './pd'

export default abstract class extends Command {
  static flags = {
    help: flags.help({char: 'h'}),
  }

  protected token: string | null = null

  async init() {
    // do some initialization
    this.token = config.getAuth()
    if (!this.token) {
      this.error('No token found', {
        exit: 1,
        suggestions: ['pd auth:web', 'pd auth:set'],
      })
    }
    if (!pd.isValidToken(this.token)) {
      this.error(`Token '${this.token}' is not valid`, {
        exit: 1,
        suggestions: ['pd auth:web', 'pd auth:set'],
      })
    }
  }

  protected dieIfFailed(r: pd.Result<any>, params?: { prefixMessage?: string; suggestions?: string[] }) {
    if (r.isFailure) {
      cli.action.stop(chalk.bold.red('failed!'))
      let message = ''
      if (params && params.prefixMessage) {
        message += params.prefixMessage
      }
      message += r.getPDErrorMessage()
      let suggestions: string[] = []
      if (params && params.suggestions) {
        suggestions = params.suggestions
      }
      this.error(message, {exit: 1, suggestions: suggestions})
    }
  }
}
