import { BaseCommand } from '../../base/base-command'
import * as chrono from 'chrono-node'

export default class UtilTimestamp extends BaseCommand<typeof UtilTimestamp> {
  static description = 'Make ISO8601 timestamps'

  static strict = false

  static args = [
    {
      name: 'date',
      description: 'A human-style date/time, like "4pm 1/1/2021" or "Dec 2 1pm", etc. Default: now',
    },
  ]

  async run() {
    let dateObj
    if (this.argv.length > 0) {
      dateObj = chrono.strict.parseDate(this.argv.join(' '))
    }
    if (!dateObj) {
      dateObj = new Date()
    }
    this.log(dateObj.toISOString())
  }
}
