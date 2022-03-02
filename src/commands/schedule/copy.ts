import Command from '../../base'
import {CliUx, Flags} from '@oclif/core'
import chalk from 'chalk'
import * as utils from '../../utils'

export default class ScheduleCopy extends Command {
  static description = 'Make a copy of a PagerDuty Schedule'

  static flags = {
    ...Command.flags,
    name: Flags.string({
      char: 'n',
      description: 'The name of the schedule to copy.',
      exclusive: ['id'],
    }),
    id: Flags.string({
      char: 'i',
      description: 'The ID of the schedule to copy.',
      exclusive: ['name'],
    }),
    destination: Flags.string({
      char: 'd',
      description: 'The name for the new schedule',
    }),
    open: Flags.boolean({
      char: 'o',
      description: 'Open the new schedule in the browser',
    }),
    pipe: Flags.boolean({
      char: 'p',
      description: 'Print the new schedule ID only to stdout, for use with pipes.',
    }),
  }

  async run() {
    const {flags} = await this.parse(ScheduleCopy)

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

    CliUx.ux.action.start(`Getting schedule ${chalk.bold.blue(schedule_id)}`)
    let r = await this.pd.request({
      endpoint: `schedules/${schedule_id}`,
      method: 'GET',
    })
    if (r.isFailure) {
      CliUx.ux.action.stop(chalk.bold.red('failed!'))
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
    CliUx.ux.action.start(`Copying schedule ${chalk.bold.blue(schedule_id)}`)
    r = await this.pd.request({
      endpoint: 'schedules',
      method: 'POST',
      data: dest_schedule,
    })
    if (r.isFailure) {
      CliUx.ux.action.stop(chalk.bold.red('failed!'))
      this.error(`Couldn't create schedule: ${r.getFormattedError()}`)
    }
    const returned_schedule = r.getData()
    CliUx.ux.action.stop(chalk.bold.green('done'))

    if (flags.pipe) {
      this.log(returned_schedule.schedule.id)
    } else if (flags.open) {
      CliUx.ux.action.start(`Opening ${chalk.bold.blue(returned_schedule.schedule.html_url)} in the browser`)
      try {
        await CliUx.ux.open(returned_schedule.schedule.html_url)
      } catch (error) {
        CliUx.ux.action.stop(chalk.bold.red('failed!'))
        this.error('Couldn\'t open your browser. Are you running as root?', {exit: 1})
      }
      CliUx.ux.action.stop(chalk.bold.green('done'))
    } else {
      this.log(`Your new schedule is at ${chalk.bold.blue(returned_schedule.schedule.html_url)}`)
    }
  }
}
