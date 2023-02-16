import { ListBaseCommand } from '../../base/list-base-command'
import { CliUx, Flags } from '@oclif/core'
import * as utils from '../../utils'
import jp from 'jsonpath'

export default class TagList extends ListBaseCommand<typeof TagList> {
  static description = 'List PagerDuty Tags'

  async run() {
    const params: Record<string, any> = {
    }

    if (this.flags.name) {
      params.query = this.flags.name
    }

    let tags = await this.pd.fetchWithSpinner('tags', {
      params,
      activityDescription: 'Getting tags from PD',
      fetchLimit: this.flags.limit,
    })

    if (tags.length === 0) {
      this.error('No tags found.', { exit: 1 })
    }
    if (this.flags.json) {
      this.printJsonAndExit(tags)
    }

    const columns: Record<string, object> = {
      id: {
        header: 'ID',
      },
      summary: {
        header: 'Name',
      },
    }

    if (this.flags.keys) {
      for (const key of this.flags.keys) {
        columns[key] = {
          header: key,
          get: (row: any) => utils.formatField(jp.query(row, key), this.flags.delimiter),
        }
      }
    }

    this.printTable(tags, columns, this.flags)
  }
}
