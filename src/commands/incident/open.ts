import { AuthenticatedBaseCommand } from '../../base/authenticated-base-command'
import { CliUx, Flags } from '@oclif/core'
import chalk from 'chalk'
import getStream from 'get-stream'
import * as utils from '../../utils'

export default class IncidentOpen extends AuthenticatedBaseCommand<typeof IncidentOpen> {
  static description = 'Open PagerDuty Incidents in your browser'

  static flags = {
    me: Flags.boolean({
      char: 'm',
      description: 'Open all incidents assigned to me',
      exclusive: ['ids'],
    }),
    ids: Flags.string({
      char: 'i',
      description: 'Incident ID\'s to open. Specify multiple times for multiple incidents.',
      multiple: true,
      exclusive: ['me'],
    }),
    pipe: Flags.boolean({
      char: 'p',
      description: 'Read incident ID\'s from stdin.',
      exclusive: ['me', 'ids'],
    }),
  }

  async run() {
    let incident_ids = []

    if (this.flags.me) {
      const me = await this.me(true)
      const params = { user_ids: [me.user.id] }
      const incidents = await this.pd.fetchWithSpinner('incidents', { params: params, activityDescription: 'Getting incidents from PD' })
      if (incidents.length === 0) {
        this.error('No incidents found.', { exit: 1 })
      }
      incident_ids = incidents.map((e: { id: any }) => e.id)
    } else if (this.flags.ids || this.flags.pipe) {
      if (this.flags.ids) {
        incident_ids = utils.splitDedupAndFlatten(this.flags.ids)
      } else if (this.flags.pipe) {
        const str: string = await getStream(process.stdin)
        incident_ids = utils.splitDedupAndFlatten([str])
      }
    } else {
      this.error('You must specify one of: -i, -m, -p', { exit: 1 })
    }

    CliUx.ux.action.start('Finding your PD domain')
    const domain = await this.pd.domain()

    this.log('Incident URLs:')
    const urlstrings: string[] = incident_ids.map(x => chalk.bold.blue(`https://${domain}.pagerduty.com/incidents/${x}`))
    this.log(urlstrings.join('\n') + '\n')

    CliUx.ux.action.start(`Opening ${incident_ids.length} incidents in the browser`)

    try {
      for (const incident_id of incident_ids) {
        await CliUx.ux.open(`https://${domain}.pagerduty.com/incidents/${incident_id}`)
      }
    } catch (error) {
      CliUx.ux.action.stop(chalk.bold.red('failed!'))
      this.error('Couldn\'t open your browser. Are you running as root?', { exit: 1 })
    }

    CliUx.ux.action.stop(chalk.bold.green('done'))
  }
}
