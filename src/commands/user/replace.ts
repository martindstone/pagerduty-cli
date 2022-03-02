/* eslint-disable complexity */
import Command from '../../base'
import {CliUx, Flags} from '@oclif/core'
import chalk from 'chalk'
import getStream from 'get-stream'
import * as utils from '../../utils'
import {PD} from '../../pd'

export default class UserReplace extends Command {
  static description = 'Replace PagerDuty Users in all Schedules and Escalation Policies'

  static flags = {
    ...Command.flags,
    ids: Flags.string({
      char: 'i',
      description: 'Replace users with the given IDs. Specify multiple times for multiple users.',
      multiple: true,
      exclusive: ['deleted', 'pipe'],
    }),
    deleted: Flags.boolean({
      char: 'd',
      description: 'Replace all deleted users',
      exclusive: ['ids', 'pipe'],
    }),
    user_id: Flags.string({
      char: 'u',
      description: 'The ID of the replacement user.',
      exclusive: ['user_email'],
    }),
    user_email: Flags.string({
      char: 'U',
      description: 'The email of the replacement user.',
      exclusive: ['user_id'],
    }),
    pipe: Flags.boolean({
      char: 'p',
      description: 'Read user ID\'s from stdin.',
      exclusive: ['ids', 'deleted'],
    }),
    force: Flags.boolean({
      description: chalk.red('Extreme danger mode') + ': do not prompt before updating',
    }),
  }

  async run() {
    const {flags} = await this.parse(UserReplace)

    if (!(flags.deleted || flags.ids || flags.pipe)) {
      this.error('You must specify one of: -d, -i, -p', {exit: 1})
    }

    if (flags.force) {
      let countdown = 5
      while (countdown > -1) {
        CliUx.ux.action.start(`Warning: user:replace running in ${chalk.bold.red('extreme danger mode')}, hit Ctrl-C to abort, starting in ${chalk.bold(String(countdown))}`)
        // eslint-disable-next-line no-await-in-loop
        await CliUx.ux.wait(1000)
        countdown--
      }
      CliUx.ux.action.stop(chalk.bold.green('ok'))
    }

    let user_ids: string[] = []
    if (flags.ids) {
      user_ids = [...new Set(utils.splitDedupAndFlatten(flags.ids))]
    }
    if (flags.pipe) {
      const str: string = await getStream(process.stdin)
      user_ids = utils.splitDedupAndFlatten([str])
    }
    if (!flags.deleted && user_ids.length === 0) {
      this.error('No user ID\'s were specified.', {exit: 1})
    }

    const invalid_ids = utils.invalidPagerDutyIDs(user_ids)
    if (invalid_ids && invalid_ids.length > 0) {
      this.error(`Invalid user ID's: ${invalid_ids.join(', ')}`, {exit: 1})
    }

    let replacement_user_id: string | null = null
    if (flags.user_email) {
      replacement_user_id = await this.pd.userIDForEmail(flags.user_email)
      if (!replacement_user_id) {
        this.error(`No user was found for email ${chalk.bold.blue(flags.user_email)}`, {exit: 1})
      }
    }
    if (flags.user_id) {
      if (utils.invalidPagerDutyIDs([flags.user_id]).length > 0) {
        this.error(`Invalid user ID: ${chalk.bold.blue(flags.user_id)}`, {exit: 1})
      }
      replacement_user_id = flags.user_id
    }

    if (!replacement_user_id) {
      this.error('No replacement user specified. Please specify one with -u or -U', {exit: 1})
    }

    const schedule_list = await this.pd.fetchWithSpinner('schedules', {
      activityDescription: 'Getting schedules',
      stopSpinnerWhenDone: false,
    })
    const schedule_ids = schedule_list.map(x => x.id)
    const requests: PD.Request[] = []
    for (const schedule_id of schedule_ids) {
      requests.push({
        endpoint: `schedules/${schedule_id}`,
        method: 'GET',
        params: {overflow: true},
      })
    }
    let r = await this.pd.batchedRequestWithSpinner(requests, {
      activityDescription: 'Getting schedules',
    })
    const schedules = r.getDatas()

    const eps = await this.pd.fetchWithSpinner('escalation_policies', {
      activityDescription: 'Getting escalation policies',
    })

    const schedule_requests: PD.Request[] = []
    for (const schedule of schedules) {
      const {name, time_zone, description} = schedule.schedule
      let schedule_needs_update = false
      for (const layer of schedule.schedule.schedule_layers) {
        const users_to_replace = layer.users.filter((x: any) => {
          if ((flags.deleted && x.user.self === null) || (user_ids.includes(x.user.id))) {
            return true
          }
          return false
        })
        if (users_to_replace.length > 0) {
          schedule_needs_update = true
          break
        }
      }
      if (schedule_needs_update) {
        const new_layers = []
        for (const layer of schedule.schedule.schedule_layers) {
          const new_users = layer.users.map((x: any) => {
            if ((flags.deleted && x.user.self === null) || (user_ids.includes(x.user.id))) {
              return {
                user: {
                  type: 'user_reference',
                  id: replacement_user_id,
                },
              }
            }
            return {
              user: {
                type: 'user_reference',
                id: x.user.id,
              },
            }
          })
          layer.users = new_users
          new_layers.push(layer)
        }
        schedule_requests.push({
          endpoint: `schedules/${schedule.schedule.id}`,
          method: 'PUT',
          data: {
            schedule: {
              name,
              time_zone,
              description,
              type: 'schedule_reference',
              schedule_layers: new_layers,
            },
          },
        })
      }
    }

    const ep_requests: PD.Request[] = []
    for (const ep of eps) {
      const {name, escalation_rules} = ep
      let ep_needs_update = false
      for (const rule of escalation_rules) {
        if (rule.targets.filter((x: any) => (flags.deleted && x.type === 'user_reference' && x.self === null) || user_ids.includes(x.id)).length > 0) {
          ep_needs_update = true
          break
        }
        if (ep_needs_update) break
      }
      if (ep_needs_update) {
        const new_rules = []
        for (const rule of escalation_rules) {
          const new_rule = {
            escalation_delay_in_minutes: rule.escalation_delay_in_minutes,
            targets: rule.targets.map((x: any) => {
              const new_target = {
                type: x.type,
                id: x.id,
              }
              if ((flags.deleted && x.type === 'user_reference' && x.self === null) || user_ids.includes(x.id)) {
                new_target.id = replacement_user_id
              }
              return new_target
            }),
          }
          new_rules.push(new_rule)
        }
        const body = {
          escalation_policy: {
            type: 'escalation_policy_reference',
            name: name,
            escalation_rules: new_rules,
          },
        }
        ep_requests.push({
          endpoint: `escalation_policies/${ep.id}`,
          method: 'PUT',
          data: body,
        })
      }
    }

    if (schedule_requests.length === 0 && ep_requests.length === 0) {
      // eslint-disable-next-line no-console
      console.warn('No users found to replace. Nothing to do.')
      this.exit(0)
    }

    if (!flags.force) {
      const ok = await CliUx.ux.prompt(chalk.bold.red(`About to update ${schedule_requests.length} schedules and ${ep_requests.length} escalation policies. Are you absolutely sure?\nType '${chalk.bold.blue(replacement_user_id)}' to confirm`), {default: 'nope'})
      if (ok !== replacement_user_id) {
        // eslint-disable-next-line no-console
        console.warn(`OK, doing nothing... ${chalk.bold.green('done')}`)
        this.exit(0)
      }
    }

    if (schedule_requests.length > 0) {
      r = await this.pd.batchedRequestWithSpinner(schedule_requests, {
        activityDescription: `Updating ${schedule_requests.length} schedules`,
      })
    }
    if (ep_requests.length > 0) {
      r = await this.pd.batchedRequestWithSpinner(ep_requests, {
        activityDescription: `Updating ${ep_requests.length} escalation policies`,
      })
    }
  }
}
