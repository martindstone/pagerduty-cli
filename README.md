pagerduty-cli
=============

PagerDuty Command Line Interface

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/pagerduty-cli.svg)](https://npmjs.org/package/pagerduty-cli)
[![Downloads/week](https://img.shields.io/npm/dw/pagerduty-cli.svg)](https://npmjs.org/package/pagerduty-cli)
[![License](https://img.shields.io/npm/l/pagerduty-cli.svg)](https://github.com/martindstone/pagerduty-cli/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
```sh-session
$ sh -c "$(curl -sL http://www.pdtl.ink/pdcli)"
$ pd help
$ pd login
...
```
# Commands
<!-- commands -->
* [`pd auth:get`](#pd-authget)
* [`pd auth:set`](#pd-authset)
* [`pd auth:web`](#pd-authweb)
* [`pd autocomplete [SHELL]`](#pd-autocomplete-shell)
* [`pd commands`](#pd-commands)
* [`pd ep:list`](#pd-eplist)
* [`pd ep:oncall`](#pd-eponcall)
* [`pd ep:open`](#pd-epopen)
* [`pd help [COMMAND]`](#pd-help-command)
* [`pd incident:ack`](#pd-incidentack)
* [`pd incident:assign`](#pd-incidentassign)
* [`pd incident:create`](#pd-incidentcreate)
* [`pd incident:list`](#pd-incidentlist)
* [`pd incident:log`](#pd-incidentlog)
* [`pd incident:notes`](#pd-incidentnotes)
* [`pd incident:open`](#pd-incidentopen)
* [`pd incident:priority`](#pd-incidentpriority)
* [`pd incident:resolve`](#pd-incidentresolve)
* [`pd log`](#pd-log)
* [`pd login`](#pd-login)
* [`pd rest:delete`](#pd-restdelete)
* [`pd rest:fetch`](#pd-restfetch)
* [`pd rest:get`](#pd-restget)
* [`pd rest:post`](#pd-restpost)
* [`pd rest:put`](#pd-restput)
* [`pd schedule:list`](#pd-schedulelist)
* [`pd schedule:oncall`](#pd-scheduleoncall)
* [`pd schedule:open`](#pd-scheduleopen)
* [`pd schedule:override:add`](#pd-scheduleoverrideadd)
* [`pd schedule:override:list`](#pd-scheduleoverridelist)
* [`pd service:disable`](#pd-servicedisable)
* [`pd service:enable`](#pd-serviceenable)
* [`pd service:list`](#pd-servicelist)
* [`pd service:set`](#pd-serviceset)
* [`pd update [CHANNEL]`](#pd-update-channel)
* [`pd user:contact:add`](#pd-usercontactadd)
* [`pd user:contact:list`](#pd-usercontactlist)
* [`pd user:contact:set`](#pd-usercontactset)
* [`pd user:list`](#pd-userlist)
* [`pd user:log`](#pd-userlog)
* [`pd user:oncall`](#pd-useroncall)
* [`pd user:set`](#pd-userset)

## `pd auth:get`

Get PagerDuty Auth token

```
USAGE
  $ pd auth:get

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/auth/get.ts](https://github.com/martindstone/pagerduty-cli/blob/v0.0.59/src/commands/auth/get.ts)_

## `pd auth:set`

Set PagerDuty Auth token

```
USAGE
  $ pd auth:set

OPTIONS
  -t, --token=token  A PagerDuty API token
```

_See code: [src/commands/auth/set.ts](https://github.com/martindstone/pagerduty-cli/blob/v0.0.59/src/commands/auth/set.ts)_

## `pd auth:web`

Authenticate with PagerDuty in the browser

```
USAGE
  $ pd auth:web

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/auth/web.ts](https://github.com/martindstone/pagerduty-cli/blob/v0.0.59/src/commands/auth/web.ts)_

## `pd autocomplete [SHELL]`

display autocomplete installation instructions

```
USAGE
  $ pd autocomplete [SHELL]

ARGUMENTS
  SHELL  shell type

OPTIONS
  -r, --refresh-cache  Refresh cache (ignores displaying instructions)

EXAMPLES
  $ pd autocomplete
  $ pd autocomplete bash
  $ pd autocomplete zsh
  $ pd autocomplete --refresh-cache
```

_See code: [@oclif/plugin-autocomplete](https://github.com/oclif/plugin-autocomplete/blob/v0.3.0/src/commands/autocomplete/index.ts)_

## `pd commands`

list all the commands

```
USAGE
  $ pd commands

OPTIONS
  -h, --help              show CLI help
  -j, --json              display unfiltered api data in json format
  -x, --extended          show extra columns
  --columns=columns       only show provided columns (comma-separated)
  --csv                   output is csv format [alias: --output=csv]
  --filter=filter         filter property by partial string matching, ex: name=foo
  --hidden                show hidden commands
  --no-header             hide table header from output
  --no-truncate           do not truncate output to fit screen
  --output=csv|json|yaml  output in a more machine friendly format
  --sort=sort             property to sort by (prepend '-' for descending)
```

_See code: [@oclif/plugin-commands](https://github.com/oclif/plugin-commands/blob/v1.3.0/src/commands/commands.ts)_

## `pd ep:list`

List PagerDuty Escalation Policies

```
USAGE
  $ pd ep:list

OPTIONS
  -d, --delimiter=delimiter  [default:
                             ] Delimiter for fields that have more than one value

  -h, --help                 show CLI help

  -j, --json                 output full details as JSON

  -k, --keys=keys            Additional fields to display. Specify multiple times for multiple fields.

  -n, --name=name            Select escalation policies whose names contain the given text

  -p, --pipe                 Print escalation policy ID's only to stdout, for use with pipes.

  -x, --extended             show extra columns

  --columns=columns          only show provided columns (comma-separated)

  --csv                      output is csv format [alias: --output=csv]

  --filter=filter            filter property by partial string matching, ex: name=foo

  --no-header                hide table header from output

  --no-truncate              do not truncate output to fit screen

  --output=csv|json|yaml     output in a more machine friendly format

  --sort=sort                property to sort by (prepend '-' for descending)
```

_See code: [src/commands/ep/list.ts](https://github.com/martindstone/pagerduty-cli/blob/v0.0.59/src/commands/ep/list.ts)_

## `pd ep:oncall`

List a PagerDuty Escalation Policy's on call shifts.

```
USAGE
  $ pd ep:oncall

OPTIONS
  -h, --help              show CLI help
  -i, --id=id             Show oncalls for the EP with this ID.
  -j, --json              output full details as JSON
  -k, --keys=keys         Additional fields to display. Specify multiple times for multiple fields.
  -n, --name=name         Show oncalls for the EP with this name.
  -x, --extended          show extra columns
  --columns=columns       only show provided columns (comma-separated)
  --csv                   output is csv format [alias: --output=csv]
  --filter=filter         filter property by partial string matching, ex: name=foo
  --no-header             hide table header from output
  --no-truncate           do not truncate output to fit screen
  --output=csv|json|yaml  output in a more machine friendly format
  --since=since           The start of the date range over which you want to search.
  --sort=sort             property to sort by (prepend '-' for descending)
  --until=until           The end of the date range over which you want to search.
```

_See code: [src/commands/ep/oncall.ts](https://github.com/martindstone/pagerduty-cli/blob/v0.0.59/src/commands/ep/oncall.ts)_

## `pd ep:open`

Open PagerDuty Escalation policies in the browser

```
USAGE
  $ pd ep:open

OPTIONS
  -h, --help       show CLI help
  -i, --ids=ids    The IDs of escalation policies to open.
  -n, --name=name  Open escalation policies whose names match this string.
  -p, --pipe       Read escalation policy ID's from stdin.
```

_See code: [src/commands/ep/open.ts](https://github.com/martindstone/pagerduty-cli/blob/v0.0.59/src/commands/ep/open.ts)_

## `pd help [COMMAND]`

display help for pd

```
USAGE
  $ pd help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.0/src/commands/help.ts)_

## `pd incident:ack`

Acknowledge PagerDuty Incidents

```
USAGE
  $ pd incident:ack

OPTIONS
  -F, --from=from      Login email of a PD user account for the "From:" header. Use only with legacy API tokens.
  -h, --help           show CLI help
  -i, --ids=ids        Incident ID's to acknowledge. Specify multiple times for multiple incidents.
  -m, --me             Acknowledge all incidents assigned to me
  -p, --pipe           Read incident ID's from stdin.

  -z, --snooze=snooze  Also snooze selected incidents for the specified amount of time (5m, '1 hour', default unit is
                       seconds).

ALIASES
  $ pd incident:acknowledge
```

_See code: [src/commands/incident/ack.ts](https://github.com/martindstone/pagerduty-cli/blob/v0.0.59/src/commands/incident/ack.ts)_

## `pd incident:assign`

Assign/Reassign PagerDuty Incidents

```
USAGE
  $ pd incident:assign

OPTIONS
  -E, --assign_to_ep_name=assign_to_ep_name          Escalation policy name to assign incidents to.

  -F, --from=from                                    Login email of a PD user account for the "From:" header. Use only
                                                     with legacy API tokens.

  -U, --assign_to_user_emails=assign_to_user_emails  User emails to assign incidents to. Specify multiple times for
                                                     multiple assignees.

  -e, --assign_to_ep_id=assign_to_ep_id              Escalation policy ID to assign incidents to.

  -h, --help                                         show CLI help

  -i, --ids=ids                                      Incident ID's to assign. Specify multiple times for multiple
                                                     incidents.

  -m, --me                                           Reassign all incidents that are currently assigned to me

  -p, --pipe                                         Read incident ID's from stdin.

  -u, --assign_to_user_ids=assign_to_user_ids        User ID's to assign incidents to. Specify multiple times for
                                                     multiple assignees.

ALIASES
  $ pd incident:reassign
```

_See code: [src/commands/incident/assign.ts](https://github.com/martindstone/pagerduty-cli/blob/v0.0.59/src/commands/incident/assign.ts)_

## `pd incident:create`

Create a PagerDuty Incident

```
USAGE
  $ pd incident:create

OPTIONS
  -E, --escalation_policy=escalation_policy    The name of the escalation policy to assign the incident to

  -F, --from=from                              Login email of a PD user account for the "From:" header. Use only with
                                               legacy API tokens.

  -P, --priority=priority                      Incident priority

  -S, --service=service                        The name of the service to create the incident in

  -U, --user=user                              The email of a user to assign the incident to

  -d, --details=details                        Incident details

  -h, --help                                   show CLI help

  -k, --key=key                                Incident key

  -o, --open                                   Open the new incident in the browser

  -p, --pipe                                   Print the incident ID only to stdout, for use with pipes.

  -t, --title=title                            (required) Incident title

  -u, --urgency=high|low                       Incident urgency

  --escalation_policy_id=escalation_policy_id  The ID of the escalation policy to assign the incident to

  --service_id=service_id                      The ID of the service to create the incident in

  --user_id=user_id                            The ID of a user to assign the incident to
```

_See code: [src/commands/incident/create.ts](https://github.com/martindstone/pagerduty-cli/blob/v0.0.59/src/commands/incident/create.ts)_

## `pd incident:list`

List PagerDuty Incidents

```
USAGE
  $ pd incident:list

OPTIONS
  -S, --services=services                                     Service names to include. Specify multiple times for
                                                              multiple services.

  -d, --delimiter=delimiter                                   [default:
                                                              ] Delimiter for fields that have more than one value

  -e, --assignees=assignees                                   Return only incidents assigned to this PD login email.
                                                              Specify multiple times for multiple assignees.

  -h, --help                                                  show CLI help

  -j, --json                                                  output full details as JSON

  -k, --keys=keys                                             Additional fields to display. Specify multiple times for
                                                              multiple fields.

  -m, --me                                                    Return only incidents assigned to me

  -p, --pipe                                                  Print incident ID's only to stdout, for use with pipes.

  -s, --statuses=open|closed|triggered|acknowledged|resolved  [default: open] Return only incidents with the given
                                                              statuses. Specify multiple times for multiple statuses.

  -t, --teams=teams                                           Team names to include. Specify multiple times for multiple
                                                              teams.

  -u, --urgencies=high|low                                    [default: high,low] Urgencies to include.

  -x, --extended                                              show extra columns

  --columns=columns                                           only show provided columns (comma-separated)

  --csv                                                       output is csv format [alias: --output=csv]

  --filter=filter                                             filter property by partial string matching, ex: name=foo

  --no-header                                                 hide table header from output

  --no-truncate                                               do not truncate output to fit screen

  --output=csv|json|yaml                                      output in a more machine friendly format

  --since=since                                               The start of the date range over which you want to search.

  --sort=sort                                                 property to sort by (prepend '-' for descending)

  --until=until                                               The end of the date range over which you want to search.
```

_See code: [src/commands/incident/list.ts](https://github.com/martindstone/pagerduty-cli/blob/v0.0.59/src/commands/incident/list.ts)_

## `pd incident:log`

Show PagerDuty Incident Log Entries

```
USAGE
  $ pd incident:log

OPTIONS
  -O, --overview             Get only `overview` log entries

  -d, --delimiter=delimiter  [default:
                             ] Delimiter for fields that have more than one value

  -h, --help                 show CLI help

  -i, --ids=ids              Select incidents with the given ID. Specify multiple times for multiple incidents.

  -j, --json                 output full details as JSON

  -k, --keys=keys            Additional fields to display. Specify multiple times for multiple fields.

  -p, --pipe                 Read incident IDs from stdin, for use with pipes.

  -x, --extended             show extra columns

  --columns=columns          only show provided columns (comma-separated)

  --csv                      output is csv format [alias: --output=csv]

  --filter=filter            filter property by partial string matching, ex: name=foo

  --no-header                hide table header from output

  --no-truncate              do not truncate output to fit screen

  --output=csv|json|yaml     output in a more machine friendly format

  --sort=sort                property to sort by (prepend '-' for descending)
```

_See code: [src/commands/incident/log.ts](https://github.com/martindstone/pagerduty-cli/blob/v0.0.59/src/commands/incident/log.ts)_

## `pd incident:notes`

See or add notes on PagerDuty Incidents

```
USAGE
  $ pd incident:notes

OPTIONS
  -F, --from=from         Login email of a PD user account for the "From:" header. Use only with legacy API tokens.
  -h, --help              show CLI help
  -i, --id=id             (required) Incident ID.
  -n, --note=note         Note to add
  -x, --extended          show extra columns
  --columns=columns       only show provided columns (comma-separated)
  --csv                   output is csv format [alias: --output=csv]
  --filter=filter         filter property by partial string matching, ex: name=foo
  --no-header             hide table header from output
  --no-truncate           do not truncate output to fit screen
  --output=csv|json|yaml  output in a more machine friendly format
  --sort=sort             property to sort by (prepend '-' for descending)
```

_See code: [src/commands/incident/notes.ts](https://github.com/martindstone/pagerduty-cli/blob/v0.0.59/src/commands/incident/notes.ts)_

## `pd incident:open`

Open PagerDuty Incidents in your browser

```
USAGE
  $ pd incident:open

OPTIONS
  -h, --help     show CLI help
  -i, --ids=ids  Incident ID's to open. Specify multiple times for multiple incidents.
  -m, --me       Open all incidents assigned to me
  -p, --pipe     Read incident ID's from stdin.
```

_See code: [src/commands/incident/open.ts](https://github.com/martindstone/pagerduty-cli/blob/v0.0.59/src/commands/incident/open.ts)_

## `pd incident:priority`

Set priority on PagerDuty Incidents

```
USAGE
  $ pd incident:priority

OPTIONS
  -F, --from=from          Login email of a PD user account for the "From:" header. Use only with legacy API tokens.
  -h, --help               show CLI help
  -i, --ids=ids            Incident ID's to set priority on. Specify multiple times for multiple incidents.
  -m, --me                 Set priority on all incidents assigned to me
  -n, --priority=priority  (required) The name of the priority to set.
  -p, --pipe               Read incident ID's from stdin.
```

_See code: [src/commands/incident/priority.ts](https://github.com/martindstone/pagerduty-cli/blob/v0.0.59/src/commands/incident/priority.ts)_

## `pd incident:resolve`

Resolve PagerDuty Incidents

```
USAGE
  $ pd incident:resolve

OPTIONS
  -F, --from=from  Login email of a PD user account for the "From:" header. Use only with legacy API tokens.
  -h, --help       show CLI help
  -i, --ids=ids    Incident ID's to resolve. Specify multiple times for multiple incidents.
  -m, --me         Resolve all incidents assigned to me
  -p, --pipe       Read incident ID's from stdin.
```

_See code: [src/commands/incident/resolve.ts](https://github.com/martindstone/pagerduty-cli/blob/v0.0.59/src/commands/incident/resolve.ts)_

## `pd log`

Show PagerDuty Domain Log Entries

```
USAGE
  $ pd log

OPTIONS
  -O, --overview             Get only `overview` log entries

  -d, --delimiter=delimiter  [default:
                             ] Delimiter for fields that have more than one value

  -h, --help                 show CLI help

  -j, --json                 output full details as JSON

  -k, --keys=keys            Additional fields to display. Specify multiple times for multiple fields.

  -x, --extended             show extra columns

  --columns=columns          only show provided columns (comma-separated)

  --csv                      output is csv format [alias: --output=csv]

  --filter=filter            filter property by partial string matching, ex: name=foo

  --no-header                hide table header from output

  --no-truncate              do not truncate output to fit screen

  --output=csv|json|yaml     output in a more machine friendly format

  --since=since              [default: 30 days ago] The start of the date range over which you want to search.

  --sort=sort                property to sort by (prepend '-' for descending)

  --until=until              The end of the date range over which you want to search.
```

_See code: [src/commands/log.ts](https://github.com/martindstone/pagerduty-cli/blob/v0.0.59/src/commands/log.ts)_

## `pd login`

Authenticate with PagerDuty in the browser

```
USAGE
  $ pd login
```

_See code: [src/commands/login.ts](https://github.com/martindstone/pagerduty-cli/blob/v0.0.59/src/commands/login.ts)_

## `pd rest:delete`

Make a DELETE request to PagerDuty

```
USAGE
  $ pd rest:delete

OPTIONS
  -H, --headers=headers    [default: ] Headers to add, for example, `From=martin@pagerduty.com`. Specify multiple times
                           for multiple headers.

  -P, --params=params      [default: ] Parameters to add, for example, `query=martin` or `include[]=teams. Specify
                           multiple times for multiple params.

  -e, --endpoint=endpoint  (required) The path to the endpoint, for example, `/users/PXXXXXX` or `/services`

  -h, --help               show CLI help
```

_See code: [src/commands/rest/delete.ts](https://github.com/martindstone/pagerduty-cli/blob/v0.0.59/src/commands/rest/delete.ts)_

## `pd rest:fetch`

Fetch objects from PagerDuty

```
USAGE
  $ pd rest:fetch

OPTIONS
  -P, --params=params        [default: ] Parameters to add, for example, `query=martin` or `include[]=teams. Specify
                             multiple times for multiple params.

  -d, --delimiter=delimiter  [default:
                             ] Delimiter for fields that have more than one value, for use with `--table`.

  -e, --endpoint=endpoint    (required) The path to the endpoint, for example, `/users/PXXXXXX` or `/services`

  -h, --help                 show CLI help

  -k, --keys=keys            Additional fields to display, for use with `--table`. Specify multiple times for multiple
                             fields.

  -p, --pipe                 Print object ID's only to stdout, for use with pipes.

  -t, --table                Output in table format instead of JSON

  -x, --extended             show extra columns

  --columns=columns          only show provided columns (comma-separated)

  --csv                      output is csv format [alias: --output=csv]

  --filter=filter            filter property by partial string matching, ex: name=foo

  --no-header                hide table header from output

  --no-truncate              do not truncate output to fit screen

  --output=csv|json|yaml     output in a more machine friendly format

  --sort=sort                property to sort by (prepend '-' for descending)
```

_See code: [src/commands/rest/fetch.ts](https://github.com/martindstone/pagerduty-cli/blob/v0.0.59/src/commands/rest/fetch.ts)_

## `pd rest:get`

Make a GET request to PagerDuty

```
USAGE
  $ pd rest:get

OPTIONS
  -H, --headers=headers    [default: ] Headers to add, for example, `From=martin@pagerduty.com`. Specify multiple times
                           for multiple headers.

  -P, --params=params      [default: ] Parameters to add, for example, `query=martin` or `include[]=teams`. Specify
                           multiple times for multiple params.

  -e, --endpoint=endpoint  (required) The path to the endpoint, for example, `/users/PXXXXXX` or `/services`

  -h, --help               show CLI help
```

_See code: [src/commands/rest/get.ts](https://github.com/martindstone/pagerduty-cli/blob/v0.0.59/src/commands/rest/get.ts)_

## `pd rest:post`

Make a POST request to PagerDuty

```
USAGE
  $ pd rest:post

OPTIONS
  -H, --headers=headers    [default: ] Headers to add, for example, `From=martin@pagerduty.com`. Specify multiple times
                           for multiple headers.

  -P, --params=params      [default: ] Parameters to add, for example, `query=martin` or `include[]=teams. Specify
                           multiple times for multiple params.

  -d, --data=data          (required) JSON data to send

  -e, --endpoint=endpoint  (required) The path to the endpoint, for example, `/users/PXXXXXX` or `/services`

  -h, --help               show CLI help
```

_See code: [src/commands/rest/post.ts](https://github.com/martindstone/pagerduty-cli/blob/v0.0.59/src/commands/rest/post.ts)_

## `pd rest:put`

Make a PUT request to PagerDuty

```
USAGE
  $ pd rest:put

OPTIONS
  -H, --headers=headers    [default: ] Headers to add, for example, `From=martin@pagerduty.com`. Specify multiple times
                           for multiple headers.

  -P, --params=params      [default: ] Parameters to add, for example, `query=martin` or `include[]=teams. Specify
                           multiple times for multiple params.

  -d, --data=data          (required) JSON data to send

  -e, --endpoint=endpoint  (required) The path to the endpoint, for example, `/users/PXXXXXX` or `/services`

  -h, --help               show CLI help
```

_See code: [src/commands/rest/put.ts](https://github.com/martindstone/pagerduty-cli/blob/v0.0.59/src/commands/rest/put.ts)_

## `pd schedule:list`

List PagerDuty Schedules

```
USAGE
  $ pd schedule:list

OPTIONS
  -d, --delimiter=delimiter  [default:
                             ] Delimiter for fields that have more than one value

  -h, --help                 show CLI help

  -j, --json                 output full details as JSON

  -k, --keys=keys            Additional fields to display. Specify multiple times for multiple fields.

  -n, --name=name            Select schedules whose names contain the given text

  -p, --pipe                 Print schedule ID's only to stdout, for use with pipes.

  -x, --extended             show extra columns

  --columns=columns          only show provided columns (comma-separated)

  --csv                      output is csv format [alias: --output=csv]

  --filter=filter            filter property by partial string matching, ex: name=foo

  --no-header                hide table header from output

  --no-truncate              do not truncate output to fit screen

  --output=csv|json|yaml     output in a more machine friendly format

  --sort=sort                property to sort by (prepend '-' for descending)
```

_See code: [src/commands/schedule/list.ts](https://github.com/martindstone/pagerduty-cli/blob/v0.0.59/src/commands/schedule/list.ts)_

## `pd schedule:oncall`

List a PagerDuty Schedule's on call shifts.

```
USAGE
  $ pd schedule:oncall

OPTIONS
  -h, --help              show CLI help
  -i, --id=id             Show oncalls for the schedule with this ID.
  -j, --json              output full details as JSON
  -k, --keys=keys         Additional fields to display. Specify multiple times for multiple fields.
  -n, --name=name         Show oncalls for the schedule with this name.
  -x, --extended          show extra columns
  --columns=columns       only show provided columns (comma-separated)
  --csv                   output is csv format [alias: --output=csv]
  --filter=filter         filter property by partial string matching, ex: name=foo
  --no-header             hide table header from output
  --no-truncate           do not truncate output to fit screen
  --output=csv|json|yaml  output in a more machine friendly format
  --since=since           The start of the date range over which you want to search.
  --sort=sort             property to sort by (prepend '-' for descending)
  --until=until           The end of the date range over which you want to search.
```

_See code: [src/commands/schedule/oncall.ts](https://github.com/martindstone/pagerduty-cli/blob/v0.0.59/src/commands/schedule/oncall.ts)_

## `pd schedule:open`

Open PagerDuty Schedules in the browser

```
USAGE
  $ pd schedule:open

OPTIONS
  -h, --help       show CLI help
  -i, --ids=ids    The IDs of schedules to open.
  -n, --name=name  Open schedules matching this string.
  -p, --pipe       Read schedule ID's from stdin.
```

_See code: [src/commands/schedule/open.ts](https://github.com/martindstone/pagerduty-cli/blob/v0.0.59/src/commands/schedule/open.ts)_

## `pd schedule:override:add`

Add an override to a PagerDuty schedule.

```
USAGE
  $ pd schedule:override:add

OPTIONS
  -U, --user_email=user_email  The email of the PagerDuty user for the override
  -h, --help                   show CLI help
  -i, --id=id                  Add an override to the schedule with this ID.
  -n, --name=name              Add an override to the schedule with this name.
  -u, --user_id=user_id        The ID of the PagerDuty user for the override
  --end=end                    [default: in 1 day] The end time for the override.
  --start=start                [default: now] The start time for the override.
```

_See code: [src/commands/schedule/override/add.ts](https://github.com/martindstone/pagerduty-cli/blob/v0.0.59/src/commands/schedule/override/add.ts)_

## `pd schedule:override:list`

List a PagerDuty Schedule's overrides.

```
USAGE
  $ pd schedule:override:list

OPTIONS
  -d, --delimiter=delimiter  [default:
                             ] Delimiter for fields that have more than one value

  -h, --help                 show CLI help

  -i, --id=id                Show overrides for the schedule with this ID.

  -j, --json                 output full details as JSON

  -k, --keys=keys            Additional fields to display. Specify multiple times for multiple fields.

  -n, --name=name            Show overrides for the schedule with this name.

  -p, --pipe                 Print override ID's only to stdout, for use with pipes.

  -x, --extended             show extra columns

  --columns=columns          only show provided columns (comma-separated)

  --csv                      output is csv format [alias: --output=csv]

  --filter=filter            filter property by partial string matching, ex: name=foo

  --no-header                hide table header from output

  --no-truncate              do not truncate output to fit screen

  --output=csv|json|yaml     output in a more machine friendly format

  --since=since              [default: now] The start of the date range over which you want to search.

  --sort=sort                property to sort by (prepend '-' for descending)

  --until=until              [default: in 30 days] The end of the date range over which you want to search.
```

_See code: [src/commands/schedule/override/list.ts](https://github.com/martindstone/pagerduty-cli/blob/v0.0.59/src/commands/schedule/override/list.ts)_

## `pd service:disable`

Disable PagerDuty Services

```
USAGE
  $ pd service:disable

OPTIONS
  -h, --help       show CLI help
  -i, --ids=ids    Select services with the given ID. Specify multiple times for multiple services.
  -n, --name=name  Select services whose names contain the given text
  -p, --pipe       Read service ID's from stdin.
```

_See code: [src/commands/service/disable.ts](https://github.com/martindstone/pagerduty-cli/blob/v0.0.59/src/commands/service/disable.ts)_

## `pd service:enable`

Enable PagerDuty Services

```
USAGE
  $ pd service:enable

OPTIONS
  -h, --help       show CLI help
  -i, --ids=ids    Select services with the given ID. Specify multiple times for multiple services.
  -n, --name=name  Select services whose names contain the given text
  -p, --pipe       Read service ID's from stdin.
```

_See code: [src/commands/service/enable.ts](https://github.com/martindstone/pagerduty-cli/blob/v0.0.59/src/commands/service/enable.ts)_

## `pd service:list`

List PagerDuty Services

```
USAGE
  $ pd service:list

OPTIONS
  -d, --delimiter=delimiter  [default:
                             ] Delimiter for fields that have more than one value

  -h, --help                 show CLI help

  -j, --json                 output full details as JSON

  -k, --keys=keys            Additional fields to display. Specify multiple times for multiple fields.

  -n, --name=name            Retrieve only services whose names contain this text

  -p, --pipe                 Print service ID's only to stdin, for use with pipes.

  -t, --teams=teams          Team names to include. Specify multiple times for multiple teams.

  -x, --extended             show extra columns

  --columns=columns          only show provided columns (comma-separated)

  --csv                      output is csv format [alias: --output=csv]

  --filter=filter            filter property by partial string matching, ex: name=foo

  --no-header                hide table header from output

  --no-truncate              do not truncate output to fit screen

  --output=csv|json|yaml     output in a more machine friendly format

  --sort=sort                property to sort by (prepend '-' for descending)
```

_See code: [src/commands/service/list.ts](https://github.com/martindstone/pagerduty-cli/blob/v0.0.59/src/commands/service/list.ts)_

## `pd service:set`

Set PagerDuty Service attributes

```
USAGE
  $ pd service:set

OPTIONS
  -h, --help         show CLI help
  -i, --ids=ids      Select services with the given ID. Specify multiple times for multiple services.
  -k, --key=key      (required) Attribute key to set
  -n, --name=name    Select services whose names contain the given text
  -p, --pipe         Read service ID's from stdin.
  -v, --value=value  (required) Attribute value to set
```

_See code: [src/commands/service/set.ts](https://github.com/martindstone/pagerduty-cli/blob/v0.0.59/src/commands/service/set.ts)_

## `pd update [CHANNEL]`

update the pd CLI

```
USAGE
  $ pd update [CHANNEL]
```

_See code: [@oclif/plugin-update](https://github.com/oclif/plugin-update/blob/v1.3.10/src/commands/update.ts)_

## `pd user:contact:add`

Add a contact method to a PagerDuty user

```
USAGE
  $ pd user:contact:add

OPTIONS
  -T, --type=email|phone|sms  (required) The contact method type.
  -a, --address=address       (required) The contact method address or phone number.
  -e, --email=email           Add contact to the user with this login email.
  -h, --help                  show CLI help
  -i, --id=id                 Add contact to the user with this ID.
  -l, --label=label           (required) The contact method label.
```

_See code: [src/commands/user/contact/add.ts](https://github.com/martindstone/pagerduty-cli/blob/v0.0.59/src/commands/user/contact/add.ts)_

## `pd user:contact:list`

List a PagerDuty User's contact methods.

```
USAGE
  $ pd user:contact:list

OPTIONS
  -d, --delimiter=delimiter  [default:
                             ] Delimiter for fields that have more than one value

  -e, --email=email          Show contacts for the user with this login email.

  -h, --help                 show CLI help

  -i, --id=id                Show contacts for the user with this ID.

  -j, --json                 output full details as JSON

  -k, --keys=keys            Additional fields to display. Specify multiple times for multiple fields.

  -p, --pipe                 Print contact ID's only to stdout, for use with pipes.

  -x, --extended             show extra columns

  --columns=columns          only show provided columns (comma-separated)

  --csv                      output is csv format [alias: --output=csv]

  --filter=filter            filter property by partial string matching, ex: name=foo

  --no-header                hide table header from output

  --no-truncate              do not truncate output to fit screen

  --output=csv|json|yaml     output in a more machine friendly format

  --sort=sort                property to sort by (prepend '-' for descending)
```

_See code: [src/commands/user/contact/list.ts](https://github.com/martindstone/pagerduty-cli/blob/v0.0.59/src/commands/user/contact/list.ts)_

## `pd user:contact:set`

Update a contact method for a PagerDuty user

```
USAGE
  $ pd user:contact:set

OPTIONS
  -a, --address=address        The contact method address or phone number to set.
  -c, --contact_id=contact_id  (required) Update the contact with this ID.
  -e, --email=email            Update a contact for the user with this login email.
  -h, --help                   show CLI help
  -i, --id=id                  Update a contact for the user with this ID.
  -l, --label=label            The contact method label to set.
```

_See code: [src/commands/user/contact/set.ts](https://github.com/martindstone/pagerduty-cli/blob/v0.0.59/src/commands/user/contact/set.ts)_

## `pd user:list`

List PagerDuty Users

```
USAGE
  $ pd user:list

OPTIONS
  -d, --delimiter=delimiter  [default:
                             ] Delimiter for fields that have more than one value

  -e, --email=email          Select users whose login email addresses contain the given text

  -h, --help                 show CLI help

  -j, --json                 output full details as JSON

  -k, --keys=keys            Additional fields to display. Specify multiple times for multiple fields.

  -p, --pipe                 Print user ID's only to stdout, for use with pipes.

  -x, --extended             show extra columns

  --columns=columns          only show provided columns (comma-separated)

  --csv                      output is csv format [alias: --output=csv]

  --filter=filter            filter property by partial string matching, ex: name=foo

  --no-header                hide table header from output

  --no-truncate              do not truncate output to fit screen

  --output=csv|json|yaml     output in a more machine friendly format

  --sort=sort                property to sort by (prepend '-' for descending)
```

_See code: [src/commands/user/list.ts](https://github.com/martindstone/pagerduty-cli/blob/v0.0.59/src/commands/user/list.ts)_

## `pd user:log`

Show PagerDuty User Log Entries

```
USAGE
  $ pd user:log

OPTIONS
  -O, --overview             Get only `overview` log entries

  -d, --delimiter=delimiter  [default:
                             ] Delimiter for fields that have more than one value

  -e, --email=email          Select users whose login email addresses contain the given text

  -h, --help                 show CLI help

  -i, --ids=ids              Select users with the given ID. Specify multiple times for multiple users.

  -j, --json                 output full details as JSON

  -k, --keys=keys            Additional fields to display. Specify multiple times for multiple fields.

  -p, --pipe                 Read user IDs from stdin, for use with pipes.

  -x, --extended             show extra columns

  --columns=columns          only show provided columns (comma-separated)

  --csv                      output is csv format [alias: --output=csv]

  --filter=filter            filter property by partial string matching, ex: name=foo

  --no-header                hide table header from output

  --no-truncate              do not truncate output to fit screen

  --output=csv|json|yaml     output in a more machine friendly format

  --since=since              [default: 30 days ago] The start of the date range over which you want to search.

  --sort=sort                property to sort by (prepend '-' for descending)

  --until=until              The end of the date range over which you want to search.
```

_See code: [src/commands/user/log.ts](https://github.com/martindstone/pagerduty-cli/blob/v0.0.59/src/commands/user/log.ts)_

## `pd user:oncall`

List a PagerDuty User's on call shifts.

```
USAGE
  $ pd user:oncall

OPTIONS
  -a, --always            Include 'Always on call.'
  -e, --email=email       Show oncalls for the user with this login email.
  -h, --help              show CLI help
  -i, --id=id             Show oncalls for the user with this ID.
  -j, --json              output full details as JSON
  -k, --keys=keys         Additional fields to display. Specify multiple times for multiple fields.
  -m, --me                Show my oncalls.
  -x, --extended          show extra columns
  --columns=columns       only show provided columns (comma-separated)
  --csv                   output is csv format [alias: --output=csv]
  --filter=filter         filter property by partial string matching, ex: name=foo
  --no-header             hide table header from output
  --no-truncate           do not truncate output to fit screen
  --output=csv|json|yaml  output in a more machine friendly format
  --since=since           The start of the date range over which you want to search.
  --sort=sort             property to sort by (prepend '-' for descending)
  --until=until           The end of the date range over which you want to search.
```

_See code: [src/commands/user/oncall.ts](https://github.com/martindstone/pagerduty-cli/blob/v0.0.59/src/commands/user/oncall.ts)_

## `pd user:set`

Set PagerDuty User attributes

```
USAGE
  $ pd user:set

OPTIONS
  -e, --emails=emails  Select users whose emails contain the given text. Specify multiple times for multiple emails.
  -h, --help           show CLI help
  -i, --ids=ids        Select users with the given ID. Specify multiple times for multiple users.
  -k, --key=key        (required) Attribute key to set
  -p, --pipe           Read user ID's from stdin.
  -v, --value=value    (required) Attribute value to set
```

_See code: [src/commands/user/set.ts](https://github.com/martindstone/pagerduty-cli/blob/v0.0.59/src/commands/user/set.ts)_
<!-- commandsstop -->
