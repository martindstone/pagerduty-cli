import { ListBaseCommand } from '../../base/list-base-command'

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

    this.printTable(teams, columns, this.flags)
  }
}
