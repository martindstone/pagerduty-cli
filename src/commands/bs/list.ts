import { ListBaseCommand } from '../../base/list-base-command'

export default class BsList extends ListBaseCommand<typeof BsList> {
  static pdObjectName = 'business service'
  static pdObjectNamePlural = 'business services'
  static description = 'List PagerDuty Business Services'

  async run() {
    const params: Record<string, any> = {
      include: ['auto_pause_notifications_parameters']
    }

    let teamsMap: Record<string, any> = {}
    if (this.flags.extended) {
      const teams = await this.pd.fetchWithSpinner('teams', {
        activityDescription: 'Getting teams from PD',
        stopSpinnerWhenDone: false,
      })
      teamsMap = Object.assign({}, ...teams.map(x => ({[x.id]: x})))
    }

    if (this.flags.name) {
      params.query = this.flags.name
    }

    let business_services = await this.pd.fetchWithSpinner('business_services', {
      params: params,
      activityDescription: 'Getting business services from PD',
      fetchLimit: this.flags.limit,
    })
    if (business_services.length === 0) {
      this.error('No business services found. Please check your search.', { exit: 1 })
    }

    if (this.flags.name) {
      // implement name search because endpoint doesn't
      business_services = business_services.filter(x => x.name.toLowerCase().includes(this.flags.name?.toLowerCase()))
    }
    if (this.flags.json) {
      await this.printJsonAndExit(business_services)
    }

    const columns: Record<string, object> = {
      id: {
        header: 'ID',
      },
      name: {},
      description: {},
      point_of_contact: {},
      team_name: {
        get: (row: any) => {
          if (row.team) {
            if (teamsMap[row.team.id]) {
              return teamsMap[row.team.id].name
            }
          }
          return ''
        },
        extended: true,
      }
    }

    this.printTable(business_services, columns, this.flags)
  }
}
