import Command from '../../base'
import {flags} from '@oclif/command'
import cli from 'cli-ux'
import chalk from 'chalk'
import * as utils from '../../utils'
import * as chrono from 'chrono-node'
import jp from 'jsonpath'

export default class ScheduleShow extends Command {
  static description = 'Show a PagerDuty Schedule'

  static flags = {
    ...Command.flags,
    id: flags.string({
      char: 'i',
      description: 'Show the schedule with this ID.',
      exclusive: ['email', 'me'],
    }),
    name: flags.string({
      char: 'n',
      description: 'Show the schedule with this name.',
      exclusive: ['id'],
    }),
    since: flags.string({
      description: 'The start of the date range over which you want to search.',
    }),
    until: flags.string({
      description: 'The end of the date range over which you want to search.',
    }),
  }

  async run() {
    const {flags} = this.parse(ScheduleShow)

    const params: Record<string, any> = {}

    let scheduleID
    if (flags.id) {
      if (utils.invalidPagerDutyIDs([flags.id]).length > 0) {
        this.error(`${chalk.bold.blue(flags.id)} is not a valid PagerDuty schedule ID`, {exit: 1})
      }
      scheduleID = flags.id
    } else if (flags.name) {
      cli.action.start(`Finding PD schedule ${chalk.bold.blue(flags.name)}`)
      scheduleID = await this.pd.scheduleIDForName(flags.name)
      if (!scheduleID) {
        cli.action.stop(chalk.bold.red('failed!'))
        this.error(`No schedule or multiple schedules found with the name "${flags.name}"`, {exit: 1})
      }
    } else {
      this.error('You must specify one of: -i, -n', {exit: 1})
    }

    if (flags.since) {
      const since = chrono.parseDate(flags.since)
      if (since) {
        params.since = since.toISOString()
      }
    }
    if (flags.until) {
      const until = chrono.parseDate(flags.until)
      if (until) {
        params.until = until.toISOString()
      }
    }

    cli.action.start(`Getting schedule ${chalk.bold.blue(scheduleID)}`)
    const r = await this.pd.request({
      endpoint: `schedules/${scheduleID}`,
      method: 'GET',
      params: params,
    })
    cli.action.stop(chalk.bold.green('done'))
    const schedule = r.getData().schedule

    const coverage_int = schedule.final_schedule.rendered_coverage_percentage
    let coverage_str = coverage_int ? `${coverage_int}%` : '0%'
    if (coverage_int > 95) {
      coverage_str = chalk.bold.green(coverage_str)
    } else if (coverage_int > 60) {
      coverage_str = chalk.bold.keyword('orange')(coverage_str)
    } else {
      coverage_str = chalk.bold.red(coverage_str)
    }

    this.log('')
    this.log(chalk.bold(`Schedule name:     ${schedule.summary}`))
    this.log(chalk.bold(`Time zone:         ${schedule.time_zone}`))
    this.log(`${chalk.bold('Schedule coverage:')} ${coverage_str}\n`)

    const options = {
      printLine: this.log,
      ...flags, // parsed flags
    }

    this.log(chalk.bold.cyan('Schedule Layers:'))
    let columns: Record<string, object> = {
      start: {
        get: (row: any) => row.start ? (new Date(row.start)).toLocaleString() : '',
      },
      end: {
        get: (row: any) => row.end ? (new Date(row.end)).toLocaleString() : '',
      },
      rotation_type: {
        get: (row: any) => utils.scheduleRotationTypeString(row.rotation_turn_length_seconds),
      },
      restrictions: {
        get: (row: any) => {
          if (!row.restrictions) return
          return utils.formatField(row.restrictions.map((x: any) => utils.scheduleRestrictionString(x)), '\n')
        },
      },
      user_ids: {
        get: (row: any) => utils.formatField(jp.query(row, 'users[*].user.id'), '\n'),
      },
      user_names: {
        get: (row: any) => utils.formatField(jp.query(row, 'users[*].user.summary'), '\n'),
      },
    }
    cli.table(schedule.schedule_layers, columns, options)

    columns = {
      start: {
        get: (row: any) => row.start ? (new Date(row.start)).toLocaleString() : '',
      },
      end: {
        get: (row: any) => row.end ? (new Date(row.end)).toLocaleString() : '',
      },
      duration: {
        get: (row: any) => utils.scheduleRotationSecondsToHuman(((new Date(row.end).getTime()) - (new Date(row.start).getTime())) / 1000),
      },
      user_id: {
        get: (row: any) => row.user.id,
      },
      user_name: {
        get: (row: any) => row.user.summary,
      },
    }

    if (schedule.overrides_subschedule.rendered_schedule_entries.length > 0) {
      this.log('')
      this.log(chalk.bold.cyan('Overrides:'))
      cli.table(schedule.overrides_subschedule.rendered_schedule_entries, columns, options)
    }

    this.log('')
    this.log(chalk.bold.cyan('Final Schedule:'))
    cli.table(schedule.final_schedule.rendered_schedule_entries, columns, options)
  }
}
