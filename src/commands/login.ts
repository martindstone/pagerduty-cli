import {Command} from '@oclif/command'
import AuthWeb from './auth/web'

export default class Login extends Command {
  static description = 'Authenticate with PagerDuty in the browser'

  static flags = {
    ...Command.flags,
  }

  async run() {
    await AuthWeb.run()
  }
}
