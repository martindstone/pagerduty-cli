/* eslint-disable complexity */
import Command from '../../base'
import {flags} from '@oclif/command'
import chalk from 'chalk'
import cli from 'cli-ux'
import getStream from 'get-stream'
import * as utils from '../../utils'

export default class UserSet extends Command {
  static description = 'Set PagerDuty User attributes'

  static flags = {
    ...Command.flags,
    emails: flags.string({
      char: 'e',
      description: 'Select users whose emails contain the given text. Specify multiple times for multiple emails.',
      multiple: true,
    }),
    ids: flags.string({
      char: 'i',
      description: 'Select users with the given ID. Specify multiple times for multiple users.',
      multiple: true,
    }),
    key: flags.string({
      char: 'k',
      description: 'Attribute key to set',
      required: true,
    }),
    value: flags.string({
      char: 'v',
      description: 'Attribute value to set',
      required: true,
    }),
    pipe: flags.boolean({
      char: 'p',
      description: 'Read user ID\'s from stdin.',
      exclusive: ['email', 'ids'],
    }),
  }

  async run() {
    const {flags} = this.parse(UserSet)

    if (!(flags.emails || flags.ids || flags.pipe)) {
      this.error('You must specify one of: -i, -e, -p', {exit: 1})
    }

    let user_ids: string[] = []
    if (flags.emails) {
      cli.action.start('Getting user IDs from PD')
      user_ids = await this.pd.userIDsForEmails(flags.emails)
    }
    if (flags.ids) {
      user_ids = [...new Set([...user_ids, ...utils.splitDedupAndFlatten(flags.ids)])]
    }
    if (flags.pipe) {
      const str: string = await getStream(process.stdin)
      user_ids = utils.splitDedupAndFlatten([str])
    }
    if (user_ids.length === 0) {
      this.error('No user ID\'s were found. Please try a different search.', {exit: 1})
    }
    const invalid_ids = utils.invalidPagerDutyIDs(user_ids)
    if (invalid_ids && invalid_ids.length > 0) {
      this.error(`Invalid user ID's: ${invalid_ids.join(', ')}`, {exit: 1})
    }

    const key = flags.key
    const value = flags.value.trim().length > 0 ? flags.value : null

    const requests: any[] = []
    for (const user_id of user_ids) {
      const body: Record<string, any> = utils.putBodyForSetAttribute('user', user_id, key, value)
      requests.push({
        endpoint: `/users/${user_id}`,
        method: 'PUT',
        params: {},
        data: body,
      })
    }

    const r = await this.pd.batchedRequestWithSpinner(requests, {
      activityDescription: `Setting ${chalk.bold.blue(flags.key)} = '${chalk.bold.blue(flags.value)}' on ${requests.length} users`,
    })

    for (const failure of r.getFailedIndices()) {
      // eslint-disable-next-line no-console
      console.error(`${chalk.bold.red('Failed to set user ')}${chalk.bold.blue(requests[failure].data.user.id)}: ${r.results[failure].getFormattedError()}`)
    }
    for (const u of r.getDatas()) {
      if (u.user[key] !== value) {
        // eslint-disable-next-line no-console
        console.error(`${chalk.bold.red('Failed to set value on user ')}${chalk.bold.blue(u.user.id)}`)
      }
    }
  }
}
