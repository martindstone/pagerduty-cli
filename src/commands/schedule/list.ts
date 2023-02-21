import { ListBaseCommand } from '../../base/list-base-command'

export default class ScheduleList extends ListBaseCommand<typeof ScheduleList> {
  static pdObjectName = 'schedule'
  static pdObjectNamePlural = 'schedules'
  static description = 'List PagerDuty Schedules'

  async run() {
    const params: Record<string, any> = {}

    if (this.flags.name) {
      params.query = this.flags.name
    }

    const schedules = await this.pd.fetchWithSpinner('schedules', {
      params: params,
      activityDescription: 'Getting schedules from PD',
      fetchLimit: this.flags.limit,
    })
    if (schedules.length === 0) {
      this.error('No schedules found.', { exit: 1 })
    }

    if (this.flags.json) {
      await this.printJsonAndExit(schedules)
    }

    const columns: Record<string, object> = {
      id: {
        header: 'ID',
      },
      name: {
        header: 'Name',
      },
      users: {
        get: (row: { users: any[] }) => row.users.map((e: any) => e.summary).join(this.flags.delimiter),
      },
      escalation_policies: {
        get: (row: { escalation_policies: any[] }) => row.escalation_policies.map((e: any) => e.summary).join(this.flags.delimiter),
      },
      team_names: {
        get: (row: { teams: any[] }) => row.teams.map((e: any) => e.summary).join(this.flags.delimiter),
        extended: true,
      },
    }

    this.printTable(schedules, columns, this.flags)
  }
}
