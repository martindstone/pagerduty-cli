import { AuthenticatedBaseCommand } from '../../base/authenticated-base-command'
import { CliUx, Flags } from '@oclif/core'
import chalk from 'chalk'
import getStream from 'get-stream'
import jp from 'jsonpath'
import * as utils from '../../utils'

export default class UserSet extends AuthenticatedBaseCommand<typeof UserSet> {
  static description = 'Set PagerDuty User attributes'

  static flags = {
    emails: Flags.string({
      char: 'e',
      description: 'Select users whose emails contain the given text. Specify multiple times for multiple emails.',
      multiple: true,
    }),
    exact_emails: Flags.string({
      char: 'E',
      description: 'Select a user whose login email is this exact text.  Specify multiple times for multiple emails.',
      multiple: true,
    }),
    ids: Flags.string({
      char: 'i',
      description: 'Select users with the given ID. Specify multiple times for multiple users.',
      multiple: true,
    }),
    keys: Flags.string({
      char: 'k',
      description: 'Attribute keys to set. Specify multiple times to set multiple keys.',
      required: true,
      multiple: true,
    }),
    values: Flags.string({
      char: 'v',
      description: 'Attribute values to set. To set multiple key/values, specify multiple times in the same order as the keys.',
      required: true,
      multiple: true,
    }),
    jsonvalues: Flags.boolean({
      description: 'Interpret values as JSON [default: true]',
      default: true,
      allowNo: true,
    }),
    pipe: Flags.boolean({
      char: 'p',
      description: 'Read user ID\'s from stdin.',
      exclusive: ['emails', 'exact_emails', 'ids'],
    }),
  }

  async run() {
    if (!(this.flags.emails || this.flags.exact_emails || this.flags.ids || this.flags.pipe)) {
      this.error('You must specify at least one of: -i, -e, -E, -p', { exit: 1 })
    }

    let user_ids: string[] = []
    if (this.flags.emails) {
      CliUx.ux.action.start('Getting user IDs from PD')
      user_ids = [...user_ids, ...await this.pd.userIDsForEmails(this.flags.emails)]
    }
    if (this.flags.exact_emails) {
      CliUx.ux.action.start('Getting user IDs from PD')
      user_ids = [...user_ids, ...await this.pd.userIDsForEmails(this.flags.exact_emails, true)]
    }
    if (this.flags.ids) {
      user_ids = [...user_ids, ...utils.splitDedupAndFlatten(this.flags.ids)]
    }
    if (this.flags.pipe) {
      const str: string = await getStream(process.stdin)
      user_ids = utils.splitDedupAndFlatten([str])
    }
    CliUx.ux.action.stop(chalk.bold.green('done'))
    user_ids = [...new Set(user_ids)]
    if (user_ids.length === 0) {
      this.error('No user ID\'s were found. Please try a different search.', { exit: 1 })
    }
    const invalid_ids = utils.invalidPagerDutyIDs(user_ids)
    if (invalid_ids && invalid_ids.length > 0) {
      this.error(`Invalid user ID's: ${invalid_ids.join(', ')}`, { exit: 1 })
    }

    const attributes = []
    for (const [i, key] of this.flags.keys.entries()) {
      let value = this.flags.values[i]
      if (this.flags.jsonvalues) {
        try {
          const jsonvalue = JSON.parse(value)
          value = jsonvalue
        } catch (e) { }
      }
      attributes.push({ key, value })
    }

    const requests: any[] = []
    for (const user_id of user_ids) {
      const body: Record<string, any> = utils.putBodyForSetAttributes('user', user_id, attributes)
      requests.push({
        endpoint: `/users/${user_id}`,
        method: 'PUT',
        params: {},
        data: body,
      })
    }

    const kvString = attributes.map(a => `${a.key}=${JSON.stringify(a.value)}`).join(', ')
    const r = await this.pd.batchedRequestWithSpinner(requests, {
      activityDescription: `Setting ${chalk.bold.blue(kvString)}' on ${user_ids.length} users`,
    })

    for (const failure of r.getFailedIndices()) {
      // eslint-disable-next-line no-console
      console.error(`${chalk.bold.red('Failed to set user ')}${chalk.bold.blue(requests[failure].data.user.id)}: ${r.results[failure].getFormattedError()}`)
    }
    for (const s of r.getDatas()) {
      for (const { key, value } of attributes) {
        const returnedValues = jp.query(s.user, key)
        const returnedValue = returnedValues ? returnedValues[0] : null
        if (returnedValue !== value) {
          if (typeof value === 'object' && value !== null) {
            // special case when the value to be set was an object
            if (JSON.stringify(returnedValue) === JSON.stringify(value)) {
              continue
            }
          }
          // eslint-disable-next-line no-console
          console.error(`${chalk.bold.red('Failed to set value on user ')}${chalk.bold.blue(s.service.id)}`)
        }
      }
    }
  }
}
