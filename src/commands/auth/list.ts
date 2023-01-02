import { BaseCommand } from '../../base/base-command'
import { CliUx } from '@oclif/core'
import { Config } from '../../config'

export default class AuthList extends BaseCommand<typeof AuthList> {
  static description = 'List authenticated PagerDuty domains'

  async run() {
    this.requireAuth()
    const config = new Config()
    const subdomains = config.all()
    const defaultAlias = config.defaultAlias()

    const columns: Record<string, object> = {
      default: {
        get: (row: any) => (row.alias === defaultAlias ? '  ✅' : ''),
      },
      alias: {},
      subdomain: {},
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

    CliUx.ux.table(subdomains, columns)
  }
}
