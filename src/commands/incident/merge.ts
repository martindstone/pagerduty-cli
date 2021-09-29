import Command from '../../base'
import {flags} from '@oclif/command'
import cli from 'cli-ux'
import chalk from 'chalk'
import getStream from 'get-stream'
import * as utils from '../../utils'

export default class IncidentMerge extends Command {
  static description = 'Merge PagerDuty Incidents'

  static flags = {
    ...Command.flags,
    ids: flags.string({
      char: 'i',
      description: 'Merge incidents with the given ID. Specify multiple times for multiple incidents. If -I is not given, the first incident in the list will be the parent incident.',
      exclusive: ['pipe'],
      multiple: true,
    }),
    parent_id: flags.string({
      char: 'I',
      description: 'Use this incident ID as the parent ID.',
    }),
    pipe: flags.boolean({
      char: 'p',
      description: 'Read incident IDs from stdin, for use with pipes. If -I is not given, the first incident ID from the pipe will be the parent incident.',
      exclusive: ['ids'],
    }),
    from: flags.string({
      char: 'F',
      description: 'Login email of a PD user account for the "From:" header. Use only with legacy API tokens.',
    }),
    open: flags.boolean({
      char: 'o',
      description: 'Open the merged incident in the browser',
    }),
  }

  async run() {
    const {flags} = this.parse(IncidentMerge)

    if (!flags.ids && !flags.pipe) {
      this.error('You must specify at least one of: -i, -p', {exit: 1})
    }

    const headers: Record<string, string> = {}
    if (flags.from) {
      headers.From = flags.from
    }

    let incident_ids: string[] = []

    if (flags.ids) {
      incident_ids = utils.splitDedupAndFlatten(flags.ids)
    } else if (flags.pipe) {
      const str: string = await getStream(process.stdin)
      incident_ids = utils.splitDedupAndFlatten([str])
    }

    let parent_id: string
    if (flags.parent_id) {
      parent_id = flags.parent_id
      if (incident_ids.includes(flags.parent_id)) {
        incident_ids.splice(incident_ids.indexOf(parent_id), 1)
      }
    } else {
      parent_id = incident_ids[0]
      incident_ids.splice(0, 1)
    }

    const invalid_ids = utils.invalidPagerDutyIDs(incident_ids)
    if (invalid_ids && invalid_ids.length > 0) {
      this.error(`Invalid incident ID's: ${invalid_ids.join(', ')}`, {exit: 1})
    }
    if (incident_ids.length === 0) {
      this.error('No valid IDs specified. Nothing to do.', {exit: 1})
    }

    const source_incidents = incident_ids.map(x => ({id: x, type: 'incident_reference'}))
    const data = {source_incidents}

    cli.action.start(`Merging ${chalk.bold.blue(incident_ids.length.toString())} incidents into parent incident ${chalk.bold.blue(parent_id)}`)

    const r = await this.pd.request({
      method: 'PUT',
      endpoint: `incidents/${parent_id}/merge`,
      data,
      headers,
    })

    if (r.isFailure) {
      cli.action.stop(chalk.bold.red('failed!'))
      this.error(`Couldn't merge incidents: ${r.getFormattedError()}`)
    }
    const returned_incident = r.getData()
    cli.action.stop(chalk.bold.green('done'))

    if (flags.open) {
      cli.action.start(`Opening ${chalk.bold.blue(returned_incident.incident.html_url)} in the browser`)
      try {
        cli.open(returned_incident.incident.html_url)
      } catch (error) {
        this.error('Couldn\'t open your browser. Are you running as root?', {exit: 1})
      }
      cli.action.stop(chalk.bold.green('done'))
    }
  }
}
