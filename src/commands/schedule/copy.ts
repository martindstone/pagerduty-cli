import Command from '../../base'
import {flags} from '@oclif/command'
import cli from 'cli-ux'
import chalk from 'chalk'
import * as utils from '../../utils'

export default class ScheduleCopy extends Command {
  static description = 'Make a copy of a PagerDuty Schedule'

  static flags = {
    ...Command.flags,
    name: flags.string({
      char: 'n',
      description: 'The name of the schedule to copy.',
      exclusive: ['id'],
    }),
    id: flags.string({
      char: 'i',
      description: 'The ID of the schedule to copy.',
      exclusive: ['name'],
    }),
    destination: flags.string({
      char: 'd',
      description: 'The name for the new schedule',
    }),
    open: flags.boolean({
      char: 'o',
      description: 'Open the new schedule in the browser',
    }),
    pipe: flags.boolean({
      char: 'p',
      description: 'Print the new schedule ID only to stdout, for use with pipes.',
    }),
  }

  async run() {
    const {flags} = this.parse(ScheduleCopy)

    if (!([flags.name, flags.id].some(Boolean))) {
      this.error('You must specify one of: -i, -n', {exit: 1})
    }

    let schedule_id

    if (flags.name) {
      schedule_id = await this.pd.scheduleIDForName(flags.name)
      if (!schedule_id) {
        this.error(`No schedule was found with the name ${chalk.bold.blue(flags.name)}`, {exit: 1})
      }
    }
    if (flags.id) {
      schedule_id = flags.id
      if (utils.invalidPagerDutyIDs([schedule_id]).length > 0) {
        this.error(`Invalid schedule ID ${chalk.bold.blue(schedule_id)}`, {exit: 1})
      }
    }

    if (!schedule_id) {
      this.error('No schedule specified', {exit: 1})
    }

    cli.action.start(`Getting schedule ${chalk.bold.blue(schedule_id)}`)
    let r = await this.pd.request({
      endpoint: `schedules/${schedule_id}`,
      method: 'GET',
    })
    if (r.isFailure) {
      cli.action.stop(chalk.bold.red('failed!'))
      this.error(`Couldn't get schedule ${chalk.bold.blue(schedule_id)}: ${r.getFormattedError()}`)
    }

    const source_schedule = r.getData()
    const {time_zone, description, schedule_layers} = source_schedule.schedule
    const dest_schedule = {
      schedule: {
        overflow: true,
        type: 'schedule',
        name: flags.destination || `${flags.name} copy ${new Date()}`,
        time_zone: time_zone,
        description: description,
        schedule_layers: schedule_layers,
      },
    }
    cli.action.start(`Copying schedule ${chalk.bold.blue(schedule_id)}`)
    r = await this.pd.request({
      endpoint: 'schedules',
      method: 'POST',
      data: dest_schedule,
    })
    if (r.isFailure) {
      cli.action.stop(chalk.bold.red('failed!'))
      this.error(`Couldn't create schedule: ${r.getFormattedError()}`)
    }
    const returned_schedule = r.getData()
    cli.action.stop(chalk.bold.green('done'))

    if (flags.pipe) {
      this.log(returned_schedule.schedule.id)
    } else if (flags.open) {
      cli.action.start(`Opening ${chalk.bold.blue(returned_schedule.schedule.html_url)} in the browser`)
      try {
        await cli.open(returned_schedule.schedule.html_url)
      } catch (error) {
        cli.action.stop(chalk.bold.red('failed!'))
        this.error('Couldn\'t open your browser. Are you running as root?', {exit: 1})
      }
      cli.action.stop(chalk.bold.green('done'))
    } else {
      this.log(`Your new schedule is at ${chalk.bold.blue(returned_schedule.schedule.html_url)}`)
    }
  }
}
