import { AuthenticatedBaseCommand } from '../../base/authenticated-base-command'
import { CliUx, Flags } from '@oclif/core'
import chalk from 'chalk'
import getStream from 'get-stream'
import * as utils from '../../utils'

export default class UtilDeleteResource extends AuthenticatedBaseCommand<typeof UtilDeleteResource> {
  static description = `Dangerous - Delete PagerDuty Resources`

  static flags = {
    'resource-type': Flags.string({
      char: 't',
      description: 'The type of PagerDuty resource to delete. You have to provide either -i or -p to specify IDs of objects to delete.',
      options: [
        'business_service',
        'escalation_policy',
        'extension',
        'response_play',
        'ruleset',
        'schedule',
        'service',
        'tag',
        'team',
        'user',
        'webhook_subscription',
        'automation_action',
        'automation_runner',
        'field',
        'field_schema',
      ],
      exclusive: ['endpoint'],
      required: true,
    }),
    ids: Flags.string({
      char: 'i',
      description: 'Select resources with the given ID. Specify multiple times for multiple resources.',
      multiple: true,
    }),
    pipe: Flags.boolean({
      char: 'p',
      description: 'Read resource ID\'s from stdin.',
      exclusive: ['ids'],
    }),
    force: Flags.boolean({
      description: chalk.red('Extreme danger mode') + ': do not prompt before deleting',
    }),
  }

  async run() {
    if (!(this.flags.ids || this.flags.pipe)) {
      this.error('You must specify at least one of: -i, -p', { exit: 1 })
    }

    const resource_types: Record<string, any> = {
      'user': {
        endpoint: 'users',
        name: 'users',
      },
      'escalation_policy': {
        endpoint: 'escalation_policies',
        name: 'escalation policies',
      },
      'service': {
        endpoint: 'services',
        name: 'services',
      },
      'schedule': {
        endpoint: 'schedules',
        name: 'schedules',
      },
      'team': {
        endpoint: 'teams',
        name: '',
      },
      'extension': {
        endpoint: 'extensions',
        name: 'teams',
      },
      'response_play': {
        endpoint: 'response_plays',
        name: 'response plays',
      },
      'tag': {
        endpoint: 'tags',
        name: 'tags',
      },
      'ruleset': {
        endpoint: 'rulesets',
        name: 'rulesets',
      },
      'webhook_subscription': {
        endpoint: 'webhook_subscriptions',
        name: 'webhook subscriptions',
      },
      'business_service': {
        endpoint: 'business_services',
        name: 'business services',
      },
      'automation_action': {
        endpoint: 'automation_actions/actions',
        name: 'automation actions',
      },
      'automation_runner': {
        endpoint: 'automation_actions/runners',
        name: 'automation runners',
      },
      'field': {
        endpoint: 'customfields/fields',
        name: 'fields',
      },
      'field_schema': {
        endpoint: 'customfields/schemas',
        name: 'field schemas',
      }
    }

    const resource_types_with_weird_ids = [
      'automation_action',
      'automation_runner',
    ]

    const resource = resource_types[this.flags['resource-type']]

    const headers: Record<string, string> = {}
    if (['field', 'field_schema'].includes(this.flags['resource-type'])) {
      headers['X-EARLY-ACCESS'] = 'flex-service-early-access'
    }

    let resource_ids: string[] = []
    if (this.flags.ids) {
      resource_ids = utils.splitDedupAndFlatten(this.flags.ids)
    }
    if (this.flags.pipe) {
      const str: string = await getStream(process.stdin)
      resource_ids = utils.splitDedupAndFlatten([str])
      if (!this.flags.force) {
        this.error(`You have to use --force if you are using util:deleteresource --pipe. ${chalk.bold('Be careful!')}`)
      }
    }

    if (resource_ids.length === 0) {
      this.error('No resource ID\'s were specified.', { exit: 1 })
    }

    const invalid_ids = utils.invalidPagerDutyIDs(resource_ids)
    if (!resource_types_with_weird_ids.includes(this.flags['resource-type']) && invalid_ids && invalid_ids.length > 0) {
      this.error(`Invalid resource ID's: ${invalid_ids.join(', ')}`, { exit: 1 })
    }

    const things_to_delete_str = `${resource_ids.length} ${resource.name}`

    if (this.flags.force) {
      let countdown = 5
      while (countdown > -1) {
        CliUx.ux.action.start(`Warning: util deleteresource running in ${chalk.bold.red('extreme danger mode')}!\nHit ${chalk.bold.blue('Ctrl-C')} if you don't want to delete ${things_to_delete_str}.\nStarting in ${chalk.bold(String(countdown) + ' seconds')}`)
        // eslint-disable-next-line no-await-in-loop
        await CliUx.ux.wait(1000)
        countdown--
      }
      CliUx.ux.action.stop(chalk.bold.green('ok'))
    } else {
      const confirm_str = `Yes, delete ${things_to_delete_str}`
      const ok = await CliUx.ux.prompt(chalk.bold.red(`About to delete ${chalk.bold(things_to_delete_str)}. Are you absolutely sure?\nType '${chalk.bold.blue(confirm_str)}' to confirm`), { default: 'nope' })
      if (ok !== confirm_str) {
        // eslint-disable-next-line no-console
        console.warn(`OK, doing nothing... ${chalk.bold.green('done')}`)
        this.exit(0)
      }
    }

    const requests: any[] = []
    for (const resource_id of resource_ids) {
      requests.push({
        endpoint: `/${resource.endpoint}/${resource_id}`,
        method: 'DELETE',
        params: {},
        headers
      })
    }

    const r = await this.pd.batchedRequestWithSpinner(requests, {
      activityDescription: `Deleting ${requests.length} ${resource.name}`,
    })

    for (const failure of r.getFailedIndices()) {
      // eslint-disable-next-line no-console
      const resource_id = requests[failure].endpoint.split('/').pop()
      console.error(`${chalk.bold.red(`Failed to delete ${this.flags['resource-type']} `)}${chalk.bold.blue(resource_id)}: ${r.results[failure].getFormattedError()}`)
    }
  }
}
