import Command from '../../base'
import {CliUx, Flags} from '@oclif/core'
import chalk from 'chalk'

export default class IncidentNotes extends Command {
  static description = 'See or add notes on PagerDuty Incidents'

  static flags = {
    ...Command.flags,
    id: Flags.string({
      char: 'i',
      description: 'Incident ID.',
      required: true,
    }),
    note: Flags.string({
      char: 'n',
      description: 'Note to add',
      exclusive: [...Object.keys(CliUx.ux.table.flags())],
    }),
    from: Flags.string({
      char: 'F',
      description: 'Login email of a PD user account for the "From:" header. Use only with legacy API tokens.',
    }),
    ...CliUx.ux.table.flags(),
  }

  async run() {
    const {flags} = await this.parse(IncidentNotes)

    const headers: Record<string, string> = {}
    if (flags.from) {
      headers.From = flags.from
    }

    if (flags.note) {
      // add a note
      CliUx.ux.action.start(`Adding a note to incident ${chalk.bold.blue(flags.id)}`)
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
        CliUx.ux.action.stop(chalk.bold.green('done'))
      } else {
        CliUx.ux.action.stop(chalk.bold.red('failed!'))
      }
    } else {
      // get notes
      CliUx.ux.action.start(`Getting notes for incident ${chalk.bold.blue(flags.id)}`)
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
        ...flags, // parsed flags
      }
      CliUx.ux.table(notes, columns, options)
    }
  }
}
