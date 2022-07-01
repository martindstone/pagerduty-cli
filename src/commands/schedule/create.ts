import Command from '../../base'
import {CliUx, Flags} from '@oclif/core'
import chalk from 'chalk'
import parse from 'parse-duration'
import * as chrono from 'chrono-node'

export default class ScheduleCreate extends Command {
  static description = 'Create a PagerDuty Schedule'

  static flags = {
    ...Command.flags,
    name: Flags.string({
      char: 'n',
      description: 'The name of the schedule to create.',
      required: true,
    }),
    description: Flags.string({
      char: 'd',
      description: 'The description of the schedule to create',
    }),
    timezone: Flags.string({
      char: 'z',
      description: 'The time zone of the schedule',
      default: 'UTC',
    }),
    users: Flags.string({
      char: 'u',
      description: 'The IDs of users to include in the first layer of the schedule. Specify multiple times, in order, for multiple users.',
      required: true,
      multiple: true,
    }),
    handoff_time: Flags.string({
      char: 't',
      description: 'The handoff time of the first layer of the schedule (in the time zone specified by -z)',
      default: '09:00',
    }),
    turn_length: Flags.string({
      char: 'l',
      description: 'The rotation turn length of the first layer of the schedule',
      default: '1 day',
    }),
    start: Flags.string({
      char: 's',
      description: 'The start time of the first layer of the schedule',
      default: 'now',
    }),
    rotation_virtual_start: Flags.string({
      description: 'The effective start time of the first layer. This can be before the start time of the schedule.',
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
    const {flags} = await this.parse(this.ctor)

    const now = chrono.parseDate(`now ${flags.timezone}`)
    const handoff_time = chrono.parseDate(`${flags.handoff_time} ${flags.timezone}`)
    if (handoff_time > now) {
      handoff_time.setDate(handoff_time.getDate() - 1)
    }

    const rotation_turn_length_seconds = parse(flags.turn_length, 's') || Number(flags.turn_length)
    if (isNaN(rotation_turn_length_seconds) || rotation_turn_length_seconds < 86_400) {
      this.error(`Invalid turn length duration: ${flags.turn_length}`, {exit: 1})
    }

    const start = chrono.parseDate(flags.start)
    let rotation_virtual_start = start
    if (flags.rotation_virtual_start) {
      rotation_virtual_start = chrono.parseDate(flags.rotation_virtual_start)
    }

    const userIDs: string[] = []
    const userEmails: string[] = []
    for (const userNameOrEmail of flags.users) {
      if (userNameOrEmail.match(/^[P|Q][\w]{6,13}$/)) {
        userIDs.push(userNameOrEmail)
      } else {
        userEmails.push(userNameOrEmail)
      }
    }
    for (const userEmail of userEmails) {
      // eslint-disable-next-line no-await-in-loop
      const userID = await this.pd.userIDForEmail(userEmail)
      if (userID === null) {
        this.error(`${chalk.bold.blue(userEmail)} is not the ID or email of a user in your PagerDuty domain`, {exit: 1})
      }
      userIDs.push(userID)
    }

    if (userIDs.length === 0) {
      this.error('No PagerDuty users to add to the schedule. Please specify some users with -u', {exit: 1})
    }

    const users = userIDs.map((u: string) => ({
      user: {
        id: u,
        type: 'user_reference',
      },
    }))

    const schedule: any = {
      schedule: {
        name: flags.name,
        type: 'schedule',
        time_zone: 'UTC',
        schedule_layers: [
          {
            name: 'Layer 1',
            users,
            start,
            rotation_turn_length_seconds,
            rotation_virtual_start,
          },
        ],
      },
    }

    if (flags.description) {
      schedule.schedule.description = flags.description
    }

    CliUx.ux.action.start('Creating schedule')
    const r = await this.pd.request({
      endpoint: 'schedules',
      method: 'POST',
      data: schedule,
    })

    if (r.isFailure) {
      CliUx.ux.action.stop(chalk.bold.red('failed!'))
      this.error(r.getFormattedError(), {exit: 1})
    }

    const returned_schedule = r.getData()

    if (flags.pipe) {
      this.log(returned_schedule.schedule.id)
    } else {
      if (flags.open) {
        CliUx.ux.action.start(`Opening ${chalk.bold.blue(returned_schedule.schedule.html_url)} in the browser`)
        try {
          await CliUx.ux.open(returned_schedule.schedule.html_url)
        } catch (error) {
          CliUx.ux.action.stop(chalk.bold.red('failed!'))
          this.error('Couldn\'t open your browser. Are you running as root?', {exit: 1})
        }
        CliUx.ux.action.stop(chalk.bold.green('done'))
      }
      this.log(`Your new schedule is at ${chalk.bold.blue(returned_schedule.schedule.html_url)}`)
    }
  }
}
