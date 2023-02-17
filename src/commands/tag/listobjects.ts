import { AuthenticatedBaseCommand } from '../../base/authenticated-base-command'
import { CliUx, Flags } from '@oclif/core'
import chalk from 'chalk'

export default class TagList extends AuthenticatedBaseCommand<typeof TagList> {
  static description = 'List Tagged PagerDuty Objects (Connected Entities)'

  static flags = {
    ids: Flags.string({
      char: 'i',
      description: 'The ID of a Tag to show. Specify multiple times for multiple tags',
      multiple: true,
      default: [],
    }),
    names: Flags.string({
      char: 'n',
      description: 'The name of a Tag to show. Specify multiple times for multiple tags',
      multiple: true,
      default: [],
    }),
    types: Flags.string({
      char: 't',
      description: 'The types of objects to show. Specify multiple times for multiple types',
      options: ['users', 'teams', 'escalation_policies'],
      multiple: true,
      default: ['users', 'teams', 'escalation_policies'],
    }),
    keys: Flags.string({
      char: 'k',
      description: 'Additional fields to display. Specify multiple times for multiple fields.',
      multiple: true,
    }),
    json: Flags.boolean({
      char: 'j',
      description: 'output full details as JSON',
      exclusive: ['columns', 'filter', 'sort', 'csv', 'extended'],
    }),
    pipe: Flags.boolean({
      char: 'p',
      description: 'Print object ID\'s only to stdout, for use with pipes.',
      exclusive: ['columns', 'sort', 'csv', 'extended', 'json'],
    }),
    delimiter: Flags.string({
      char: 'd',
      description: 'Delimiter for fields that have more than one value',
      default: '\\n',
    }),
    ...CliUx.ux.table.flags(),
  }

  public async init(): Promise<void> {
    await super.init()
    if (this.flags.delimiter === '\\n') {
      this.flags.delimiter = '\n'
    }
    if (this.flags.keys) {
      this.flags.keys = this.flags.keys.map(x => x.split(/,\s*/)).flat().filter(x => x)
    }
  }

  async run() {
    const { names, ids, types } = this.flags

    if (names.length > 0) {
      CliUx.ux.action.start(`Finding IDs for ${names.length} tags`)
      for (const remove_name of names) {
        const remove_id = await this.pd.tagIDForName(remove_name)
        if (remove_id) {
          ids.push(remove_id)
        } else {
          this.warn(`No tag was found with the name ${chalk.bold.blue(remove_name)}`)
        }
      }
      CliUx.ux.action.stop(chalk.bold.green('done'))
    }

    if (ids.length === 0) {
      this.error('No tags to show. You must provide at least -i or -n', { exit: 1 })
    }

    let rows: any[] = []
    CliUx.ux.action.start('Getting objects from PD...')
    for (const tag_id of ids) {
      for (const type of types) {
        const r = await this.pd.fetch(`tags/${tag_id}/${type}`)
        rows = [...rows, ...r.map((x: any) => {
          return {
            ...x,
            tag_id
          }
        })]
      }
    }
    CliUx.ux.action.stop(chalk.bold.green('done'))

    if (rows.length === 0) {
      this.error('No objects found.', { exit: 1 })
    }
    if (this.flags.json) {
      this.printJsonAndExit(rows)
    }

    const columns: Record<string, object> = {
      tag_id: {
        header: 'Tag ID',
      },
      id: {
        header: 'Object ID',
      },
      type: {
        header: 'Object Type',
        get: (row: any) => row.type.split('_reference')[0],
      },
    }

    this.printTable(rows, columns, this.flags)
  }
}
