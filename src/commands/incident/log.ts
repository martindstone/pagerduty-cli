/* eslint-disable complexity */
import Command from '../../base'
import {flags} from '@oclif/command'
import cli from 'cli-ux'
import chalk from 'chalk'
import getStream from 'get-stream'
import * as pd from '../../pd'
import * as utils from '../../utils'
import dotProp from 'dot-prop'

export default class IncidentLog extends Command {
  static description = 'Show PagerDuty Incident Log Entries'

  static flags = {
    ...Command.flags,
    ids: flags.string({
      char: 'i',
      description: 'Select incidents with the given ID. Specify multiple times for multiple incidents.',
      exclusive: ['pipe'],
      multiple: true,
    }),
    overview: flags.boolean({
      char: 'O',
      description: 'Get only `overview` log entries',
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
      description: 'Read incident IDs from stdin, for use with pipes.',
      exclusive: ['ids'],
    }),
    ...cli.table.flags(),
  }

  async run() {
    const {flags} = this.parse(IncidentLog)

    // get a validated token from base class
    const token = this.token as string

    if (!flags.ids && !flags.pipe) {
      this.error('You must specify at least one of: -i, -p', {exit: 1})
    }
    const params: Record<string, any> = {
      is_overview: flags.overview,
    }

    let r: pd.Result<any>
    let incident_ids: string[] = []

    if (flags.ids) {
      incident_ids = utils.splitDedupAndFlatten(flags.ids)
    } else if (flags.pipe) {
      const str: string = await getStream(process.stdin)
      incident_ids = utils.splitDedupAndFlatten([str])
    }

    const invalid_ids = utils.invalidPagerDutyIDs(incident_ids)
    if (invalid_ids && invalid_ids.length > 0) {
      this.error(`Invalid incident ID's: ${invalid_ids.join(', ')}`, {exit: 1})
    }
    if (incident_ids.length === 0) {
      this.error('No valid IDs specified. Nothing to do.', {exit: 1})
    }

    let log_entries: any[] = []
    for (const incident_id of incident_ids) {
      cli.action.start(`Getting log entries for incident ${chalk.bold.blue(incident_id)}`)
      // eslint-disable-next-line no-await-in-loop
      r = await pd.fetch(token, `/incidents/${incident_id}/log_entries`, params)
      this.dieIfFailed(r)
      cli.action.stop(chalk.bold.green(`got ${r.getValue().length}`))
      log_entries = [...log_entries, ...r.getValue()]
    }

    if (log_entries.length === 0) {
      this.exit(0)
    }
    if (flags.json) {
      this.log(JSON.stringify(log_entries, null, 2))
      this.exit(0)
    }

    const columns: Record<string, object> = {
      id: {
        header: 'Log Entry ID',
      },
      incident_id: {
        header: 'Incident ID',
        get: (row: { incident: any }) => row.incident.id,
      },
      type: {
        header: 'Log Entry Type',
      },
      created: {
        get: (row: { created_at: string }) => (new Date(row.created_at)).toLocaleString(),
      },
      summary: {
      },
    }

    if (flags.keys) {
      for (const key of flags.keys) {
        columns[key] = {
          header: key,
          get: (row: any) => utils.formatField(dotProp.get(row, key)),
        }
      }
    }
    if (!flags.sort) {
      flags.sort = 'created'
    }

    const options = {
      printLine: this.log,
      ...flags, // parsed flags
    }
    cli.table(log_entries, columns, options)
  }
}
