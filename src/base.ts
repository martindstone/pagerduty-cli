import Command, {flags} from '@oclif/command'
import * as config from './config'
import {PD} from './pd'

export default abstract class extends Command {
  static flags = {
    help: flags.help({char: 'h'}),
  }

  protected token!: string

  protected pd!: PD

  async me(die = false): Promise<any> {
    const me = await this.pd.me()
    if (die && !me) {
      this.error('Request to /users/me failed. Are you using a legacy API token?', {exit: 1})
    }
    return me
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
    if (!PD.isValidToken(this.token)) {
      this.error(`Token '${this.token}' is not valid`, {
        exit: 1,
        suggestions: ['pd login', 'pd auth:set'],
      })
    }
    this.pd = new PD(this.token)
  }
}
