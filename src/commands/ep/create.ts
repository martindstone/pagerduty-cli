/* eslint-disable complexity */
import Command from '../../base'
import {flags} from '@oclif/command'
import chalk from 'chalk'
import cli from 'cli-ux'
import * as utils from '../../utils'

export default class EpCreate extends Command {
  static description = 'Create a PagerDuty Escalation Policy with a single level. You can add levels and targets later with ep:level and ep:target'

  static flags = {
    ...Command.flags,
    name: flags.string({
      char: 'n',
      description: 'The name of the escalation policy to add.',
      required: true,
    }),
    delay: flags.integer({
      char: 'd',
      description: 'Delay in minutes before unacknowledged incidents escalate away from this level',
      default: 30,
    }),
    description: flags.string({
      description: 'The description of the escalation policy',
    }),
    repeat: flags.integer({
      char: 'r',
      description: 'Number of times to repeat this level',
      default: 0,
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
    open: flags.boolean({
      char: 'o',
      description: 'Open the new escalation policy in the browser',
    }),
    pipe: flags.boolean({
      char: 'p',
      description: 'Print the escalation policy ID only to stdout, for use with pipes.',
      exclusive: ['open'],
    }),
  }

  async run() {
    const {flags} = this.parse(EpCreate)

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

    let invalid_ids = utils.invalidPagerDutyIDs(schedule_ids)
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
      this.error('No targets specified. Please specify some targets using -s, -S, -u, -U', {exit: 1})
    }

    const targets = [
      ...user_ids.map((x: any) => {
        return {
          id: x,
          type: 'user_reference',
        }
      }),
      ...schedule_ids.map((x: any) => {
        return {
          id: x,
          type: 'schedule_reference',
        }
      }),
    ]

    const escalation_rules = [
      {
        escalation_delay_in_minutes: flags.delay,
        targets: targets,
      },
    ]

    const body: any = {
      escalation_policy: {
        type: 'escalation_policy',
        name: flags.name,
        escalation_rules: escalation_rules,
        num_loops: flags.repeat,
      },
    }

    if (flags.description) {
      body.escalation_policy.description = flags.description
    }
    const r = await this.pd.request({
      endpoint: 'escalation_policies',
      method: 'POST',
      data: body,
    })

    if (r.isFailure) {
      this.error(`Failed to create escalation policy: ${r.getFormattedError()}`, {exit: 1})
    }
    cli.action.stop(chalk.bold.green('done'))
    const returned_ep = r.getData()

    if (flags.pipe) {
      this.log(returned_ep.escalation_policy.id)
    } else if (flags.open) {
      cli.action.start(`Opening ${chalk.bold.blue(returned_ep.escalation_policy.html_url)} in the browser`)
      try {
        cli.open(returned_ep.escalation_policy.html_url)
      } catch (error) {
        this.error('Couldn\'t open your browser. Are you running as root?', {exit: 1})
      }
      cli.action.stop(chalk.bold.green('done'))
    } else {
      this.log(`Your new escalation policy is at ${chalk.bold.blue(returned_ep.escalation_policy.html_url)}`)
    }
  }
}
