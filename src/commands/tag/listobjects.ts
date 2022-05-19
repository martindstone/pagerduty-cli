import Command from '../../base'
import {CliUx, Flags} from '@oclif/core'
import chalk from 'chalk'
import * as utils from '../../utils'
import jp from 'jsonpath'

export default class TagList extends Command {
  static description = 'List Tagged PagerDuty Objects (Connected Entities)'

  static flags = {
    ...Command.flags,
    ...Command.listCommandFlags,
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
    ...CliUx.ux.table.flags(),
  }

  async run() {
    const {flags} = await this.parse(this.ctor)
    const {names, ids, types} = flags

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
      this.error('No tags to show. You must provide at least -i or -n', {exit: 1})
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
      this.error('No objects found.', {exit: 1})
    }
    if (flags.json) {
      await utils.printJsonAndExit(rows)
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

    if (flags.keys) {
      for (const key of flags.keys) {
        columns[key] = {
          header: key,
          get: (row: any) => utils.formatField(jp.query(row, key), flags.delimiter),
        }
      }
    }

    const options = {
      ...flags, // parsed flags
    }
    if (flags.pipe) {
      for (const k of Object.keys(columns)) {
        if (k !== 'id') {
          const colAny = columns[k] as any
          colAny.extended = true
        }
      }
      options['no-header'] = true
    }
    CliUx.ux.table(rows, columns, options)
  }
}
