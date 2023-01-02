import { AuthenticatedBaseCommand } from '../../base/authenticated-base-command'
import { CliUx, Flags } from '@oclif/core'
import chalk from 'chalk'
import getStream from 'get-stream'
import * as utils from '../../utils'

export default class ScheduleOpen extends AuthenticatedBaseCommand<typeof ScheduleOpen> {
  static description = 'Open PagerDuty Schedules in the browser'

  static flags = {
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
    const params: Record<string, any> = {}

    let schedule_ids = []
    if (this.flags.name) {
      params.query = this.flags.name
      CliUx.ux.action.start('Finding schedules in PD')
      const schedules = await this.pd.fetch('schedules', { params: params })
      if (schedules.length === 0) {
        CliUx.ux.action.stop(chalk.bold.red('no schedules found matching ') + chalk.bold.blue(this.flags.name))
        this.exit(0)
      }
      for (const schedule of schedules) {
        schedule_ids.push(schedule.id)
      }
    } else if (this.flags.ids) {
      const invalid_ids = utils.invalidPagerDutyIDs(this.flags.ids)
      if (invalid_ids.length > 0) {
        this.error(`Invalid schedule IDs ${chalk.bold.blue(invalid_ids.join(', '))}`, { exit: 1 })
      }
      schedule_ids = this.flags.ids
    } else if (this.flags.pipe) {
      const str: string = await getStream(process.stdin)
      schedule_ids = utils.splitDedupAndFlatten([str])
    } else {
      this.error('You must specify one of: -i, -n, -p', { exit: 1 })
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
      this.error('Couldn\'t open browser. Are you running as root?', { exit: 1 })
    }
    CliUx.ux.action.stop(chalk.bold.green('done'))
  }
}
