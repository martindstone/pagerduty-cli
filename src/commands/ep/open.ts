import Command from '../../base'
import {flags} from '@oclif/command'
import cli from 'cli-ux'
import chalk from 'chalk'
import getStream from 'get-stream'
import * as pd from '../../pd'
import * as utils from '../../utils'

export default class EpOpen extends Command {
  static description = 'Open PagerDuty Escalation policies in the browser'

  static flags = {
    ...Command.flags,
    name: flags.string({
      char: 'n',
      description: 'Open escalation policies whose names match this string.',
      exclusive: ['ids', 'pipe'],
    }),
    ids: flags.string({
      char: 'i',
      description: 'The IDs of escalation policies to open.',
      exclusive: ['name', 'pipe'],
      multiple: true,
    }),
    pipe: flags.boolean({
      char: 'p',
      description: 'Read escalation policy ID\'s from stdin.',
      exclusive: ['ids', 'name'],
    }),
  }

  async run() {
    const {flags} = this.parse(EpOpen)

    // get a validated token from base class
    const token = this.token

    const params: Record<string, any> = {}

    if (!([flags.name, flags.ids, flags.pipe].some(Boolean))) {
      this.error('You must specify one of: -i, -n, -p', {exit: 1})
    }
    let ep_ids: string[] = []
    if (flags.name) {
      params.query = flags.name
      cli.action.start('Finding escalation policies in PD')
      const r = await pd.fetch(token, '/escalation_policies', params)
      this.dieIfFailed(r)
      const eps = r.getValue()
      if (eps.length === 0) {
        cli.action.stop(chalk.bold.red('no escalation policies found matching ') + chalk.bold.blue(flags.name))
        this.exit(0)
      }
      ep_ids = [...ep_ids, ...eps.map((ep: {id: string}) => ep.id)]
    }
    if (flags.ids) {
      ep_ids = [...ep_ids, ...flags.ids]
    }
    if (flags.pipe) {
      const str: string = await getStream(process.stdin)
      ep_ids = [...ep_ids, ...utils.splitDedupAndFlatten([str])]
    }

    const invalid_ids = utils.invalidPagerDutyIDs(ep_ids)
    if (invalid_ids.length > 0) {
      this.error(`Invalid escalation policy IDs ${chalk.bold.blue(invalid_ids.join(', '))}`, {exit: 1})
    }

    if (ep_ids.length === 0) {
      this.error('No escalation policies specified', {exit: 1})
    }
    cli.action.start('Finding domain in PD')
    const r = await pd.fetch(token, 'users', {limit: 1})
    this.dieIfFailed(r)
    cli.action.stop(chalk.bold.green('done'))
    const users = r.getValue()
    const domain = users[0].html_url.match(/https:\/\/(.*)\.pagerduty.com\/.*/)[1]

    cli.action.start(`Opening browser for escalation policies ${chalk.bold.blue(ep_ids.join(', '))}`)
    try {
      for (const ep_id of ep_ids) {
        cli.open(`https://${domain}.pagerduty.com/escalation_policies/${ep_id}`)
      }
    } catch (error) {
      cli.action.stop(chalk.bold.red('failed'))
      this.error('Couldn\'t open browser. Are you running as root?', {exit: 1})
    }
    cli.action.stop(chalk.bold.green('done'))
  }
}
