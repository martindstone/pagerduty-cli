import { AuthenticatedBaseCommand } from '../../base/authenticated-base-command'
import { CliUx, Flags } from '@oclif/core'
import chalk from 'chalk'

export default class IncidentNotes extends AuthenticatedBaseCommand<typeof IncidentNotes> {
  static description = 'See or add notes on PagerDuty Incidents'

  static flags = {
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
    const headers: Record<string, string> = {}
    if (this.flags.from) {
      headers.From = this.flags.from
    }

    if (this.flags.note) {
      // add a note
      CliUx.ux.action.start(`Adding a note to incident ${chalk.bold.blue(this.flags.id)}`)
      const body = {
        note: {
          content: this.flags.note,
        },
      }
      const r = await this.pd.request({
        endpoint: `incidents/${this.flags.id}/notes`,
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
      CliUx.ux.action.start(`Getting notes for incident ${chalk.bold.blue(this.flags.id)}`)
      const notes = await this.pd.fetchWithSpinner(`incidents/${this.flags.id}/notes`, {
        activityDescription: `Getting notes for incident ${chalk.bold.blue(this.flags.id)}`,
      })
      if (notes.length === 0) {
        this.error('No notes found', { exit: 1 })
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

      this.printTable(notes, columns, this.flags)
    }
  }
}
