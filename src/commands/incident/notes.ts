import Command from '../../base'
import {flags} from '@oclif/command'
import chalk from 'chalk'
import cli from 'cli-ux'
import * as pd from '../../pd'

export default class IncidentNotes extends Command {
  static description = 'Acknowledge PagerDuty Incidents'

  static flags = {
    ...Command.flags,
    id: flags.string({
      char: 'i',
      description: 'Incident ID.',
      required: true,
    }),
  }

  async run() {
    const {flags} = this.parse(IncidentNotes)

    // get a validated token from base class
    const token = this.token as string

    cli.action.start(`Getting notes for incident ${chalk.bold.blue(flags.id)}`)
    const notes = await pd.fetch(token, `/incidents/${flags.id}/notes`)
    if (notes.length === 0) {
      cli.action.stop(chalk.bold.red('none found'))
      return
    }
    cli.action.stop(`got ${notes.length}`)
    const columns: Record<string, object> = {
      id: {
        header: 'ID',
      },
      created: {
        get: (row: { created_at: string }) => (new Date(row.created_at)).toLocaleString(),
      },
      added_by: {
        get: (row: { user: { summary: any } }) => row.user.summary,
      },
      content: {
      },
    }
    const options = {
      printLine: this.log,
      ...flags, // parsed flags
    }
    cli.table(notes, columns, options)
  }
}
