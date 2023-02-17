import { ListBaseCommand } from '../../base/list-base-command'

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

    this.printTable(tags, columns, this.flags)
  }
}
