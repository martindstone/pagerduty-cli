import Command from '../../authbase'
import {flags} from '@oclif/command'
// import chalk from 'chalk'
import cli from 'cli-ux'
// import {PD} from '../../pd'
import {Config} from '../../config'

export default class AuthList extends Command {
  static description = 'List authenticated PagerDuty domains'

  async run() {
    this.requireAuth()
    const config = new Config()
    const subdomains = config.all()
    const defaultAlias = config.defaultAlias()

    const columns: Record<string, object> = {
      default: {
        get: (row: any) => row.alias === defaultAlias ? '  ✅' : '',
      },
      alias: {
      },
      subdomain: {
      },
      email: {
        get: (row: { user: any }) => row.user?.email || '',
      },
      type: {
        get: (row: any) => {
          if (row.accessToken) {
            return 'OAuth'
          }
          if (row.legacyToken) {
            if (row.isDomainToken) {
              return 'Legacy (Global)'
            }
            return 'Legacy (User)'
          }
        },
      },
    }

    const options = {
      printLine: this.log,
      ...flags, // parsed flags
    }
    cli.table(subdomains, columns, options)
  }
}
