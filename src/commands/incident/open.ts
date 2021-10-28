import Command from '../../base'
import {flags} from '@oclif/command'
import chalk from 'chalk'
import cli from 'cli-ux'
import getStream from 'get-stream'
import * as utils from '../../utils'

export default class IncidentOpen extends Command {
  static description = 'Open PagerDuty Incidents in your browser'

  static flags = {
    ...Command.flags,
    me: flags.boolean({
      char: 'm',
      description: 'Open all incidents assigned to me',
      exclusive: ['ids'],
    }),
    ids: flags.string({
      char: 'i',
      description: 'Incident ID\'s to open. Specify multiple times for multiple incidents.',
      multiple: true,
      exclusive: ['me'],
    }),
    pipe: flags.boolean({
      char: 'p',
      description: 'Read incident ID\'s from stdin.',
      exclusive: ['me', 'ids'],
    }),
  }

  async run() {
    const {flags} = this.parse(IncidentOpen)

    let incident_ids = []

    if (flags.me) {
      const me = await this.me(true)
      const params = {user_ids: [me.user.id]}
      const incidents = await this.pd.fetchWithSpinner('incidents', {params: params, activityDescription: 'Getting incidents from PD'})
      if (incidents.length === 0) {
        this.error('No incidents found.', {exit: 1})
      }
      incident_ids = incidents.map((e: { id: any }) => e.id)
    } else if (flags.ids || flags.pipe) {
      if (flags.ids) {
        incident_ids = utils.splitDedupAndFlatten(flags.ids)
      } else if (flags.pipe) {
        const str: string = await getStream(process.stdin)
        incident_ids = utils.splitDedupAndFlatten([str])
      }
    } else {
      this.error('You must specify one of: -i, -m, -p', {exit: 1})
    }

    cli.action.start('Finding your PD domain')
    const domain = await this.pd.domain()

    this.log('Incident URLs:')
    const urlstrings: string[] = incident_ids.map(x => chalk.bold.blue(`https://${domain}.pagerduty.com/incidents/${x}`))
    this.log(urlstrings.join('\n') + '\n')

    cli.action.start(`Opening ${incident_ids.length} incidents in the browser`)

    try {
      for (const incident_id of incident_ids) {
        await cli.open(`https://${domain}.pagerduty.com/incidents/${incident_id}`)
      }
    } catch (error) {
      cli.action.stop(chalk.bold.red('failed!'))
      this.error('Couldn\'t open your browser. Are you running as root?', {exit: 1})
    }

    cli.action.stop(chalk.bold.green('done'))
  }
}
