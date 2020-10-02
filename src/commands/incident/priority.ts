import Command from '../../base'
import {flags} from '@oclif/command'
import chalk from 'chalk'
import cli from 'cli-ux'
import getStream from 'get-stream'
import * as pd from '../../pd'
import * as utils from '../../utils'

export default class IncidentPriority extends Command {
  static description = 'Set priority on PagerDuty Incidents'

  static flags = {
    ...Command.flags,
    me: flags.boolean({
      char: 'm',
      description: 'Set priority on all incidents assigned to me',
      exclusive: ['ids'],
    }),
    ids: flags.string({
      char: 'i',
      description: 'Incident ID\'s to set priority on. Specify multiple times for multiple incidents.',
      multiple: true,
      exclusive: ['me'],
    }),
    priority: flags.string({
      char: 'n',
      description: 'The name of the priority to set.',
      required: true,
    }),
    pipe: flags.boolean({
      char: 'p',
      description: 'Read incident ID\'s from stdin.',
      exclusive: ['me', 'ids'],
    }),
  }

  async run() {
    const {flags} = this.parse(IncidentPriority)

    // get a validated token from base class
    const token = this.token as string

    let incident_ids: string[] = []
    if (flags.me) {
      const me = await pd.me(token)
      if (!me) {
        this.error('You can\'t use --me with a legacy API token.', {
          exit: 1,
          suggestions: ['pd auth:set', 'pd auth:web'],
        })
      }
      const params = {user_ids: [me.user.id]}
      cli.action.start('Getting incidents from PD')
      const incidents = await pd.fetch(token, '/incidents', params)
      if (incidents.length === 0) {
        cli.action.stop(chalk.bold.red('none found'))
        return
      }
      cli.action.stop(`got ${incidents.length}`)
      incident_ids = incidents.map((e: { id: any }) => e.id)
    } else if (flags.ids) {
      incident_ids = utils.splitDedupAndFlatten(flags.ids)
    } else if (flags.pipe) {
      const str: string = await getStream(process.stdin)
      incident_ids = utils.splitDedupAndFlatten([str])
    } else {
      this.error('You must specify one of: -i, -m, -p', {exit: 1})
    }

    const invalid_ids = utils.invalidPagerDutyIDs(incident_ids)
    if (invalid_ids && invalid_ids.length > 0) {
      this.error(`Invalid incident ID's: ${invalid_ids.join(', ')}`, {exit: 1})
    }

    cli.action.start('Getting incident priorities from PD')
    const priorities = await pd.fetch(token, '/priorities')
    const filtered_priorities: string[] = priorities
    .filter((e: any) => e.name === flags.priority)
    .map((e: any) => e.id)
    if (filtered_priorities.length === 0) {
      cli.action.stop('failed!')
      this.error(`No incident priority matches name ${flags.priority}`, {exit: 1})
    }
    if (filtered_priorities.length > 1) {
      cli.action.stop('failed!')
      this.error(`More than one incident priority matches name ${flags.priority}`, {exit: 1})
    }
    const priority_id = filtered_priorities[0]
    const requests: any[] = []
    cli.action.start(`Setting priority ${chalk.bold.blue(`${flags.priority} (${priority_id})`)} on incident(s) ${chalk.bold.blue(incident_ids.join(', '))}`)
    for (const incident_id of incident_ids) {
      const body = {
        incident: {
          type: 'incident_reference',
          priority: {
            id: priority_id,
            type: 'priority_reference',
          },
        },
      }
      requests.push({
        token: token,
        endpoint: `/incidents/${incident_id}`,
        method: 'PUT',
        params: {},
        data: body,
      })
    }
    const rs = await pd.batchedRequest(requests)
    let failed = false
    for (const r of rs) {
      if (!(r && r.incident && r.incident.priority && r.incident.priority.name === flags.priority)) {
        failed = true
      }
    }
    if (failed) {
      cli.action.stop(chalk.bold.red('failed!'))
    } else {
      cli.action.stop(chalk.bold.green('done'))
    }
  }
}
