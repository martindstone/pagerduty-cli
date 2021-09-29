import Command from '../../base'
import {flags} from '@oclif/command'
import chalk from 'chalk'
import cli from 'cli-ux'
import getStream from 'get-stream'
import * as utils from '../../utils'
import log from 'ololog'
import jp from 'jsonpath'

export default class IncidentAlerts extends Command {
  static description = 'Show Alerts in PagerDuty Incidents'

  static flags = {
    ...Command.flags,
    me: flags.boolean({
      char: 'm',
      description: 'Show alerts for all incidents assigned to me',
      exclusive: ['ids', 'pipe'],
    }),
    ids: flags.string({
      char: 'i',
      description: 'Show alerts for these Incident ID\'s. Specify multiple times for multiple incidents.',
      multiple: true,
      exclusive: ['me', 'pipe'],
    }),
    pipe: flags.boolean({
      char: 'p',
      description: 'Read incident ID\'s from stdin.',
      exclusive: ['me', 'ids'],
    }),
    json: flags.boolean({
      char: 'j',
      description: 'output full details as JSON',
      exclusive: ['columns', 'filter', 'sort', 'csv', 'extended'],
    }),
    keys: flags.string({
      char: 'k',
      description: 'Additional fields to display. Specify multiple times for multiple fields.',
      multiple: true,
    }),
    delimiter: flags.string({
      char: 'd',
      description: 'Delimiter for fields that have more than one value',
      default: '\n',
    }),
    ...cli.table.flags(),
  }

  async run() {
    const {flags} = this.parse(IncidentAlerts)

    let incident_ids: string[] = []
    if (flags.me) {
      const me = await this.me(true)

      const params = {user_ids: [me.user.id]}
      const incidents = await this.pd.fetchWithSpinner('incidents', {
        params: params,
        activityDescription: 'Getting incidents from PD',
        stopSpinnerWhenDone: false,
      })
      if (incidents.length === 0) {
        // eslint-disable-next-line no-console
        log.error.red(chalk.bold.red('No incidents to acknowledge'))
        this.exit(0)
      }
      incident_ids = incidents.map((e: { id: any }) => e.id)
    } else if (flags.ids) {
      incident_ids = utils.splitDedupAndFlatten(flags.ids)
    } else if (flags.pipe) {
      const str: string = await getStream(process.stdin)
      incident_ids = utils.splitDedupAndFlatten([str])
    } else {
      this.error('You must specify one of: -i, -m, -p', {exit: 1})
    }

    const invalid_ids = utils.invalidPagerDutyIDs(incident_ids)
    if (invalid_ids && invalid_ids.length > 0) {
      this.error(`Invalid incident ID's: ${invalid_ids.join(', ')}`, {exit: 1})
    }

    let alerts: any[] = []
    for (const incident_id of incident_ids) {
      // eslint-disable-next-line no-await-in-loop
      const r = await this.pd.fetchWithSpinner(`incidents/${incident_id}/alerts`, {
        activityDescription: `Getting alerts for incident ${chalk.bold.blue(incident_id)}`,
        stopSpinnerWhenDone: false,
      })
      alerts = [...alerts, ...r]
    }
    cli.action.stop(chalk.bold.green('done'))
    if (alerts.length === 0) {
      this.error('No incidents found', {exit: 0})
    }
    if (flags.json) {
      await utils.printJsonAndExit(alerts)
    }

    const columns: Record<string, object> = {
      id: {
        header: 'ID',
      },
      incident_id: {
        header: 'Incident ID',
        get: (row: any) => row.incident.id,
      },
      status: {
        get: (row: {status: string}) => {
          switch (row.status) {
          case 'triggered':
            return chalk.bold.red(row.status)
          case 'acknowledged':
            return chalk.bold.keyword('orange')(row.status)
          case 'resolved':
            return chalk.bold.green(row.status)
          default:
            return row.status
          }
        },
      },
      summary: {
      },
      created: {
        get: (row: { created_at: string }) => (new Date(row.created_at)).toLocaleString(),
      },
      html_url: {
        header: 'URL',
        extended: true,
      },
    }

    if (flags.keys) {
      for (const key of flags.keys) {
        columns[key] = {
          header: key,
          get: (row: any) => utils.formatField(jp.query(row, key), flags.delimiter),
        }
      }
    }

    const options = {
      printLine: this.log,
      ...flags, // parsed flags
    }

    cli.table(alerts, columns, options)
  }
}
