import { ListBaseCommand } from '../../base/list-base-command'
import { CliUx, Flags } from '@oclif/core'
import * as utils from '../../utils'
import jp from 'jsonpath'

export default class TeamList extends ListBaseCommand<typeof TeamList> {
  static pdObjectName = 'team'
  static pdObjectNamePlural = 'teams'
  static description = 'List PagerDuty Teams'

  async run() {
    const params: Record<string, any> = {}

    if (this.flags.name) {
      params.query = this.flags.name
    }

    const teams = await this.pd.fetchWithSpinner('teams', {
      params: params,
      activityDescription: 'Getting teams from PD',
      fetchLimit: this.flags.limit,
    })

    if (this.flags.json) {
      this.printJsonAndExit(teams)
    }

    const columns: Record<string, object> = {
      id: {
        header: 'ID',
      },
      summary: {
        header: 'Name',
      },
      description: {
        extended: true,
      },
    }

    if (this.flags.keys) {
      for (const key of this.flags.keys) {
        columns[key] = {
          header: key,
          get: (row: any) => utils.formatField(jp.query(row, key), this.flags.delimiter),
        }
      }
    }

    this.printTable(teams, columns, this.flags)
  }
}
