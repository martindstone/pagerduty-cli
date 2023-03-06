import { AuthenticatedBaseCommand } from '../../../base/authenticated-base-command'
import { CliUx, Flags } from '@oclif/core'
import chalk from 'chalk'

export default class BsSubscriberAdd extends AuthenticatedBaseCommand<typeof BsSubscriberAdd> {
  static description = 'Add Subscribers to a PagerDuty Business Service'

  static flags = {
    id: Flags.string({
      char: 'i',
      description: 'Business Service ID to add subscribers to.',
      exclusive: ['name'],
    }),
    name: Flags.string({
      char: 'n',
      description: 'Business Service name to add subscribers to.',
      exclusive: ['id'],
    }),
    team_ids: Flags.string({
      char: 't',
      description: 'The ID of a team to add as a subscriber. Specify multiple times for multiple teams',
      multiple: true,
    }),
    team_names: Flags.string({
      char: 'T',
      description: 'The name of a team to add as a subscriber. Specify multiple times for multiple teams',
      multiple: true,
    }),
    user_ids: Flags.string({
      char: 'u',
      description: 'The ID of a user to add as a subscriber. Specify multiple times for multiple users',
      multiple: true,
    }),
    user_emails: Flags.string({
      char: 'U',
      description: 'The email of a user to add as a subscriber. Specify multiple times for multiple users',
      multiple: true,
    }),
  }

  async run() {
    if (!(this.flags.id || this.flags.name)) {
      this.error('No business service selected. Please choose one by specifying either -i or -n', {exit: 1})
    }
    const {
      team_ids,
      team_names,
      user_ids,
      user_emails,
    } = this.flags

    let id = this.flags.id
    if (this.flags.name) {
      const found = await this.pd.businessServiceIDForName(this.flags.name)
      if (!found) {
        this.error(`No business service was found with the name ${chalk.bold.blue(this.flags.name)}`, {exit: 1})
      }
      id = found
    }

    const subscribers: object[] = []

    if (team_ids) {
      for (const team_id of team_ids) {
        CliUx.ux.action.start(`Checking team ${chalk.bold.blue(team_id)}`)
        const r = await this.pd.request({
          endpoint: `teams/${team_id}`,
          method: 'GET',
        })
        if (r.isFailure) {
          CliUx.ux.action.stop(chalk.bold.red('failed!'))
          this.error(`Team ${chalk.bold.blue(team_id)} wasn't found`, {exit: 1})
        }
        subscribers.push({
          subscriber_id: team_id,
          subscriber_type: 'team',
        })
      }
    }
    if (team_names) {
      for (const team_name of team_names) {
        CliUx.ux.action.start(`Checking team ${chalk.bold.blue(team_name)}`)
        const team_id = await this.pd.teamIDForName(team_name)
        if (!team_id) {
          CliUx.ux.action.stop(chalk.bold.red('failed!'))
          this.error(`Team ${chalk.bold.blue(team_name)} wasn't found`, {exit: 1})
        }
        subscribers.push({
          subscriber_id: team_id,
          subscriber_type: 'team',
        })
      }
    }

    if (user_ids) {
      for (const user_id of user_ids) {
        CliUx.ux.action.start(`Checking user ${chalk.bold.blue(user_id)}`)
        const r = await this.pd.request({
          endpoint: `users/${user_id}`,
          method: 'GET',
        })
        if (r.isFailure) {
          CliUx.ux.action.stop(chalk.bold.red('failed!'))
          this.error(`User ${chalk.bold.blue(user_id)} wasn't found`, {exit: 1})
        }
        subscribers.push({
          subscriber_id: user_id,
          subscriber_type: 'user',
        })
      }
    }
    if (user_emails) {
      for (const user_email of user_emails) {
        CliUx.ux.action.start(`Checking user ${chalk.bold.blue(user_email)}`)
        const user_id = await this.pd.userIDForEmail(user_email)
        if (!user_id) {
          CliUx.ux.action.stop(chalk.bold.red('failed!'))
          this.error(`User ${chalk.bold.blue(user_email)} wasn't found`, {exit: 1})
        }
        subscribers.push({
          subscriber_id: user_id,
          subscriber_type: 'user',
        })
      }
    }

    if (subscribers.length === 0) {
      this.error('No subscribers to add. Please choose some by specifying, -t, -T, -u or -U', {exit: 1})
    }

    CliUx.ux.action.start(`Adding ${subscribers.length} subscribers to business service ${id}`)
    const r = await this.pd.request({
      endpoint: `business_services/${id}/subscribers`,
      method: 'POST',
      data: {subscribers},
    })
    if (r.isFailure) {
      this.error(`Failed to add subscribers: ${r.getFormattedError()}`, {exit: 1})
    }
    CliUx.ux.action.stop(chalk.bold.green('done'))
  }
}
