import { AuthenticatedBaseCommand } from '../../../base/authenticated-base-command'
import { CliUx, Flags } from '@oclif/core'
import chalk from 'chalk'

export default class BsSubscriberList extends AuthenticatedBaseCommand<typeof BsSubscriberList> {
  static description = 'List PagerDuty Business Service Subscribers'

  static flags = {
    id: Flags.string({
      char: 'i',
      description: 'Business Service ID to list subscribers for.',
      exclusive: ['name'],
    }),
    name: Flags.string({
      char: 'n',
      description: 'Business Service name to list subscribers for.',
      exclusive: ['id'],
    }),
    json: Flags.boolean({
      char: 'j',
      description: 'output full details as JSON',
      exclusive: ['columns', 'filter', 'sort', 'csv', 'extended'],
    }),
    pipe: Flags.boolean({
      char: 'p',
      description: 'Print subscriber ID\'s only to stdout, for use with pipes.',
      exclusive: ['columns', 'sort', 'csv', 'extended', 'json'],
    }),
    ...CliUx.ux.table.Flags,
  }

  async run() {
    let id = this.flags.id
    if (this.flags.name) {
      const found = await this.pd.businessServiceIDForName(this.flags.name)
      if (!found) {
        this.error(`No business service was found with the name ${chalk.bold.blue(this.flags.name)}`, {exit: 1})
      }
      id = found
    }

    const teams = await this.pd.fetchWithSpinner('teams', {
      activityDescription: 'Getting teams from PD',
      stopSpinnerWhenDone: false,
    })
    const teamsMap = Object.assign({}, ...teams.map(x => ({[x.id]: x})))

    const users = await this.pd.fetchWithSpinner('users', {
      activityDescription: 'Getting users from PD',
      stopSpinnerWhenDone: false,
    })
    const usersMap = Object.assign({}, ...users.map(x => ({[x.id]: x})))

    let bsss = await this.pd.fetchWithSpinner(`business_services/${id}/subscribers`, {
      activityDescription: 'Getting business service subscribers from PD',
    })

    let subscribers = bsss.map(s => {
      const user = usersMap[s.subscriber_id]
      const team = teamsMap[s.subscriber_id]
      return {
        ...s,
        user,
        team,
      }
    })

    if (this.flags.json) {
      await this.printJsonAndExit(subscribers)
    }

    const columns: Record<string, object> = {
      subscriber_id: {
        header: 'ID',
      },
      subscriber_type: {
        header: 'Type',
      },
      name: {
        get: (row: any) => row.user?.name || row.team?.summary || '',
      },
      email: {
        get: (row: any) => row.user?.email || '',
      }
    }

    if (this.flags.pipe) {
      subscribers = subscribers.map(x => ({...x, id: x.subscriber_id}))
    }
    this.printTable(subscribers, columns, this.flags)
  }
}
