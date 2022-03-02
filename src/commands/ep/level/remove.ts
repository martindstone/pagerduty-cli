/* eslint-disable complexity */
import Command from '../../../base'
import {Flags} from '@oclif/core'
import chalk from 'chalk'
import getStream from 'get-stream'
import * as utils from '../../../utils'
import {PD} from '../../../pd'

export default class EpLevelRemove extends Command {
  static description = 'Remove a level from PagerDuty Escalation Policies'

  static flags = {
    ...Command.flags,
    name: Flags.string({
      char: 'n',
      description: 'Update escalation policies whose names match this string.',
      exclusive: ['ids', 'pipe'],
    }),
    ids: Flags.string({
      char: 'i',
      description: 'The IDs of escalation policies to update.',
      exclusive: ['name', 'pipe'],
      multiple: true,
    }),
    pipe: Flags.boolean({
      char: 'p',
      description: 'Read escalation policy ID\'s from stdin.',
      exclusive: ['ids', 'name'],
    }),
    level: Flags.integer({
      char: 'l',
      description: 'Escalation policy level to remove (the lowest level is 1; any existing levels above the deleted level will be moved down.',
      required: true,
    }),
  }

  async run() {
    const {flags} = await this.parse(EpLevelRemove)

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

    const invalid_ids = utils.invalidPagerDutyIDs(ep_ids)
    if (invalid_ids && invalid_ids.length > 0) {
      this.error(`Invalid Escalation Policy ID's: ${invalid_ids.join(', ')}`, {exit: 1})
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
      if (levels.length === 1) {
        // eslint-disable-next-line no-console
        console.error(chalk.bold.red('Escalation policy ') + chalk.bold.blue(ep.escalation_policy.summary) + chalk.bold.red(' only has one level'))
        continue
      }
      levels.splice(flags.level - 1, 1)

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
    if (requests.length === 0) {
      this.error('Nothing to do.', {exit: 0})
    }
    // console.log(JSON.stringify(requests, null, 2))
    r = await this.pd.batchedRequestWithSpinner(requests, {
      activityDescription: `Updating ${requests.length} escalation policies`,
    })
    for (const failure of r.getFailedIndices()) {
      const f = requests[failure] as any
      // eslint-disable-next-line no-console
      console.error(`${chalk.bold.red('Failed to update escalation policy ')}${chalk.bold.blue(f.data.escalation_policy.id)}: ${r.results[failure].getFormattedError()}`)
    }
  }
}
