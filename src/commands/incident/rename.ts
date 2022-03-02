/* eslint-disable complexity */
import Command from '../../base'
import {CliUx, Flags} from '@oclif/core'
import chalk from 'chalk'
import getStream from 'get-stream'
import * as utils from '../../utils'

export default class IncidentRename extends Command {
  static description = 'Rename (change the title of) PagerDuty Incidents'

  static flags = {
    ...Command.flags,
    me: Flags.boolean({
      char: 'm',
      description: 'Rename all incidents that are currently assigned to me',
      exclusive: ['ids', 'pipe'],
    }),
    ids: Flags.string({
      char: 'i',
      description: 'Incident ID\'s to rename. Specify multiple times for multiple incidents.',
      multiple: true,
      exclusive: ['me', 'pipe'],
    }),
    title: Flags.string({
      char: 't',
      description: 'Set the incident title to this string',
      exclusive: ['prefix'],
    }),
    prefix: Flags.string({
      description: 'Prefix the incident title with this string',
      exclusive: ['title'],
    }),
    from: Flags.string({
      char: 'F',
      description: 'Login email of a PD user account for the "From:" header. Use only with legacy API tokens.',
    }),
    pipe: Flags.boolean({
      char: 'p',
      description: 'Read incident ID\'s from stdin.',
      exclusive: ['me', 'ids'],
    }),
  }

  async run() {

    const {flags} = await this.parse(IncidentRename)

    if (!(flags.title || flags.prefix)) {
      this.error('You must specify --title or --prefix')
    }

    const headers: Record<string, string> = {}
    if (flags.from) {
      headers.From = flags.from
    }

    let incident_ids: string[] = []
    let incidents: any[] = []

    if (flags.me) {
      const me = await this.me(true)
      const params = {user_ids: [me.user.id]}
      CliUx.ux.action.start('Getting incidents from PD')
      incidents = await this.pd.fetch('incidents', {params: params})

      if (incidents.length === 0) {
        CliUx.ux.action.stop(chalk.bold.red('none found'))
        this.exit(1)
      }
      incident_ids = incidents.map((e: { id: any }) => e.id)
    } else if (flags.ids) {
      incident_ids = utils.splitDedupAndFlatten(flags.ids)
    } else if (flags.pipe) {
      const str: string = await getStream(process.stdin)
      incident_ids = utils.splitDedupAndFlatten([str])
    } else {
      this.error('You must specify one of: -i, -m, -p', {exit: 1})
    }

    if (flags.prefix && (flags.ids || flags.pipe)) {
      const requests: any[] = []
      for (const incident_id of incident_ids) {
        requests.push({
          endpoint: `incidents/${incident_id}`,
          method: 'GET',
        })
      }
      const r = await this.pd.batchedRequestWithSpinner(requests, {activityDescription: `Getting incidents`})
      const fetched_incidents = r.getDatas()
      for (const fetched_incident of fetched_incidents) {
        incidents = [...incidents, fetched_incident.incident]
      }
    }
    const incident_titles: Record<string, any> = {}
    if (flags.prefix) {
      for (const incident of incidents) {
        incident_titles[incident.id] = incident.title
      }
    }

    let invalid_ids = utils.invalidPagerDutyIDs(incident_ids)
    if (invalid_ids && invalid_ids.length > 0) {
      this.error(`Invalid incident ID's: ${invalid_ids.join(', ')}`, {exit: 1})
    }

    const requests: any[] = []
    for (const incident_id of incident_ids) {
      let title: string
      if (flags.prefix) {
        title = `${flags.prefix}${incident_titles[incident_id]}`
      } else {
        title = flags.title as string
      }
      requests.push({
        endpoint: `/incidents/${incident_id}`,
        method: 'PUT',
        params: {},
        data: {
          incident: {
            type: 'incident_reference',
            title
          }
        },
        headers: headers,
      })
    }

    const r = await this.pd.batchedRequestWithSpinner(requests, {activityDescription: `Renaming incidents`})
    for (const failure of r.getFailedIndices()) {
      // eslint-disable-next-line no-console
      console.error(`${chalk.bold.red('Failed to update incident ')}${chalk.bold.blue(requests[failure].data.incident.id)}: ${r.results[failure].getFormattedError()}`)
    }
  }
}
