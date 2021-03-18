/* eslint-disable complexity */
import Command from '../../../base'
import {flags} from '@oclif/command'
import chalk from 'chalk'
import getStream from 'get-stream'
import * as utils from '../../../utils'
import {PD} from '../../../pd'

export default class EpTargetAdd extends Command {
  static description = 'Add targets to PagerDuty Escalation Policies'

  static flags = {
    ...Command.flags,
    name: flags.string({
      char: 'n',
      description: 'Update escalation policies whose names match this string.',
      exclusive: ['ids', 'pipe'],
    }),
    ids: flags.string({
      char: 'i',
      description: 'The IDs of escalation policies to update.',
      exclusive: ['name', 'pipe'],
      multiple: true,
    }),
    pipe: flags.boolean({
      char: 'p',
      description: 'Read escalation policy ID\'s from stdin.',
      exclusive: ['ids', 'name'],
    }),
    level: flags.integer({
      char: 'l',
      description: 'Escalation policy level to add targets to',
      required: true,
    }),
    user_ids: flags.string({
      char: 'u',
      description: 'Add a target user with this ID. Specify multiple times for multiple targets.',
      multiple: true,
    }),
    user_emails: flags.string({
      char: 'U',
      description: 'Add a target user with this email. Specify multiple times for multiple targets.',
      multiple: true,
    }),
    schedule_ids: flags.string({
      char: 's',
      description: 'Add a target schedule with this ID. Specify multiple times for multiple targets.',
      multiple: true,
    }),
    schedule_names: flags.string({
      char: 'S',
      description: 'Add a target schedule with this name. Specify multiple times for multiple targets.',
      multiple: true,
    }),
  }

  async run() {
    const {flags} = this.parse(EpTargetAdd)

    if (flags.level < 1) {
      this.error('The lowest level number is 1', {exit: 1})
    }
    let ep_ids: string[] = []
    if (flags.name) {
      const eps = await this.pd.fetchWithSpinner('escalation_policies', {
        params: {query: flags.name},
        activityDescription: 'Finding escalation policies in PD',
      })
      if (eps.length === 0) {
        this.error(`No escalation policies found matching ${chalk.bold.blue(flags.name)}`, {exit: 1})
      }
      ep_ids = [...ep_ids, ...eps.map((ep: {id: string}) => ep.id)]
    } else if (flags.ids) {
      ep_ids = utils.splitDedupAndFlatten(flags.ids)
    } else if (flags.pipe) {
      const str: string = await getStream(process.stdin)
      ep_ids = utils.splitDedupAndFlatten([str])
    } else {
      this.error('You must specify one of: -i, -m, -p', {exit: 1})
    }

    let invalid_ids = utils.invalidPagerDutyIDs(ep_ids)
    if (invalid_ids && invalid_ids.length > 0) {
      this.error(`Invalid Escalation Policy ID's: ${invalid_ids.join(', ')}`, {exit: 1})
    }

    let schedule_ids: string[] = []
    if (flags.schedule_ids) {
      schedule_ids = [...schedule_ids, ...flags.schedule_ids]
    }
    if (flags.schedule_names) {
      for (const name of flags.schedule_names) {
        // eslint-disable-next-line no-await-in-loop
        const schedule_id = await this.pd.scheduleIDForName(name)
        if (schedule_id === null) {
          this.error(`No schedule was found with the name ${chalk.bold.blue(name)}`, {exit: 1})
        } else {
          schedule_ids.push(schedule_id)
        }
      }
    }
    schedule_ids = [...new Set(schedule_ids)]

    invalid_ids = utils.invalidPagerDutyIDs(schedule_ids)
    if (invalid_ids && invalid_ids.length > 0) {
      this.error(`Invalid Schedule ID's: ${invalid_ids.join(', ')}`, {exit: 1})
    }

    let user_ids: string[] = []
    if (flags.user_ids) {
      user_ids = [...user_ids, ...flags.user_ids]
    }
    if (flags.user_emails) {
      for (const email of flags.user_emails) {
        // eslint-disable-next-line no-await-in-loop
        const user_id = await this.pd.userIDForEmail(email)
        if (user_id === null) {
          this.error(`No user was found with the email ${chalk.bold.blue(email)}`, {exit: 1})
        } else {
          user_ids.push(user_id)
        }
      }
    }
    user_ids = [...new Set(user_ids)]

    invalid_ids = utils.invalidPagerDutyIDs(user_ids)
    if (invalid_ids && invalid_ids.length > 0) {
      this.error(`Invalid User ID's: ${invalid_ids.join(', ')}`, {exit: 1})
    }

    if (user_ids.length === 0 && schedule_ids.length === 0) {
      this.error('No targets specified. Please specify some targets using -s, -S, -u, -U')
    }
    let requests: PD.Request[] = []
    for (const ep_id of ep_ids) {
      requests.push({
        endpoint: `escalation_policies/${ep_id}`,
        method: 'GET',
      })
    }
    let r = await this.pd.batchedRequestWithSpinner(requests, {
      activityDescription: `Getting ${ep_ids.length} escalation policies from PD`,
    })
    const eps = r.getDatas()

    requests = []
    for (const ep of eps) {
      const levels = ep.escalation_policy.escalation_rules
      if (levels.length < flags.level) {
        // eslint-disable-next-line no-console
        console.error(chalk.bold.red('Escalation policy ') + chalk.bold.blue(ep.escalation_policy.summary) + chalk.bold.red(` does not have level ${flags.level}`))
        continue
      }
      const level = levels[flags.level - 1]
      let user_targets = level.targets.filter((x: any) => x.type === 'user_reference').map((x: any) => x.id)
      let schedule_targets = level.targets.filter((x: any) => x.type === 'schedule_reference').map((x: any) => x.id)

      user_targets = [...new Set([...user_targets, ...user_ids])]
      schedule_targets = [...new Set([...schedule_targets, ...schedule_ids])]
      const new_targets = [
        ...user_targets.map((x: any) => {
          return {
            id: x,
            type: 'user_reference',
          }
        }),
        ...schedule_targets.map((x: any) => {
          return {
            id: x,
            type: 'schedule_reference',
          }
        }),
      ]

      levels[flags.level - 1].targets = new_targets
      // eslint-disable-next-line no-await-in-loop
      requests.push({
        endpoint: `escalation_policies/${ep.escalation_policy.id}`,
        method: 'PUT',
        data: {
          escalation_policy: {
            id: ep.escalation_policy.id,
            escalation_rules: levels,
          },
        },
      })
    }
    r = await this.pd.batchedRequestWithSpinner(requests, {
      activityDescription: `Updating ${ep_ids.length} escalation policies`,
    })
    for (const failure of r.getFailedIndices()) {
      const f = requests[failure] as any
      // eslint-disable-next-line no-console
      console.error(`${chalk.bold.red('Failed to update escalation policy ')}${chalk.bold.blue(f.data.escalation_policy.id)}: ${r.results[failure].getFormattedError()}`)
    }
  }
}
