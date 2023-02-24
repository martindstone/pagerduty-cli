import { AuthenticatedBaseCommand } from '../../base/authenticated-base-command'
import { CliUx, Flags } from '@oclif/core'
import { PD } from '../../pd'

export default class EpListDeletedUsers extends AuthenticatedBaseCommand<typeof EpListDeletedUsers> {
  static description = 'List deleted users in all PagerDuty Escalation Policies'

  static flags = {
    ...CliUx.ux.table.Flags,
  }

  async run() {
    const eps = await this.pd.fetchWithSpinner('escalation_policies', {
      activityDescription: 'Getting escalation policies',
    })

    const deleted_users: any[] = []
    for (const ep of eps) {
      const {
        id: ep_id,
        summary: ep_name,
        escalation_rules
      } = ep
      for (const [rule_idx, escalation_rule] of escalation_rules.entries()) {
        const deleted_in_rule = escalation_rule.targets.filter((x: any) => x.type === 'user_reference' && x.deleted_at)
          .map((x: any) => ({ep_id, ep_name, ep_level: rule_idx + 1, ...x}))
        deleted_users.push(...deleted_in_rule)
      }
    }

    const columns = {
      ep_id: {},
      ep_name: {},
      ep_level: {},
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
