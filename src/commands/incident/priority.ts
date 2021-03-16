import Command from '../../base'
import {flags} from '@oclif/command'
import chalk from 'chalk'
import cli from 'cli-ux'
import getStream from 'get-stream'
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
    from: flags.string({
      char: 'F',
      description: 'Login email of a PD user account for the "From:" header. Use only with legacy API tokens.',
    }),
    pipe: flags.boolean({
      char: 'p',
      description: 'Read incident ID\'s from stdin.',
      exclusive: ['me', 'ids'],
    }),
  }

  async run() {
    const {flags} = this.parse(IncidentPriority)

    const headers: Record<string, string> = {}
    if (flags.from) {
      headers.From = flags.from
    }

    let incident_ids: string[] = []
    if (flags.me) {
      const me = await this.me(true)

      const params = {user_ids: [me.user.id]}

      cli.action.start('Getting incidents from PD')
      const incidents = await this.pd.fetch('incidents', {params: params})
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
    const priorities_map = await this.pd.getPrioritiesMapByName()
    if (priorities_map === {}) {
      cli.action.stop(chalk.bold.red('none found'))
      this.error('No incident priorities were found. Is the priority feature enabled?', {exit: 1})
    }

    if (!(flags.priority in priorities_map)) {
      cli.action.stop('failed!')
      this.error(`No incident priority matches name ${flags.priority}`, {exit: 1})
    }

    const priority_id = priorities_map[flags.priority].id
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
        endpoint: `incidents/${incident_id}`,
        method: 'PUT',
        params: {},
        data: body,
        headers: headers,
      })
    }
    const r = await this.pd.batchedRequestWithSpinner(requests, {
      activityDescription: `Setting priority ${chalk.bold.blue(`${flags.priority} (${priority_id})`)} on ${incident_ids.length} incident(s)`,
    })
    for (const failure of r.getFailedIndices()) {
      // eslint-disable-next-line no-console
      console.error(`${chalk.bold.red('Failed to set priority on incident ')}${chalk.bold.blue(requests[failure].data.incident.id)}: ${r.results[failure].getFormattedError()}`)
    }
  }
}
