import Command from '../../base'
import {flags} from '@oclif/command'
import cli from 'cli-ux'
import chalk from 'chalk'
import getStream from 'get-stream'
import * as utils from '../../utils'

export default class ScheduleOpen extends Command {
  static description = 'Open PagerDuty Schedules in the browser'

  static flags = {
    ...Command.flags,
    name: flags.string({
      char: 'n',
      description: 'Open schedules matching this string.',
      exclusive: ['ids', 'pipe'],
    }),
    ids: flags.string({
      char: 'i',
      description: 'The IDs of schedules to open.',
      exclusive: ['name', 'pipe'],
      multiple: true,
    }),
    pipe: flags.boolean({
      char: 'p',
      description: 'Read schedule ID\'s from stdin.',
      exclusive: ['ids', 'name'],
    }),
  }

  async run() {
    const {flags} = this.parse(ScheduleOpen)

    const params: Record<string, any> = {}

    let schedule_ids = []
    if (flags.name) {
      params.query = flags.name
      cli.action.start('Finding schedules in PD')
      const schedules = await this.pd.fetch('schedules', {params: params})
      if (schedules.length === 0) {
        cli.action.stop(chalk.bold.red('no schedules found matching ') + chalk.bold.blue(flags.name))
        this.exit(0)
      }
      for (const schedule of schedules) {
        schedule_ids.push(schedule.id)
      }
    } else if (flags.ids) {
      const invalid_ids = utils.invalidPagerDutyIDs(flags.ids)
      if (invalid_ids.length > 0) {
        this.error(`Invalid schedule IDs ${chalk.bold.blue(invalid_ids.join(', '))}`, {exit: 1})
      }
      schedule_ids = flags.ids
    } else if (flags.pipe) {
      const str: string = await getStream(process.stdin)
      schedule_ids = utils.splitDedupAndFlatten([str])
    } else {
      this.error('You must specify one of: -i, -n, -p', {exit: 1})
    }
    if (schedule_ids.length === 0) {
      cli.action.stop(chalk.bold.red('no schedules specified'))
      this.exit(0)
    }
    cli.action.start('Finding your PD domain')
    const domain = await this.pd.domain()

    cli.action.start('Opening your browser')
    try {
      for (const schedule_id of schedule_ids) {
        cli.open(`https://${domain}.pagerduty.com/schedules/${schedule_id}`)
      }
    } catch (error) {
      cli.action.stop(chalk.bold.red('failed!'))
      this.error('Couldn\'t open browser. Are you running as root?', {exit: 1})
    }
    cli.action.stop(chalk.bold.green('done'))
  }
}
