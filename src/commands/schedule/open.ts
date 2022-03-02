import Command from '../../base'
import {CliUx, Flags} from '@oclif/core'
import chalk from 'chalk'
import getStream from 'get-stream'
import * as utils from '../../utils'

export default class ScheduleOpen extends Command {
  static description = 'Open PagerDuty Schedules in the browser'

  static flags = {
    ...Command.flags,
    name: Flags.string({
      char: 'n',
      description: 'Open schedules matching this string.',
      exclusive: ['ids', 'pipe'],
    }),
    ids: Flags.string({
      char: 'i',
      description: 'The IDs of schedules to open.',
      exclusive: ['name', 'pipe'],
      multiple: true,
    }),
    pipe: Flags.boolean({
      char: 'p',
      description: 'Read schedule ID\'s from stdin.',
      exclusive: ['ids', 'name'],
    }),
  }

  async run() {
    const {flags} = await this.parse(ScheduleOpen)

    const params: Record<string, any> = {}

    let schedule_ids = []
    if (flags.name) {
      params.query = flags.name
      CliUx.ux.action.start('Finding schedules in PD')
      const schedules = await this.pd.fetch('schedules', {params: params})
      if (schedules.length === 0) {
        CliUx.ux.action.stop(chalk.bold.red('no schedules found matching ') + chalk.bold.blue(flags.name))
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
      CliUx.ux.action.stop(chalk.bold.red('no schedules specified'))
      this.exit(0)
    }
    CliUx.ux.action.start('Finding your PD domain')
    const domain = await this.pd.domain()

    this.log('Schedule URLs:')
    const urlstrings: string[] = schedule_ids.map(x => chalk.bold.blue(`https://${domain}.pagerduty.com/schedules/${x}`))
    this.log(urlstrings.join('\n') + '\n')

    CliUx.ux.action.start('Opening your browser')
    try {
      for (const schedule_id of schedule_ids) {
        await CliUx.ux.open(`https://${domain}.pagerduty.com/schedules/${schedule_id}`)
      }
    } catch (error) {
      CliUx.ux.action.stop(chalk.bold.red('failed!'))
      this.error('Couldn\'t open browser. Are you running as root?', {exit: 1})
    }
    CliUx.ux.action.stop(chalk.bold.green('done'))
  }
}
