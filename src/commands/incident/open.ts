import Command from '../../base'
import {flags} from '@oclif/command'
import chalk from 'chalk'
import cli from 'cli-ux'
import getStream from 'get-stream'
import * as pd from '../../pd'
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

    // get a validated token from base class
    const token = this.token as string

    if (flags.me) {
      const me = await this.me()
      const domain = me.user.html_url.match(/https:\/\/(.*)\.pagerduty.com\/.*/)[1]
      const params = {user_ids: [me.user.id]}
      cli.action.start('Getting incidents from PD')
      const r = await pd.fetch(token, '/incidents', params)
      this.dieIfFailed(r)
      const incidents = r.getValue()
      if (incidents.length === 0) {
        cli.action.stop(chalk.bold.red('none found'))
        return
      }
      cli.action.stop(`got ${incidents.length}`)
      const incident_ids = incidents.map((e: { id: any }) => e.id)
      try {
        for (const incident_id of incident_ids) {
          cli.open(`https://${domain}.pagerduty.com/incidents/${incident_id}`)
        }
      } catch (error) {
        this.error('Couldn\'t open browser. Are you running as root?', {exit: 1})
      }
    } else if (flags.ids || flags.pipe) {
      cli.action.start('Finding your PD domain')
      const r = await pd.fetch(token, '/users', {limit: 1})
      this.dieIfFailed(r)
      const users = r.getValue()
      const domain = users[0].html_url.match(/https:\/\/(.*)\.pagerduty.com\/.*/)[1]
      let ids: string[] = []
      if (flags.ids) {
        ids = utils.splitDedupAndFlatten(flags.ids)
      } else if (flags.pipe) {
        const str: string = await getStream(process.stdin)
        ids = utils.splitDedupAndFlatten([str])
      }
      try {
        for (const incident_id of ids) {
          cli.open(`https://${domain}.pagerduty.com/incidents/${incident_id}`)
        }
      } catch (error) {
        this.error('Couldn\'t open browser. Are you running as root?', {exit: 1})
      }
    } else {
      this.error('You must specify one of: -i, -m, -p', {exit: 1})
    }
  }
}
