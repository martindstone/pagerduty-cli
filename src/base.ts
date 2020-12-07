import Command, {flags} from '@oclif/command'
import {cli} from 'cli-ux'
import chalk from 'chalk'
import * as config from './config'
import * as pd from './pd'

export default abstract class extends Command {
  static flags = {
    help: flags.help({char: 'h'}),
  }

  protected token!: string

  private _me: any = null

  async me(die = true): Promise<any> {
    if (this._me === null) {
      try {
        const r = await pd.me(this.token)
        if (r.isFailure) {
          throw new Error(`Request to /users/me failed: ${r.getPDErrorMessage()}`)
        }
        this._me = r.getValue()
      } catch (error) {
        if (die) {
          this.error(`${error.message}. Are you using a legacy API token?`, {suggestions: ['pd login', 'pd auth:set'], exit: 1})
        }
        this._me = false
      }
    }
    return this._me
  }

  async init() {
    // do some initialization
    try {
      this.token = config.getAuth()
    } catch (error) {
      this.error('No token found', {
        exit: 1,
        suggestions: ['pd login', 'pd auth:set'],
      })
    }
    if (!pd.isValidToken(this.token)) {
      this.error(`Token '${this.token}' is not valid`, {
        exit: 1,
        suggestions: ['pd login', 'pd auth:set'],
      })
    }
  }

  protected dieIfFailed(r: pd.Result<any>, params?: { prefixMessage?: string; suggestions?: string[] }) {
    if (r.isFailure) {
      cli.action.stop(chalk.bold.red('failed!'))
      let message = ''
      if (params && params.prefixMessage) {
        message += params.prefixMessage + ': '
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
