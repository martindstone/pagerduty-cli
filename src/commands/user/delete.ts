import Command from '../../base'
import {flags} from '@oclif/command'
import chalk from 'chalk'
import cli from 'cli-ux'
import getStream from 'get-stream'
import * as utils from '../../utils'

export default class UserDelete extends Command {
  static description = `${chalk.bold('Dangerous')} - Delete PagerDuty Users`

  static flags = {
    ...Command.flags,
    emails: flags.string({
      char: 'e',
      description: 'Select users whose emails contain the given text. Specify multiple times for multiple emails.',
      multiple: true,
    }),
    exact_emails: flags.string({
      char: 'E',
      description: 'Select a user whose login email is this exact text.  Specify multiple times for multiple emails.',
      multiple: true,
    }),
    ids: flags.string({
      char: 'i',
      description: 'Select users with the given ID. Specify multiple times for multiple users.',
      multiple: true,
    }),
    pipe: flags.boolean({
      char: 'p',
      description: 'Read user ID\'s from stdin.',
      exclusive: ['email', 'ids'],
    }),
    force: flags.boolean({
      description: chalk.red('Extreme danger mode') + ': do not prompt before deleting',
    }),
  }

  async run() {
    const {flags} = this.parse(UserDelete)

    if (!(flags.emails || flags.exact_emails || flags.ids || flags.pipe)) {
      this.error('You must specify at least one of: -i, -e, -E, -p', {exit: 1})
    }

    let user_ids: string[] = []
    if (flags.emails) {
      cli.action.start('Getting user IDs from PD')
      user_ids = await this.pd.userIDsForEmails(flags.emails)
    }
    if (flags.exact_emails) {
      cli.action.start('Getting user IDs from PD')
      for (const email of flags.exact_emails) {
        // eslint-disable-next-line no-await-in-loop
        const user_id = await this.pd.userIDForEmail(email)
        if (user_id) user_ids = [...new Set([...user_ids, user_id])]
      }
    }
    cli.action.stop(chalk.bold.green('done'))
    if (flags.ids) {
      user_ids = [...new Set([...user_ids, ...utils.splitDedupAndFlatten(flags.ids)])]
    }
    if (flags.pipe) {
      const str: string = await getStream(process.stdin)
      user_ids = utils.splitDedupAndFlatten([str])
      if (!flags.force) {
        this.error(`You have to use --force if you are using user:delete --pipe. ${chalk.bold('Be careful!')}`)
      }  
    }
    if (user_ids.length === 0) {
      this.error('No user ID\'s were found. Please try a different search.', {exit: 1})
    }
    const invalid_ids = utils.invalidPagerDutyIDs(user_ids)
    if (invalid_ids && invalid_ids.length > 0) {
      this.error(`Invalid user ID's: ${invalid_ids.join(', ')}`, {exit: 1})
    }

    const things_to_delete_str = `${user_ids.length} user${user_ids.length > 1 ? 's' : ''}`

    if (flags.force) {
      let countdown = 5
      while (countdown > -1) {
        cli.action.start(`Warning: user:delete running in ${chalk.bold.red('extreme danger mode')}!\nHit ${chalk.bold.blue('Ctrl-C')} if you don't want to delete ${things_to_delete_str}.\nStarting in ${chalk.bold(String(countdown) + ' seconds')}`)
        // eslint-disable-next-line no-await-in-loop
        await cli.wait(1000)
        countdown--
      }
      cli.action.stop(chalk.bold.green('ok'))
    } else {
      const confirm_str = `Yes, delete ${things_to_delete_str}`
      const ok = await cli.prompt(chalk.bold.red(`About to delete ${chalk.bold(things_to_delete_str)}. Are you absolutely sure?\nType '${chalk.bold.blue(confirm_str)}' to confirm`), {default: 'nope'})
      if (ok !== confirm_str) {
        // eslint-disable-next-line no-console
        console.warn(`OK, doing nothing... ${chalk.bold.green('done')}`)
        this.exit(0)
      }
    }

    const requests: any[] = []
    for (const user_id of user_ids) {
      requests.push({
        endpoint: `/users/${user_id}`,
        method: 'DELETE',
        params: {},
      })
    }

    const r = await this.pd.batchedRequestWithSpinner(requests, {
      activityDescription: `Deleting ${requests.length} users`,
    })

    for (const failure of r.getFailedIndices()) {
      // eslint-disable-next-line no-console
      console.error(`${chalk.bold.red('Failed to delete user ')}${chalk.bold.blue(requests[failure].data.user.id)}: ${r.results[failure].getFormattedError()}`)
    }
  }
}
