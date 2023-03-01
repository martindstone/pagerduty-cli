`pd event`
==========

Send an Alert to PagerDuty

* [`pd event alert`](#pd-event-alert)
* [`pd event change`](#pd-event-change)

## `pd event alert`

Send an Alert to PagerDuty

```
USAGE
  $ pd event alert

FLAGS
  -A, --image_alts=<value>...   Alternate text for included images. Specify in the same order as the image URLs.
  -H, --image_hrefs=<value>...  A clickable link URL for included images. Specify in the same order as the image URLs.
  -I, --image_srcs=<value>...   The source URL of an image to include. Multiple times for multiple images.
  -L, --link_hrefs=<value>...   A clickable link URL for included links.
  -T, --link_texts=<value>...   Link text for included links. Specify in the same order as the link URLs.
  -a, --action=<option>         [default: trigger] The type of event.
                                <options: trigger|acknowledge|resolve>
  -c, --client=<value>          A human-readable description of the system that is sending the alert
  -d, --dedup_key=<value>       Deduplication key for correlating triggers and resolves. The maximum permitted length of
                                this property is 255 characters.
  -e, --endpoint=<value>        Send the event to an alternate HTTPS endpoint, for example when using with PDaltagent.
  -h, --help                    Show CLI help.
  -j, --json                    Output PagerDuty response as JSON
  -k, --keys=<value>...         Custom details keys to set. JSON paths OK. Specify multiple times to set multiple keys.
  -p, --pipe                    Print dedup key only to stdout, for use with pipes.
  -r, --routing_key=<value>     (required) The integration key to send to
  -u, --client_url=<value>      A URL to the system that is sending the alert
  -v, --values=<value>...       Custom details values to set. JSON OK. To set multiple key/values, specify multiple
                                times in the same order as the keys.
  --class=<value>               The class/type of the event, for example ping failure or cpu load
  --component=<value>           Component of the source machine that is responsible for the event, for example mysql or
                                eth0
  --debug                       Print REST API call debug logs
  --group=<value>               Logical grouping of components of a service, for example app-stack
  --[no-]jsonvalues             Interpret values as JSON [default: true]
  --severity=<option>           [default: critical] The perceived severity of the status the event is describing with
                                respect to the affected system.
                                <options: critical|error|warning|info>
  --source=<value>              (required) The unique location of the affected system, preferably a hostname or FQDN.
  --summary=<value>             (required) A brief text summary of the event, used to generate the summaries/titles of
                                any associated alerts. The maximum permitted length of this property is 1024 characters.
  --timestamp=<value>           The time at which the emitting tool detected or generated the event.

DESCRIPTION
  Send an Alert to PagerDuty
```

## `pd event change`

Send a Change Event to PagerDuty

```
USAGE
  $ pd event change

FLAGS
  -L, --link_hrefs=<value>...  A clickable link URL for included links.
  -T, --link_texts=<value>...  Link text for included links. Specify in the same order as the link URLs.
  -e, --endpoint=<value>       Send the event to an alternate HTTPS endpoint, for example when using with PDaltagent.
  -h, --help                   Show CLI help.
  -j, --json                   Output PagerDuty response as JSON
  -k, --keys=<value>...        Custom details keys to set. JSON paths OK. Specify multiple times to set multiple keys.
  -r, --routing_key=<value>    (required) The integration key to send to
  -v, --values=<value>...      Custom details values to set. JSON OK. To set multiple key/values, specify multiple times
                               in the same order as the keys.
  --debug                      Print REST API call debug logs
  --[no-]jsonvalues            Interpret values as JSON [default: true]
  --source=<value>             The unique location of the affected system, preferably a hostname or FQDN.
  --summary=<value>            (required) A brief text summary of the event, used to generate the summaries/titles of
                               any associated alerts. The maximum permitted length of this property is 1024 characters.
  --timestamp=<value>          The time at which the emitting tool detected or generated the event.

DESCRIPTION
  Send a Change Event to PagerDuty
```
