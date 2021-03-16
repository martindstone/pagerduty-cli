import Command from '../../base'
import {flags} from '@oclif/command'
import chalk from 'chalk'
import cli from 'cli-ux'

export default class IncidentNotes extends Command {
  static description = 'See or add notes on PagerDuty Incidents'

  static flags = {
    ...Command.flags,
    id: flags.string({
      char: 'i',
      description: 'Incident ID.',
      required: true,
    }),
    note: flags.string({
      char: 'n',
      description: 'Note to add',
      exclusive: [...Object.keys(cli.table.flags())],
    }),
    from: flags.string({
      char: 'F',
      description: 'Login email of a PD user account for the "From:" header. Use only with legacy API tokens.',
    }),
    ...cli.table.flags(),
  }

  async run() {
    const {flags} = this.parse(IncidentNotes)

    const headers: Record<string, string> = {}
    if (flags.from) {
      headers.From = flags.from
    }

    if (flags.note) {
      // add a note
      cli.action.start(`Adding a note to incident ${chalk.bold.blue(flags.id)}`)
      const body = {
        note: {
          content: flags.note,
        },
      }
      const r = await this.pd.request({
        endpoint: `incidents/${flags.id}/notes`,
        method: 'POST',
        data: body,
        headers: headers,
      })
      if (r.isFailure) this.error(`Failed to add note: ${r.getFormattedError()}`)
      const note = r.getData()
      if (note && note.note && note.note.id) {
        cli.action.stop(chalk.bold.green('done'))
      } else {
        cli.action.stop(chalk.bold.red('failed!'))
      }
    } else {
      // get notes
      cli.action.start(`Getting notes for incident ${chalk.bold.blue(flags.id)}`)
      const notes = await this.pd.fetchWithSpinner(`incidents/${flags.id}/notes`, {
        activityDescription: `Getting notes for incident ${chalk.bold.blue(flags.id)}`,
      })
      if (notes.length === 0) {
        this.error('No notes found', {exit: 1})
      }

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
}
