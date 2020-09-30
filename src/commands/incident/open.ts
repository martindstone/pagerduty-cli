import Command from '../../base'
import {flags} from '@oclif/command'
import chalk from 'chalk'
import cli from 'cli-ux'
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
  }

  async run() {
    const {flags} = this.parse(IncidentOpen)

    // get a validated token from base class
    const token = this.token as string

    if (flags.me) {
      const me = await pd.me(token)
      if (!me) {
        this.error('You can\'t use --me with a legacy API token.', {
          exit: 1,
          suggestions: ['pd auth:set', 'pd auth:web'],
        })
      }
      const domain = me.user.html_url.match(/https:\/\/(.*)\.pagerduty.com\/.*/)[1]
      const params = {user_ids: [me.user.id]}
      cli.action.start('Getting incidents from PD')
      const incidents = await pd.fetch(token, '/incidents', params)
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
    } else if (flags.ids) {
      const users = await pd.fetch(token, '/users', {limit: 1})
      const domain = users[0].html_url.match(/https:\/\/(.*)\.pagerduty.com\/.*/)[1]
      const ids = utils.splitStringArrayOnWhitespace(flags.ids)
      try {
        for (const incident_id of ids) {
          cli.open(`https://${domain}.pagerduty.com/incidents/${incident_id}`)
        }
      } catch (error) {
        this.error('Couldn\'t open browser. Are you running as root?', {exit: 1})
      }
    } else {
      this.error('You must specify one of: -i, -m', {exit: 1})
    }
  }
}
