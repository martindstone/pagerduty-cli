import Command from '../../base'
import {flags} from '@oclif/command'
import chalk from 'chalk'
import cli from 'cli-ux'
import getStream from 'get-stream'
import * as pd from '../../pd'
import * as utils from '../../utils'

export default class IncidentResolve extends Command {
  static description = 'Resolve PagerDuty Incidents'

  static flags = {
    ...Command.flags,
    me: flags.boolean({
      char: 'm',
      description: 'Resolve all incidents assigned to me',
      exclusive: ['ids', 'pipe'],
    }),
    ids: flags.string({
      char: 'i',
      description: 'Incident ID\'s to resolve. Specify multiple times for multiple incidents.',
      multiple: true,
      exclusive: ['me', 'pipe'],
    }),
    pipe: flags.boolean({
      char: 'p',
      description: 'Read incident ID\'s from stdin.',
      exclusive: ['me', 'ids'],
    }),
  }

  async run() {
    const {flags} = this.parse(IncidentResolve)

    // get a validated token from base class
    const token = this.token as string

    let incident_ids: string[] = []
    if (flags.me) {
      let r = await pd.me(token)
      if (r.isFailure) {
        cli.action.stop(chalk.bold.red('failed!'))
        this.error(`Request to /users/me failed: ${r.error}`, {exit: 1})
      }
      const me = r.getValue()

      const params = {user_ids: [me.user.id]}
      cli.action.start('Getting incidents from PD')
      r = await pd.fetch(token, '/incidents', params)
      if (r.isFailure) {
        cli.action.stop(chalk.bold.red('failed!'))
        this.error(`Request to list incidents failed: ${r.error}`, {exit: 1})
      }
      const incidents = r.getValue()
      if (incidents.length === 0) {
        cli.action.stop(chalk.bold.red('none found'))
        return
      }
      cli.action.stop(`got ${incidents.length} before filtering`)
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

    const requests: any[] = []
    cli.action.start(`Resolving incident(s) ${chalk.bold.blue(incident_ids.join(', '))}`)
    for (const incident_id of incident_ids) {
      const body: Record<string, any> = pd.putBodyForSetAttribute('incident', incident_id, 'status', 'resolved')
      requests.push({
        token: token,
        endpoint: `/incidents/${incident_id}`,
        method: 'PUT',
        params: {},
        data: body,
      })
    }
    const r = await pd.batchedRequest(requests)
    if (r.isFailure) {
      cli.action.stop(chalk.bold.red('failed!'))
      this.error(`Resolve request failed: ${r.error}`)
    }
    const returnedIncidents = r.getValue()
    const failed = []
    for (const r of returnedIncidents) {
      if (!(r && r.incident && r.incident.status && r.incident.status === 'resolved')) {
        failed.push(r.incident.id)
      }
    }
    if (failed.length > 0) {
      cli.action.stop(chalk.bold.red('failed!'))
      this.error(`Resolve request failed for incidents ${chalk.bold.red(failed.join(', '))}`)
    } else {
      cli.action.stop(chalk.bold.green('done'))
    }
  }
}
