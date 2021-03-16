import Command from '../../base'
import {flags} from '@oclif/command'
import cli from 'cli-ux'
import getStream from 'get-stream'
import * as utils from '../../utils'
import jp from 'jsonpath'

export default class IncidentAnalytics extends Command {
  static description = 'Acknowledge PagerDuty Incidents'

  static aliases = ['incident:acknowledge']

  static flags = {
    ...Command.flags,
    ids: flags.string({
      char: 'i',
      description: 'Incident ID\'s to look at. Specify multiple times for multiple incidents.',
      multiple: true,
      exclusive: ['pipe'],
    }),
    keys: flags.string({
      char: 'k',
      description: 'Additional fields to display. Specify multiple times for multiple fields.',
      multiple: true,
    }),
    json: flags.boolean({
      char: 'j',
      description: 'output full details as JSON',
      exclusive: ['columns', 'filter', 'sort', 'csv', 'extended'],
    }),
    pipe: flags.boolean({
      char: 'p',
      description: 'Read incident ID\'s from stdin.',
      exclusive: ['ids'],
    }),
    ...cli.table.flags(),
  }

  async run() {
    const {flags} = this.parse(IncidentAnalytics)

    // get a validated token from base class
    // const token = this.token

    let incident_ids: string[] = []
    if (flags.ids) {
      incident_ids = utils.splitDedupAndFlatten(flags.ids)
    } else if (flags.pipe) {
      const str: string = await getStream(process.stdin)
      incident_ids = utils.splitDedupAndFlatten([str])
    } else {
      this.error('You must specify one of: -i, -p', {exit: 1})
    }

    const invalid_ids = utils.invalidPagerDutyIDs(incident_ids)
    if (invalid_ids && invalid_ids.length > 0) {
      this.error(`Invalid incident ID's: ${invalid_ids.join(', ')}`, {exit: 1})
    }

    const requests = incident_ids.map(incident_id => {
      return {
        endpoint: `analytics/raw/incidents/${incident_id}`,
        headers: {'X-EARLY-ACCESS': 'analytics-v2'},
      }
    })

    const br = await this.pd.batchedRequestWithSpinner(requests, {activityDescription: 'Getting incident analytics'})

    const analytics = br.getDatas()
    if (flags.json) {
      await utils.printJsonAndExit(analytics)
    }

    const columns: Record<string, object> = {
      id: {
        header: 'ID',
      },
      created: {
        get: (row: { created_at: string }) => (new Date(row.created_at)).toLocaleString(),
      },
      description: {
        get: (row: any) => utils.formatField(row.description),
      },
      seconds_to_engage: {
        header: 'Sec to engage',
        get: (row: any) => utils.formatField(row.seconds_to_engage),
      },
      seconds_to_first_ack: {
        header: 'Sec to 1st ack',
        get: (row: any) => utils.formatField(row.seconds_to_first_ack),
      },
      seconds_to_mobilize: {
        header: 'Sec to mobilize',
        get: (row: any) => utils.formatField(row.seconds_to_mobilize),
      },
      seconds_to_resolve: {
        header: 'Sec to resolve',
        get: (row: any) => utils.formatField(row.seconds_to_resolve),
      },
      engaged_seconds: {
        header: 'Sec engaged',
        get: (row: any) => utils.formatField(row.engaged_seconds),
      },
      engaged_user_count: {
        header: 'Engaged users',
        get: (row: any) => utils.formatField(row.engaged_user_count),
      },
    }

    if (flags.keys) {
      for (const key of flags.keys) {
        columns[key] = {
          header: key,
          get: (row: any) => utils.formatField(jp.query(row, key)),
        }
      }
    }

    const options = {
      printLine: this.log,
      ...flags, // parsed flags
    }
    cli.table(analytics, columns, options)
  }
}
