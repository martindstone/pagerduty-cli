import { BaseCommand } from '../../base/base-command'
import axios, { Method } from 'axios'
import { CliUx, Flags } from '@oclif/core'
import chalk from 'chalk'
import * as utils from '../../utils'
import * as chrono from 'chrono-node'

export default class EventChange extends BaseCommand<typeof EventChange> {
  static description = 'Send a Change Event to PagerDuty'

  static flags = {
    routing_key: Flags.string({
      char: 'r',
      description: 'The integration key to send to',
      required: true,
    }),
    summary: Flags.string({
      description: 'A brief text summary of the event, used to generate the summaries/titles of any associated alerts. The maximum permitted length of this property is 1024 characters.',
      required: true,
    }),
    source: Flags.string({
      description: 'The unique location of the affected system, preferably a hostname or FQDN.',
    }),
    timestamp: Flags.string({
      description: 'The time at which the emitting tool detected or generated the event.'
    }),
    keys: Flags.string({
      char: 'k',
      description: 'Custom details keys to set. JSON paths OK. Specify multiple times to set multiple keys.',
      multiple: true,
    }),
    values: Flags.string({
      char: 'v',
      description: 'Custom details values to set. JSON OK. To set multiple key/values, specify multiple times in the same order as the keys.',
      multiple: true,
    }),
    link_hrefs: Flags.string({
      char: 'L',
      description: 'A clickable link URL for included links.',
      multiple: true
    }),
    link_texts: Flags.string({
      char: 'T',
      description: 'Link text for included links. Specify in the same order as the link URLs.',
      multiple: true
    }),
    endpoint: Flags.string({
      char: 'e',
      description: 'Send the event to an alternate HTTPS endpoint, for example when using with PDaltagent.'
    }),
    jsonvalues: Flags.boolean({
      description: 'Interpret values as JSON [default: true]',
      default: true,
      allowNo: true,
    }),
    json: Flags.boolean({
      char: 'j',
      description: 'Output PagerDuty response as JSON',
      exclusive: ['pipe'],
    }),
  }

  async run() {
    const {
      routing_key,
      summary,
      source,
      timestamp: timestampStr,
      keys, values,
      link_hrefs, link_texts,
      endpoint,
      jsonvalues,
      json,
    } = this.flags

    let timestamp
    if (timestampStr) {
      const ts = chrono.parseDate(timestampStr)
      if (ts) {
        timestamp = ts.toISOString()
      } else {
        this.error(`Error parsing date ${timestampStr}`, { exit: 1 })
      }
    }

    if (endpoint) {
      try {
        new URL(endpoint)
      } catch (e) {
        this.error(`${endpoint} is not a valid URL`, { exit: 1 })
      }
    }

    if (keys || values) {
      if (!(keys && values && keys.length === values.length)) {
        this.error('You must specify the same number of keys and values for this to work.', { exit: 1 })
      }
    }

    if (link_texts && link_texts.length > 0 && !(link_hrefs && link_hrefs.length >= link_texts.length)) {
      this.error('You can\'t have more link_texts than link_hrefs.', { exit: 1 })
    }

    const event: any = {
      routing_key,
      payload: {
        summary,
        source,
        timestamp,
      },
    }

    if (keys && values) {
      const custom_details = {}
      for (const [i, key] of keys.entries()) {
        let value = values[i]
        if (jsonvalues) {
          try {
            const jsonvalue = JSON.parse(value)
            value = jsonvalue
          } catch (e) { }
        }
        utils.setValueAtPath(custom_details, key, value)
      }
      event.payload.custom_details = custom_details
    }

    if (link_hrefs) {
      event.links = []
      for (const [i, link_href] of link_hrefs.entries()) {
        const link: any = {
          href: link_href,
        }
        if (link_texts) link.text = link_texts[i]
        event.links.push(link)
      }
    }

    CliUx.ux.action.start('Sending change event to PagerDuty')
    const config = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      url: endpoint || 'https://events.pagerduty.com/v2/change/enqueue',
      data: event,
    }
    let r
    try {
      r = await axios.request(config)
    } catch (e: any) {
      CliUx.ux.action.stop(chalk.bold.red('failed!'))
      let errorStr = `${e.response.status} ${e.response.statusText}`
      if (e.response.data) {
        if (typeof e.response.data == 'string') {
          errorStr += ': ' + chalk.bold.red(e.response.data)
        } else if (e.response.data.errors) {
          errorStr += ': ' + chalk.bold.red(e.response.data.errors.join(', '))
        }
      }
      this.error(errorStr, { exit: 1 })
    }

    CliUx.ux.action.stop(chalk.bold.green('done'))

    if (json) {
      utils.printJsonAndExit(r.data)
    }

    this.log(r.data.message)
  }
}
