import Command from '../../../base'
import {flags} from '@oclif/command'
import cli from 'cli-ux'
import chalk from 'chalk'
import * as utils from '../../../utils'
import * as chrono from 'chrono-node'

export default class ScheduleOverrideAdd extends Command {
  static description = 'Add an override to a PagerDuty schedule.'

  static flags = {
    ...Command.flags,
    id: flags.string({
      char: 'i',
      description: 'Add an override to the schedule with this ID.',
      exclusive: ['name'],
    }),
    name: flags.string({
      char: 'n',
      description: 'Add an override to the schedule with this name.',
      exclusive: ['id'],
    }),
    start: flags.string({
      description: 'The start time for the override.',
      default: 'now',
    }),
    end: flags.string({
      description: 'The end time for the override.',
      default: 'in 1 day',
    }),
    user_id: flags.string({
      char: 'u',
      description: 'The ID of the PagerDuty user for the override',
      exclusive: ['user_email'],
    }),
    user_email: flags.string({
      char: 'U',
      description: 'The email of the PagerDuty user for the override',
      exclusive: ['user_id'],
    }),
  }

  async run() {
    const {flags} = this.parse(ScheduleOverrideAdd)

    let scheduleID
    if (flags.id) {
      if (utils.invalidPagerDutyIDs([flags.id]).length > 0) {
        this.error(`${chalk.bold.blue(flags.id)} is not a valid PagerDuty schedule ID`)
      }
      scheduleID = flags.id
    } else if (flags.name) {
      cli.action.start(`Finding PD schedule ${chalk.bold.blue(flags.name)}`)
      scheduleID = await this.pd.scheduleIDForName(flags.name)
      if (!scheduleID) {
        cli.action.stop(chalk.bold.red('failed!'))
        this.error(`No schedule was found with the name "${flags.name}"`, {exit: 1})
      }
    } else {
      this.error('You must specify one of: -i, -n', {exit: 1})
    }

    let userID
    if (flags.user_id) {
      if (utils.invalidPagerDutyIDs([flags.user_id]).length > 0) {
        this.error(`${chalk.bold.blue(flags.user_id)} is not a valid PagerDuty user ID`, {exit: 1})
      }
      userID = flags.user_id
    } else if (flags.user_email) {
      cli.action.start(`Finding PD user ${chalk.bold.blue(flags.user_email)}`)
      userID = await this.pd.userIDForEmail(flags.user_email)
      if (!userID) {
        cli.action.stop(chalk.bold.red('failed!'))
        this.error(`No user was found for the email "${flags.user_email}"`, {exit: 1})
      }
    } else {
      this.error('You must specify one of: -u, -U', {exit: 1})
    }

    const body: any = {
      override: {
        start: chrono.parseDate(flags.start).toISOString(),
        end: chrono.parseDate(flags.end).toISOString(),
        user: {
          id: userID,
          type: 'user_reference',
        },
      },
    }

    cli.action.start(`Adding an override to schedule ${chalk.bold.blue(scheduleID)}`)
    const r = await this.pd.request({
      endpoint: `schedules/${scheduleID}/overrides`,
      method: 'POST',
      data: body,
    })
    if (r.isFailure) {
      cli.action.stop(chalk.bold.red('failed!'))
      this.error(`Request failed: ${r.getFormattedError()}`, {exit: 1})
    }
    const override = r.getData()
    if (override && override.override && override.override.id) {
      cli.action.stop(chalk.bold.green('done'))
      this.exit(0)
    }
    cli.action.stop(chalk.bold.red('failed!'))
  }
}
