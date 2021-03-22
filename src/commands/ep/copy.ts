import Command from '../../base'
import {flags} from '@oclif/command'
import cli from 'cli-ux'
import chalk from 'chalk'
import * as utils from '../../utils'

export default class EpCopy extends Command {
  static description = 'Make a copy of a PagerDuty Escalation Policy'

  static flags = {
    ...Command.flags,
    name: flags.string({
      char: 'n',
      description: 'The name of the escalation policy to copy.',
      exclusive: ['id'],
    }),
    id: flags.string({
      char: 'i',
      description: 'The ID of the escalation policy to copy.',
      exclusive: ['name'],
    }),
    destination: flags.string({
      char: 'd',
      description: 'The name for the new escalation policy',
    }),
    open: flags.boolean({
      char: 'o',
      description: 'Open the new escalation policy in the browser',
    }),
    pipe: flags.boolean({
      char: 'p',
      description: 'Print the new escalation policy ID only to stdout, for use with pipes.',
    }),
  }

  async run() {
    const {flags} = this.parse(EpCopy)

    if (!([flags.name, flags.id].some(Boolean))) {
      this.error('You must specify one of: -i, -n', {exit: 1})
    }

    let ep_id

    if (flags.name) {
      ep_id = await this.pd.epIDForName(flags.name)
      if (!ep_id) {
        this.error(`No escalation policy was found with the name ${chalk.bold.blue(flags.name)}`, {exit: 1})
      }
    }
    if (flags.id) {
      ep_id = flags.id
      if (utils.invalidPagerDutyIDs([ep_id]).length > 0) {
        this.error(`Invalid escalation policy ID ${chalk.bold.blue(ep_id)}`, {exit: 1})
      }
    }

    if (!ep_id) {
      this.error('No escalation policy specified', {exit: 1})
    }

    cli.action.start(`Getting escalation policy ${chalk.bold.blue(ep_id)}`)
    let r = await this.pd.request({
      endpoint: `escalation_policies/${ep_id}`,
      method: 'GET',
    })
    if (r.isFailure) {
      cli.action.stop(chalk.bold.red('failed!'))
      this.error(`Couldn't get escalation policy ${chalk.bold.blue(ep_id)}: ${r.getFormattedError()}`)
    }

    const source_ep = r.getData()
    const {description, on_call_handoff_notifications, num_loops, escalation_rules} = source_ep.escalation_policy
    const dest_ep = {
      escalation_policy: {
        type: 'escalation_policy',
        name: flags.destination || `${flags.name} copy ${new Date()}`,
        description: description,
        on_call_handoff_notifications: on_call_handoff_notifications,
        num_loops: num_loops,
        escalation_rules: escalation_rules,
      },
    }
    cli.action.start(`Copying escalation policy ${chalk.bold.blue(ep_id)}`)
    r = await this.pd.request({
      endpoint: 'escalation_policies',
      method: 'POST',
      data: dest_ep,
    })
    if (r.isFailure) {
      cli.action.stop(chalk.bold.red('failed!'))
      this.error(`Couldn't create escalation policy: ${r.getFormattedError()}`)
    }
    const returned_ep = r.getData()
    cli.action.stop(chalk.bold.green('done'))

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
