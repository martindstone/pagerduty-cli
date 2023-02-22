import { AuthenticatedBaseCommand } from '../../../base/authenticated-base-command'
import { CliUx, Flags } from '@oclif/core'
import chalk from 'chalk'
import getStream from 'get-stream'
import * as utils from '../../../utils'
import { PD } from '../../../pd'

export default class IncidentSubscriberList extends AuthenticatedBaseCommand<typeof IncidentSubscriberList> {
  static description = 'List Responders on PagerDuty Incidents'

  static flags = {
    me: Flags.boolean({
      char: 'm',
      description: 'List subscribers on all incidents that are currently assigned to me',
      exclusive: ['ids', 'pipe'],
    }),
    ids: Flags.string({
      char: 'i',
      description: 'Incident ID\'s to list subscribers on. Specify multiple times for multiple incidents.',
      multiple: true,
      exclusive: ['me', 'pipe'],
    }),
    pipe: Flags.boolean({
      char: 'p',
      description: 'Read incident ID\'s from stdin.',
      exclusive: ['me', 'ids'],
    }),
    ...CliUx.ux.table.Flags,
  }

  async run() {
    this.pd.silent = true

    if (!(this.flags.ids || this.flags.me || this.flags.pipe)) {
      this.error('You must specify one of: -i, -m, -p', { exit: 1 })
    }

    let incident_ids: string[] = []
    if (this.flags.me) {
      const me = await this.me(true)
      const params = { user_ids: [me.user.id] }
      CliUx.ux.action.start('Getting incidents from PD')
      const incidents = await this.pd.fetch('incidents', { params: params })

      if (incidents.length === 0) {
        CliUx.ux.action.stop(chalk.bold.red('none found'))
        this.exit(1)
      }
      incident_ids = incidents.map((e: { id: any }) => e.id)
    } else if (this.flags.ids) {
      incident_ids = utils.splitDedupAndFlatten(this.flags.ids)
    } else if (this.flags.pipe) {
      const str: string = await getStream(process.stdin)
      incident_ids = utils.splitDedupAndFlatten([str])
    }

    if (incident_ids.length === 0) {
      this.error('No incidents to list subscribers on', {exit: 1})
    }

    let invalid_ids = utils.invalidPagerDutyIDs(incident_ids)
    if (invalid_ids && invalid_ids.length > 0) {
      this.error(`Invalid incident ID's: ${invalid_ids.join(', ')}`, { exit: 1 })
    }

    const users = await this.pd.fetchWithSpinner('users', {
      activityDescription: 'Getting users',
      stopSpinnerWhenDone: false,
    })
    const usersMap = Object.assign({}, ...users.map(x => ({[x.id]: x})))

    const teams = await this.pd.fetchWithSpinner('teams', {
      activityDescription: 'Getting teams',
      stopSpinnerWhenDone: false,
    })
    const teamsMap = Object.assign({}, ...teams.map(x => ({[x.id]: x})))

    const subscriberLookup: Record<string, Record<string, any>> = {
      user: usersMap,
      team: teamsMap,
    }

    const rows: any[] = []
    for (const incident_id of incident_ids) {
      let subs = await this.pd.fetchWithSpinner(`incidents/${incident_id}/status_updates/subscribers`, {
        activityDescription: `Getting subscribers for incident ${chalk.bold.blue(incident_id)}`,
        stopSpinnerWhenDone: false
      })
      subs = subs.map(x => ({
        ...x,
        incident_id,
        subscriber: subscriberLookup[x.subscriber_type][x.subscriber_id]
      }))
      rows.push(...subs)
    }
    CliUx.ux.action.stop(chalk.bold.green('done'))

    // await this.printJsonAndExit(rows)

    const columns: Record<string, any> = {
      incident_id: {
      },
      subscriber_id: {
      },
      subscriber_name: {
        get: (row: any) => row.subscriber?.summary || 'unknown',
      },
      subscriber_type: {
      },
    }

    const flags: any = {
      ...this.flags,
    }
    if (flags.pipe) flags.pipe = 'input'

    if (!flags.keys) flags.keys = []
    flags.keys.unshift('Subscribed via=subscribed_via[*].type', 'Subscribed via ID=subscribed_via[*].id')

    this.printTable(rows, columns, flags)
  }
}
