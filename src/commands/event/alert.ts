import { BaseCommand } from '../../base/base-command'
import axios, {Method} from 'axios'
import {CliUx, Flags} from '@oclif/core'
import chalk from 'chalk'
import * as utils from '../../utils'
import * as chrono from 'chrono-node'

export default class EventAlert extends BaseCommand<typeof EventAlert> {
  static description = 'Send an Alert to PagerDuty'

  static flags = {
    routing_key: Flags.string({
      char: 'r',
      description: 'The integration key to send to',
      required: true,
    }),
    dedup_key: Flags.string({
      char: 'd',
      description: 'Deduplication key for correlating triggers and resolves. The maximum permitted length of this property is 255 characters.',
    }),
    action: Flags.string({
      char: 'a',
      description: 'The type of event.',
      options: ['trigger', 'acknowledge', 'resolve'],
      default: 'trigger',
    }),
    summary: Flags.string({
      description: 'A brief text summary of the event, used to generate the summaries/titles of any associated alerts. The maximum permitted length of this property is 1024 characters.',
      required: true,
    }),
    source: Flags.string({
      description: 'The unique location of the affected system, preferably a hostname or FQDN.',
      required: true,
    }),
    severity: Flags.string({
      description: 'The perceived severity of the status the event is describing with respect to the affected system.',
      options: ['critical', 'error', 'warning', 'info'],
      default: 'critical',
    }),
    timestamp: Flags.string({
      description: 'The time at which the emitting tool detected or generated the event.'
    }),
    component: Flags.string({
      description: 'Component of the source machine that is responsible for the event, for example mysql or eth0'
    }),
    group: Flags.string({
      description: 'Logical grouping of components of a service, for example app-stack'
    }),
    class: Flags.string({
      description: 'The class/type of the event, for example ping failure or cpu load'
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
    image_srcs: Flags.string({
      char: 'I',
      description: 'The source URL of an image to include. Multiple times for multiple images.',
      multiple: true
    }),
    image_hrefs: Flags.string({
      char: 'H',
      description: 'A clickable link URL for included images. Specify in the same order as the image URLs.',
      multiple: true
    }),
    image_alts: Flags.string({
      char: 'A',
      description: 'Alternate text for included images. Specify in the same order as the image URLs.',
      multiple: true
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
    client: Flags.string({
      char: 'c',
      description: 'A human-readable description of the system that is sending the alert',
    }),
    client_url: Flags.string({
      char: 'u',
      description: 'A URL to the system that is sending the alert',
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
    pipe: Flags.boolean({
      char: 'p',
      description: 'Print dedup key only to stdout, for use with pipes.',
      exclusive: ['json'],
    }),
  }

  async run() {
    const {
      routing_key,
      dedup_key,
      action: event_action,
      summary,
      source,
      severity,
      timestamp: timestampStr,
      component,
      group,
      class: eventClass,
      keys, values,
      image_srcs, image_hrefs, image_alts,
      link_hrefs, link_texts,
      client, client_url,
      endpoint,
      jsonvalues,
      json,
      pipe,
    } = this.flags

    let timestamp
    if (timestampStr) {
      const ts = chrono.parseDate(timestampStr)
      if (ts) {
        timestamp = ts.toISOString()
      } else {
        this.error(`Error parsing date ${timestampStr}`, {exit: 1})
      }
    }

    if (endpoint) {
      try {
        new URL(endpoint)
      } catch (e) {
        this.error(`${endpoint} is not a valid URL`, {exit: 1})
      }
    }

    if (['acknowledge', 'resolve'].includes(event_action) && !dedup_key) {
      this.error('When acknowledging or resolving an alert, dedup_key is required.', {exit: 1})
    }

    if (keys || values) {
      if (!(keys && values && keys.length === values.length)) {
        this.error('You must specify the same number of keys and values for this to work.', {exit: 1})
      }
    }

    if (image_hrefs && image_hrefs.length > 0 && !(image_srcs && image_srcs.length >= image_hrefs.length)) {
      this.error('You can\'t have more image_hrefs than img_srcs.', {exit: 1})
    }
    if (image_alts && image_alts.length > 0 && !(image_srcs && image_srcs.length >= image_alts.length)) {
      this.error('You can\'t have more image_alts than image_srcs.', {exit: 1})
    }

    if (link_texts && link_texts.length > 0 && !(link_hrefs && link_hrefs.length >= link_texts.length)) {
      this.error('You can\'t have more link_texts than link_hrefs.', {exit: 1})
    }

    if ((client && !client_url) || (client_url && !client)) {
      this.error('If one of client_url and client is given, then the other one must be given as well.', {exit: 1})
    }

    const event: any = {
      routing_key,
      event_action,
      dedup_key,
      payload: {
        summary,
        source,
        severity,
        timestamp,
        component,
        group,
        class: eventClass
      },
      client,
      client_url,
    }

    if (keys && values) {
      const custom_details = {}
      for (const [i, key] of keys.entries()) {
        let value = values[i]
        if (jsonvalues) {
          try {
            const jsonvalue = JSON.parse(value)
            value = jsonvalue
          } catch (e) {}
        }
        utils.setValueAtPath(custom_details, key, value)
      }
      event.payload.custom_details = custom_details
    }

    if (image_srcs) {
      event.images = []
      for (const [i, image_src] of image_srcs.entries()) {
        const image: any = {
          src: image_src,
        }
        if (image_alts) image.alt = image_alts[i]
        if (image_hrefs) image.href = image_hrefs[i]
        event.images.push(image)
      }
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

    CliUx.ux.action.start('Sending event to PagerDuty')
    const config = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      url: endpoint || 'https://events.pagerduty.com/v2/enqueue',
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
      this.error(errorStr, {exit: 1})
    }
    
    CliUx.ux.action.stop(chalk.bold.green('done'))

    if (json) {
      utils.printJsonAndExit(r.data)
    }
    if (pipe) {
      this.log(r.data.dedup_key)
      this.exit()
    }
    let outStr = r.data.message
    if (r.data.dedup_key) {
      outStr += `, dedup key ${chalk.bold.blue(r.data.dedup_key)}`
    }
    this.log(outStr)
  }
}
