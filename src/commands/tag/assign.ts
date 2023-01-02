import { AuthenticatedBaseCommand } from '../../base/authenticated-base-command'
import { CliUx, Flags } from '@oclif/core'
import chalk from 'chalk'
import * as utils from '../../utils'
import { PD } from '../../pd'

export default class TagAssign extends AuthenticatedBaseCommand<typeof TagAssign> {
  static description = 'Assign/Remove Tags to/from PagerDuty objects'

  static flags = {
    add_ids: Flags.string({
      char: 'a',
      description: 'The ID of a Tag to add. Specify multiple times for multiple tags',
      multiple: true,
      default: [],
    }),
    add_names: Flags.string({
      char: 'A',
      description: 'The name of a Tag to add. If no tag with this name exists, a new tag will be created. Specify multiple times for multiple tags',
      multiple: true,
      default: [],
    }),
    remove_ids: Flags.string({
      char: 'r',
      description: 'The ID of a Tag to remove. Specify multiple times for multiple tags',
      multiple: true,
      default: [],
    }),
    remove_names: Flags.string({
      char: 'R',
      description: 'The name of a Tag to remove. Specify multiple times for multiple tags',
      multiple: true,
      default: [],
    }),
    user_ids: Flags.string({
      char: 'u',
      description: 'The ID of a User to assign this tag to. Specify multiple times for multiple users',
      multiple: true,
      default: [],
    }),
    user_emails: Flags.string({
      char: 'U',
      description: 'The email of a User to assign this tag to. Specify multiple times for multiple users',
      multiple: true,
      default: [],
    }),
    team_ids: Flags.string({
      char: 't',
      description: 'The ID of a Team to assign this tag to. Specify multiple times for multiple teams',
      multiple: true,
      default: [],
    }),
    ep_ids: Flags.string({
      char: 'e',
      description: 'The ID of an Escalation Policy to assign this tag to. Specify multiple times for multiple users',
      multiple: true,
      default: [],
    }),
  }

  async run() {
    const {
      add_ids,
      add_names,
      remove_ids,
      remove_names,
      user_ids,
      user_emails,
      team_ids,
      ep_ids,
    } = this.flags

    if (user_ids.length + user_emails.length + team_ids.length + ep_ids.length === 0) {
      this.error('Nothing to add a tag to. You must provide at least -u, -t or -e', { exit: 1 })
    }

    if (remove_names.length > 0) {
      CliUx.ux.action.start(`Finding IDs for ${remove_names.length} tags`)
      for (const remove_name of remove_names) {
        const remove_id = await this.pd.tagIDForName(remove_name)
        if (remove_id) {
          remove_ids.push(remove_id)
        } else {
          this.warn(`No tag was found with the name ${chalk.bold.blue(remove_name)}`)
        }
      }
      CliUx.ux.action.stop(chalk.bold.green('done'))
    }

    if (add_ids.length + add_names.length + remove_ids.length === 0) {
      this.error('No tags to add or remove. You must provide at least -a, -A, -r or -R', {exit: 1})
    }

    let invalid_ids = utils.invalidPagerDutyIDs([...user_ids, ...team_ids, ...ep_ids])
    if (invalid_ids && invalid_ids.length > 0) {
      this.error(`Invalid PagerDuty object ID's: ${invalid_ids.join(', ')}`, { exit: 1 })
    }
    invalid_ids = utils.invalidPagerDutyIDs([...add_ids, ...remove_ids])
    if (invalid_ids && invalid_ids.length > 0) {
      this.error(`Invalid PagerDuty tag ID's: ${invalid_ids.join(', ')}`, { exit: 1 })
    }

    const postBody = {
      add: [
        ...add_ids.map((id: string) => { return {type: 'tag_reference', id: id}}),
        ...add_names.map((name: string) => { return {type: 'tag', label: name}}),
      ],
      remove: [
        ...remove_ids.map((id: string) => { return {type: 'tag_reference', id: id}}),
      ],
    }

    if (user_emails) {
      CliUx.ux.action.start(`Finding IDs for ${user_emails.length} users`)
      for (const user_email of user_emails) {
        
        const user_id = await this.pd.userIDForEmail(user_email)
        if (user_id) {
          user_ids.push(user_id)
        } else {
          CliUx.ux.action.stop(chalk.bold.red('failed!'))
          this.error(`No user was found for email ${chalk.bold.blue(user_email)}`, { exit: 1 })
        }
      }
      CliUx.ux.action.stop(chalk.bold.green('done'))
    }

    const requests: PD.Request[] = [
      ...user_ids.map((user_id: string) => {
        return {
          method: 'POST',
          endpoint: `users/${user_id}/change_tags`,
          data: postBody,
        } as PD.Request
      }),
      ...team_ids.map((team_id: string) => {
        return {
          method: 'POST',
          endpoint: `teams/${team_id}/change_tags`,
          data: postBody,
        } as PD.Request
      }),
      ...ep_ids.map((ep_id: string) => {
        return {
          method: 'POST',
          endpoint: `escalation_policies/${ep_id}/change_tags`,
          data: postBody,
        } as PD.Request
      }),
    ]

    const doingArr: string[] = []
    if (add_names.length + add_ids.length > 0) doingArr.push(`adding ${chalk.bold.blue('' + (add_names.length + add_ids.length))} tags to`)
    if (remove_ids.length > 0) doingArr.push(`removing ${chalk.bold.blue('' + remove_ids.length)} tags from`)
    let doing = doingArr.join(' and ')
    doing = doing.charAt(0).toUpperCase() + doing.slice(1)

    const r = await this.pd.batchedRequestWithSpinner(requests, {
      activityDescription: `${doing} ${chalk.bold.blue(requests.length)} objects`,
    })

    for (const failure of r.getFailedIndices()) {
      // eslint-disable-next-line no-console
      console.error(`${chalk.bold.red('Request to ')}${chalk.bold.blue(requests[failure].endpoint)} failed: ${r.results[failure].getFormattedError()}`)
    }
  }
}
