import { AuthenticatedBaseCommand } from '../../base/authenticated-base-command'
import { CliUx, Flags } from '@oclif/core'
import { PD } from '../../pd'

export default class ScheduleListDeletedUsers extends AuthenticatedBaseCommand<typeof ScheduleListDeletedUsers> {
  static description = 'List deleted users in all PagerDuty Schedules'

  static flags = {
    ...CliUx.ux.table.Flags,
  }

  async run() {
    const schedule_list = await this.pd.fetchWithSpinner('schedules', {
      activityDescription: 'Getting schedules',
      stopSpinnerWhenDone: false,
    })
    const schedule_ids = schedule_list.map(x => x.id)
    const requests: PD.Request[] = []
    for (const schedule_id of schedule_ids) {
      requests.push({
        endpoint: `schedules/${schedule_id}`,
        method: 'GET',
        params: { overflow: true },
      })
    }
    let r = await this.pd.batchedRequestWithSpinner(requests, {
      activityDescription: 'Getting schedules',
    })
    const schedules = r.getDatas()

    const deleted_users: any[] = []
    for (const schedule of schedules) {
      const {
        name: schedule_name,
        id: schedule_id,
        schedule_layers,
      } = schedule.schedule
      for (const layer of schedule_layers) {
        const {
          name: layer_name,
          users,
        } = layer
        const deleted_in_layer = users.filter((x: any) => x.user.deleted_at)
          .map((x: any) => ({schedule_id, schedule_name, layer_name, ...x.user}))
        deleted_users.push(...deleted_in_layer)
      }
    }

    const columns = {
      schedule_id: {},
      schedule_name: {},
      layer_name: {},
      user_id: {
        get: (row: any) => row.id,
      },
      user_name: {
        get: (row: any) => row.summary,
      },
      deleted_at: {
        get: (row: any) => (new Date(row.deleted_at)).toLocaleString(),
      }
    }

    this.printTable(deleted_users, columns, this.flags)
  }
}
