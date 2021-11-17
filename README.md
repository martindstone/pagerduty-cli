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

## See the [User Guide](https://github.com/martindstone/pagerduty-cli/wiki/PagerDuty-CLI-User-Guide)!

# Commands
<!-- commands -->
* [`pd analytics:incident`](#pd-analyticsincident)
* [`pd analytics:incident:raw`](#pd-analyticsincidentraw)
* [`pd auth:add`](#pd-authadd)
* [`pd auth:delete`](#pd-authdelete)
* [`pd auth:get`](#pd-authget)
* [`pd auth:list`](#pd-authlist)
* [`pd auth:use`](#pd-authuse)
* [`pd auth:web`](#pd-authweb)
* [`pd autocomplete [SHELL]`](#pd-autocomplete-shell)
* [`pd commands`](#pd-commands)
* [`pd ep:copy`](#pd-epcopy)
* [`pd ep:create`](#pd-epcreate)
* [`pd ep:level:add`](#pd-epleveladd)
* [`pd ep:level:remove`](#pd-eplevelremove)
* [`pd ep:list`](#pd-eplist)
* [`pd ep:oncall`](#pd-eponcall)
* [`pd ep:open`](#pd-epopen)
* [`pd ep:target:add`](#pd-eptargetadd)
* [`pd ep:target:remove`](#pd-eptargetremove)
* [`pd help [COMMAND]`](#pd-help-command)
* [`pd incident:ack`](#pd-incidentack)
* [`pd incident:alerts`](#pd-incidentalerts)
* [`pd incident:analytics`](#pd-incidentanalytics)
* [`pd incident:assign`](#pd-incidentassign)
* [`pd incident:create`](#pd-incidentcreate)
* [`pd incident:list`](#pd-incidentlist)
* [`pd incident:log`](#pd-incidentlog)
* [`pd incident:merge`](#pd-incidentmerge)
* [`pd incident:notes`](#pd-incidentnotes)
* [`pd incident:open`](#pd-incidentopen)
* [`pd incident:priority`](#pd-incidentpriority)
* [`pd incident:resolve`](#pd-incidentresolve)
* [`pd log`](#pd-log)
* [`pd rest:delete`](#pd-restdelete)
* [`pd rest:fetch`](#pd-restfetch)
* [`pd rest:get`](#pd-restget)
* [`pd rest:post`](#pd-restpost)
* [`pd rest:put`](#pd-restput)
* [`pd schedule:copy`](#pd-schedulecopy)
* [`pd schedule:list`](#pd-schedulelist)
* [`pd schedule:oncall`](#pd-scheduleoncall)
* [`pd schedule:open`](#pd-scheduleopen)
* [`pd schedule:override:add`](#pd-scheduleoverrideadd)
* [`pd schedule:override:list`](#pd-scheduleoverridelist)
* [`pd schedule:render`](#pd-schedulerender)
* [`pd schedule:show`](#pd-scheduleshow)
* [`pd service:create`](#pd-servicecreate)
* [`pd service:disable`](#pd-servicedisable)
* [`pd service:enable`](#pd-serviceenable)
* [`pd service:list`](#pd-servicelist)
* [`pd service:open`](#pd-serviceopen)
* [`pd service:set`](#pd-serviceset)
* [`pd team:create`](#pd-teamcreate)
* [`pd team:ep:add`](#pd-teamepadd)
* [`pd team:ep:remove`](#pd-teamepremove)
* [`pd team:list`](#pd-teamlist)
* [`pd team:open`](#pd-teamopen)
* [`pd team:user:add`](#pd-teamuseradd)
* [`pd team:user:list`](#pd-teamuserlist)
* [`pd team:user:remove`](#pd-teamuserremove)
* [`pd update [CHANNEL]`](#pd-update-channel)
* [`pd user:contact:add`](#pd-usercontactadd)
* [`pd user:contact:list`](#pd-usercontactlist)
* [`pd user:contact:set`](#pd-usercontactset)
* [`pd user:create`](#pd-usercreate)
* [`pd user:list`](#pd-userlist)
* [`pd user:log`](#pd-userlog)
* [`pd user:oncall`](#pd-useroncall)
* [`pd user:replace`](#pd-userreplace)
* [`pd user:session:list`](#pd-usersessionlist)
* [`pd user:set`](#pd-userset)
* [`pd util:timestamp [DATE]`](#pd-utiltimestamp-date)

## `pd analytics:incident`

Get PagerDuty Incident Analytics

```
USAGE
  $ pd analytics:incident

OPTIONS
  -M, --major                          Include only major incidents
  -S, --services=services              Service names to include. Specify multiple times for multiple services.
  -b, --useauth=useauth                Use the saved REST API token with this alias

  -d, --delimiter=delimiter            [default:
                                       ] Delimiter for fields that have more than one value

  -g, --aggregate_unit=day|week|month  The time unit to aggregate metrics by. If no value is provided, the metrics will
                                       be aggregated for the entire period.

  -h, --help                           show CLI help

  -j, --json                           output full details as JSON

  -k, --keys=keys                      Additional fields to display. Specify multiple times for multiple fields.

  -t, --teams=teams                    Team names to include. Specify multiple times for multiple teams.

  -u, --urgencies=high|low             [default: high,low] Urgencies to include.

  -x, --extended                       show extra columns

  --columns=columns                    only show provided columns (comma-separated)

  --csv                                output is csv format [alias: --output=csv]

  --debug                              Print REST API call debug logs

  --filter=filter                      filter property by partial string matching, ex: name=foo

  --no-header                          hide table header from output

  --no-truncate                        do not truncate output to fit screen

  --output=csv|json|yaml               output in a more machine friendly format

  --since=since                        [default: 7 days ago] The start of the date range over which you want to search.

  --sort=sort                          property to sort by (prepend '-' for descending)

  --token=token                        Ignore the saved configuration and use this token

  --until=until                        [default: now] The end of the date range over which you want to search.
```

_See code: [src/commands/analytics/incident/index.ts](https://github.com/martindstone/pagerduty-cli/blob/v0.0.78/src/commands/analytics/incident/index.ts)_

## `pd analytics:incident:raw`

Get PagerDuty Raw Incident Analytics

```
USAGE
  $ pd analytics:incident:raw

OPTIONS
  -M, --major                Include only major incidents
  -S, --services=services    Service names to include. Specify multiple times for multiple services.
  -b, --useauth=useauth      Use the saved REST API token with this alias

  -d, --delimiter=delimiter  [default:
                             ] Delimiter for fields that have more than one value

  -h, --help                 show CLI help

  -j, --json                 output full details as JSON

  -k, --keys=keys            Additional fields to display. Specify multiple times for multiple fields.

  -t, --teams=teams          Team names to include. Specify multiple times for multiple teams.

  -x, --extended             show extra columns

  --columns=columns          only show provided columns (comma-separated)

  --csv                      output is csv format [alias: --output=csv]

  --debug                    Print REST API call debug logs

  --filter=filter            filter property by partial string matching, ex: name=foo

  --no-header                hide table header from output

  --no-truncate              do not truncate output to fit screen

  --output=csv|json|yaml     output in a more machine friendly format

  --since=since              The start of the date range over which you want to search.

  --sort=sort                property to sort by (prepend '-' for descending)

  --token=token              Ignore the saved configuration and use this token

  --until=until              The end of the date range over which you want to search.
```

_See code: [src/commands/analytics/incident/raw.ts](https://github.com/martindstone/pagerduty-cli/blob/v0.0.78/src/commands/analytics/incident/raw.ts)_

## `pd auth:add`

Add an authenticated PagerDuty domain

```
USAGE
  $ pd auth:add

OPTIONS
  -a, --alias=alias   The alias to use for this token. Defaults to the name of the PD subdomain
  -d, --[no-]default  Use this token as the default for all PD commands
  -h, --help          show CLI help
  -t, --token=token   A PagerDuty API token
  --debug             Print REST API call debug logs

ALIASES
  $ pd auth:set
```

_See code: [src/commands/auth/add.ts](https://github.com/martindstone/pagerduty-cli/blob/v0.0.78/src/commands/auth/add.ts)_

## `pd auth:delete`

Delete a PagerDuty domain authentication

```
USAGE
  $ pd auth:delete

OPTIONS
  -a, --alias=alias  (required) The alias of the PD domain authentication to delete
  -h, --help         show CLI help
  --debug            Print REST API call debug logs
```

_See code: [src/commands/auth/delete.ts](https://github.com/martindstone/pagerduty-cli/blob/v0.0.78/src/commands/auth/delete.ts)_

## `pd auth:get`

Get the current authenticated PagerDuty domain

```
USAGE
  $ pd auth:get

OPTIONS
  -h, --help  show CLI help
  --debug     Print REST API call debug logs
```

_See code: [src/commands/auth/get.ts](https://github.com/martindstone/pagerduty-cli/blob/v0.0.78/src/commands/auth/get.ts)_

## `pd auth:list`

List authenticated PagerDuty domains

```
USAGE
  $ pd auth:list

OPTIONS
  -h, --help  show CLI help
  --debug     Print REST API call debug logs
```

_See code: [src/commands/auth/list.ts](https://github.com/martindstone/pagerduty-cli/blob/v0.0.78/src/commands/auth/list.ts)_

## `pd auth:use`

Choose a saved authenticated PagerDuty domain to use with all pd commands

```
USAGE
  $ pd auth:use

OPTIONS
  -a, --alias=alias  (required) The alias of the PD domain to use
  -h, --help         show CLI help
  --debug            Print REST API call debug logs
```

_See code: [src/commands/auth/use.ts](https://github.com/martindstone/pagerduty-cli/blob/v0.0.78/src/commands/auth/use.ts)_

## `pd auth:web`

Authenticate with PagerDuty in the browser

```
USAGE
  $ pd auth:web

OPTIONS
  -a, --alias=alias   The alias to use for this token. Defaults to the name of the PD subdomain
  -d, --[no-]default  Use this token as the default for all PD commands
  -h, --help          show CLI help
  --debug             Print REST API call debug logs

ALIASES
  $ pd login
```

_See code: [src/commands/auth/web.ts](https://github.com/martindstone/pagerduty-cli/blob/v0.0.78/src/commands/auth/web.ts)_

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

## `pd ep:copy`

Make a copy of a PagerDuty Escalation Policy

```
USAGE
  $ pd ep:copy

OPTIONS
  -b, --useauth=useauth          Use the saved REST API token with this alias
  -d, --destination=destination  The name for the new escalation policy
  -h, --help                     show CLI help
  -i, --id=id                    The ID of the escalation policy to copy.
  -n, --name=name                The name of the escalation policy to copy.
  -o, --open                     Open the new escalation policy in the browser
  -p, --pipe                     Print the new escalation policy ID only to stdout, for use with pipes.
  --debug                        Print REST API call debug logs
  --token=token                  Ignore the saved configuration and use this token
```

_See code: [src/commands/ep/copy.ts](https://github.com/martindstone/pagerduty-cli/blob/v0.0.78/src/commands/ep/copy.ts)_

## `pd ep:create`

Create a PagerDuty Escalation Policy with a single level. You can add levels and targets later with ep:level and ep:target

```
USAGE
  $ pd ep:create

OPTIONS
  -S, --schedule_names=schedule_names  Add a target schedule with this name. Specify multiple times for multiple
                                       targets.

  -U, --user_emails=user_emails        Add a target user with this email. Specify multiple times for multiple targets.

  -b, --useauth=useauth                Use the saved REST API token with this alias

  -d, --delay=delay                    [default: 30] Delay in minutes before unacknowledged incidents escalate away from
                                       this level

  -h, --help                           show CLI help

  -n, --name=name                      (required) The name of the escalation policy to add.

  -o, --open                           Open the new escalation policy in the browser

  -p, --pipe                           Print the escalation policy ID only to stdout, for use with pipes.

  -r, --repeat=repeat                  [default: 0] Number of times to repeat this level

  -s, --schedule_ids=schedule_ids      Add a target schedule with this ID. Specify multiple times for multiple targets.

  -u, --user_ids=user_ids              Add a target user with this ID. Specify multiple times for multiple targets.

  --debug                              Print REST API call debug logs

  --description=description            The description of the escalation policy

  --token=token                        Ignore the saved configuration and use this token
```

_See code: [src/commands/ep/create.ts](https://github.com/martindstone/pagerduty-cli/blob/v0.0.78/src/commands/ep/create.ts)_

## `pd ep:level:add`

Add a level to PagerDuty Escalation Policies

```
USAGE
  $ pd ep:level:add

OPTIONS
  -S, --schedule_names=schedule_names  Add a target schedule with this name. Specify multiple times for multiple
                                       targets.

  -U, --user_emails=user_emails        Add a target user with this email. Specify multiple times for multiple targets.

  -b, --useauth=useauth                Use the saved REST API token with this alias

  -d, --delay=delay                    [default: 30] Delay in minutes before unacknowledged incidents escalate away from
                                       this level

  -h, --help                           show CLI help

  -i, --ids=ids                        The IDs of escalation policies to update.

  -l, --level=level                    (required) Escalation policy level to add (the lowest level is 1; any existing
                                       levels at or above the added level will be moved up. To add the top level,
                                       specify any number higher than the existing number of levels (e.g., 99))

  -n, --name=name                      Update escalation policies whose names match this string.

  -p, --pipe                           Read escalation policy ID's from stdin.

  -s, --schedule_ids=schedule_ids      Add a target schedule with this ID. Specify multiple times for multiple targets.

  -u, --user_ids=user_ids              Add a target user with this ID. Specify multiple times for multiple targets.

  --debug                              Print REST API call debug logs

  --token=token                        Ignore the saved configuration and use this token
```

_See code: [src/commands/ep/level/add.ts](https://github.com/martindstone/pagerduty-cli/blob/v0.0.78/src/commands/ep/level/add.ts)_

## `pd ep:level:remove`

Remove a level from PagerDuty Escalation Policies

```
USAGE
  $ pd ep:level:remove

OPTIONS
  -b, --useauth=useauth  Use the saved REST API token with this alias
  -h, --help             show CLI help
  -i, --ids=ids          The IDs of escalation policies to update.

  -l, --level=level      (required) Escalation policy level to remove (the lowest level is 1; any existing levels above
                         the deleted level will be moved down.

  -n, --name=name        Update escalation policies whose names match this string.

  -p, --pipe             Read escalation policy ID's from stdin.

  --debug                Print REST API call debug logs

  --token=token          Ignore the saved configuration and use this token
```

_See code: [src/commands/ep/level/remove.ts](https://github.com/martindstone/pagerduty-cli/blob/v0.0.78/src/commands/ep/level/remove.ts)_

## `pd ep:list`

List PagerDuty Escalation Policies

```
USAGE
  $ pd ep:list

OPTIONS
  -b, --useauth=useauth      Use the saved REST API token with this alias

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

  --debug                    Print REST API call debug logs

  --filter=filter            filter property by partial string matching, ex: name=foo

  --no-header                hide table header from output

  --no-truncate              do not truncate output to fit screen

  --output=csv|json|yaml     output in a more machine friendly format

  --sort=sort                property to sort by (prepend '-' for descending)

  --token=token              Ignore the saved configuration and use this token
```

_See code: [src/commands/ep/list.ts](https://github.com/martindstone/pagerduty-cli/blob/v0.0.78/src/commands/ep/list.ts)_

## `pd ep:oncall`

List a PagerDuty Escalation Policy's on call shifts.

```
USAGE
  $ pd ep:oncall

OPTIONS
  -b, --useauth=useauth   Use the saved REST API token with this alias
  -h, --help              show CLI help
  -i, --id=id             Show oncalls for the EP with this ID.
  -j, --json              output full details as JSON
  -k, --keys=keys         Additional fields to display. Specify multiple times for multiple fields.
  -n, --name=name         Show oncalls for the EP with this name.
  -x, --extended          show extra columns
  --columns=columns       only show provided columns (comma-separated)
  --csv                   output is csv format [alias: --output=csv]
  --debug                 Print REST API call debug logs
  --filter=filter         filter property by partial string matching, ex: name=foo
  --no-header             hide table header from output
  --no-truncate           do not truncate output to fit screen
  --output=csv|json|yaml  output in a more machine friendly format
  --since=since           The start of the date range over which you want to search.
  --sort=sort             property to sort by (prepend '-' for descending)
  --token=token           Ignore the saved configuration and use this token
  --until=until           The end of the date range over which you want to search.
```

_See code: [src/commands/ep/oncall.ts](https://github.com/martindstone/pagerduty-cli/blob/v0.0.78/src/commands/ep/oncall.ts)_

## `pd ep:open`

Open PagerDuty Escalation policies in the browser

```
USAGE
  $ pd ep:open

OPTIONS
  -b, --useauth=useauth  Use the saved REST API token with this alias
  -h, --help             show CLI help
  -i, --ids=ids          The IDs of escalation policies to open.
  -n, --name=name        Open escalation policies whose names match this string.
  -p, --pipe             Read escalation policy ID's from stdin.
  --debug                Print REST API call debug logs
  --token=token          Ignore the saved configuration and use this token
```

_See code: [src/commands/ep/open.ts](https://github.com/martindstone/pagerduty-cli/blob/v0.0.78/src/commands/ep/open.ts)_

## `pd ep:target:add`

Add targets to PagerDuty Escalation Policies

```
USAGE
  $ pd ep:target:add

OPTIONS
  -S, --schedule_names=schedule_names  Add a target schedule with this name. Specify multiple times for multiple
                                       targets.

  -U, --user_emails=user_emails        Add a target user with this email. Specify multiple times for multiple targets.

  -b, --useauth=useauth                Use the saved REST API token with this alias

  -h, --help                           show CLI help

  -i, --ids=ids                        The IDs of escalation policies to update.

  -l, --level=level                    (required) Escalation policy level to add targets to

  -n, --name=name                      Update escalation policies whose names match this string.

  -p, --pipe                           Read escalation policy ID's from stdin.

  -s, --schedule_ids=schedule_ids      Add a target schedule with this ID. Specify multiple times for multiple targets.

  -u, --user_ids=user_ids              Add a target user with this ID. Specify multiple times for multiple targets.

  --debug                              Print REST API call debug logs

  --token=token                        Ignore the saved configuration and use this token
```

_See code: [src/commands/ep/target/add.ts](https://github.com/martindstone/pagerduty-cli/blob/v0.0.78/src/commands/ep/target/add.ts)_

## `pd ep:target:remove`

Remove targets from PagerDuty Escalation Policies

```
USAGE
  $ pd ep:target:remove

OPTIONS
  -S, --schedule_names=schedule_names  Remove a target schedule with this name. Specify multiple times for multiple
                                       targets.

  -U, --user_emails=user_emails        Remove a target user with this email. Specify multiple times for multiple
                                       targets.

  -b, --useauth=useauth                Use the saved REST API token with this alias

  -h, --help                           show CLI help

  -i, --ids=ids                        The IDs of escalation policies to update.

  -l, --level=level                    (required) Escalation policy level to remove targets from

  -n, --name=name                      Update escalation policies whose names match this string.

  -p, --pipe                           Read escalation policy ID's from stdin.

  -s, --schedule_ids=schedule_ids      Remove a target schedule with this ID. Specify multiple times for multiple
                                       targets.

  -u, --user_ids=user_ids              Remove a target user with this ID. Specify multiple times for multiple targets.

  --debug                              Print REST API call debug logs

  --token=token                        Ignore the saved configuration and use this token
```

_See code: [src/commands/ep/target/remove.ts](https://github.com/martindstone/pagerduty-cli/blob/v0.0.78/src/commands/ep/target/remove.ts)_

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

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.3/src/commands/help.ts)_

## `pd incident:ack`

Acknowledge PagerDuty Incidents

```
USAGE
  $ pd incident:ack

OPTIONS
  -F, --from=from        Login email of a PD user account for the "From:" header. Use only with legacy API tokens.
  -b, --useauth=useauth  Use the saved REST API token with this alias
  -h, --help             show CLI help
  -i, --ids=ids          Incident ID's to acknowledge. Specify multiple times for multiple incidents.
  -m, --me               Acknowledge all incidents assigned to me
  -p, --pipe             Read incident ID's from stdin.

  -z, --snooze=snooze    Also snooze selected incidents for the specified amount of time (5m, '1 hour', default unit is
                         seconds).

  --debug                Print REST API call debug logs

  --token=token          Ignore the saved configuration and use this token

ALIASES
  $ pd incident:acknowledge
```

_See code: [src/commands/incident/ack.ts](https://github.com/martindstone/pagerduty-cli/blob/v0.0.78/src/commands/incident/ack.ts)_

## `pd incident:alerts`

Show Alerts in PagerDuty Incidents

```
USAGE
  $ pd incident:alerts

OPTIONS
  -b, --useauth=useauth      Use the saved REST API token with this alias

  -d, --delimiter=delimiter  [default:
                             ] Delimiter for fields that have more than one value

  -h, --help                 show CLI help

  -i, --ids=ids              Show alerts for these Incident ID's. Specify multiple times for multiple incidents.

  -j, --json                 output full details as JSON

  -k, --keys=keys            Additional fields to display. Specify multiple times for multiple fields.

  -m, --me                   Show alerts for all incidents assigned to me

  -p, --pipe                 Read incident ID's from stdin.

  -x, --extended             show extra columns

  --columns=columns          only show provided columns (comma-separated)

  --csv                      output is csv format [alias: --output=csv]

  --debug                    Print REST API call debug logs

  --filter=filter            filter property by partial string matching, ex: name=foo

  --no-header                hide table header from output

  --no-truncate              do not truncate output to fit screen

  --output=csv|json|yaml     output in a more machine friendly format

  --sort=sort                property to sort by (prepend '-' for descending)

  --token=token              Ignore the saved configuration and use this token
```

_See code: [src/commands/incident/alerts.ts](https://github.com/martindstone/pagerduty-cli/blob/v0.0.78/src/commands/incident/alerts.ts)_

## `pd incident:analytics`

Get Incident analytics

```
USAGE
  $ pd incident:analytics

OPTIONS
  -b, --useauth=useauth   Use the saved REST API token with this alias
  -h, --help              show CLI help
  -i, --ids=ids           Incident ID's to look at. Specify multiple times for multiple incidents.
  -j, --json              output full details as JSON
  -k, --keys=keys         Additional fields to display. Specify multiple times for multiple fields.
  -p, --pipe              Read incident ID's from stdin.
  -x, --extended          show extra columns
  --columns=columns       only show provided columns (comma-separated)
  --csv                   output is csv format [alias: --output=csv]
  --debug                 Print REST API call debug logs
  --filter=filter         filter property by partial string matching, ex: name=foo
  --no-header             hide table header from output
  --no-truncate           do not truncate output to fit screen
  --output=csv|json|yaml  output in a more machine friendly format
  --sort=sort             property to sort by (prepend '-' for descending)
  --token=token           Ignore the saved configuration and use this token
```

_See code: [src/commands/incident/analytics.ts](https://github.com/martindstone/pagerduty-cli/blob/v0.0.78/src/commands/incident/analytics.ts)_

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

  -b, --useauth=useauth                              Use the saved REST API token with this alias

  -e, --assign_to_ep_id=assign_to_ep_id              Escalation policy ID to assign incidents to.

  -h, --help                                         show CLI help

  -i, --ids=ids                                      Incident ID's to assign. Specify multiple times for multiple
                                                     incidents.

  -m, --me                                           Reassign all incidents that are currently assigned to me

  -p, --pipe                                         Read incident ID's from stdin.

  -u, --assign_to_user_ids=assign_to_user_ids        User ID's to assign incidents to. Specify multiple times for
                                                     multiple assignees.

  --debug                                            Print REST API call debug logs

  --token=token                                      Ignore the saved configuration and use this token

ALIASES
  $ pd incident:reassign
```

_See code: [src/commands/incident/assign.ts](https://github.com/martindstone/pagerduty-cli/blob/v0.0.78/src/commands/incident/assign.ts)_

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

  -b, --useauth=useauth                        Use the saved REST API token with this alias

  -d, --details=details                        Incident details

  -h, --help                                   show CLI help

  -k, --key=key                                Incident key

  -o, --open                                   Open the new incident in the browser

  -p, --pipe                                   Print the incident ID only to stdout, for use with pipes.

  -t, --title=title                            (required) Incident title

  -u, --urgency=high|low                       Incident urgency

  --debug                                      Print REST API call debug logs

  --escalation_policy_id=escalation_policy_id  The ID of the escalation policy to assign the incident to

  --service_id=service_id                      The ID of the service to create the incident in

  --token=token                                Ignore the saved configuration and use this token

  --user_id=user_id                            The ID of a user to assign the incident to
```

_See code: [src/commands/incident/create.ts](https://github.com/martindstone/pagerduty-cli/blob/v0.0.78/src/commands/incident/create.ts)_

## `pd incident:list`

List PagerDuty Incidents

```
USAGE
  $ pd incident:list

OPTIONS
  -S, --services=services                                     Service names to include. Specify multiple times for
                                                              multiple services.

  -b, --useauth=useauth                                       Use the saved REST API token with this alias

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

  --debug                                                     Print REST API call debug logs

  --filter=filter                                             filter property by partial string matching, ex: name=foo

  --no-header                                                 hide table header from output

  --no-truncate                                               do not truncate output to fit screen

  --notes                                                     Also show incident notes (Uses a lot more HTTPS requests!)

  --output=csv|json|yaml                                      output in a more machine friendly format

  --since=since                                               The start of the date range over which you want to search.

  --sort=sort                                                 property to sort by (prepend '-' for descending)

  --token=token                                               Ignore the saved configuration and use this token

  --until=until                                               The end of the date range over which you want to search.
```

_See code: [src/commands/incident/list.ts](https://github.com/martindstone/pagerduty-cli/blob/v0.0.78/src/commands/incident/list.ts)_

## `pd incident:log`

Show PagerDuty Incident Log Entries

```
USAGE
  $ pd incident:log

OPTIONS
  -O, --overview             Get only `overview` log entries
  -b, --useauth=useauth      Use the saved REST API token with this alias

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

  --debug                    Print REST API call debug logs

  --filter=filter            filter property by partial string matching, ex: name=foo

  --no-header                hide table header from output

  --no-truncate              do not truncate output to fit screen

  --output=csv|json|yaml     output in a more machine friendly format

  --sort=sort                property to sort by (prepend '-' for descending)

  --token=token              Ignore the saved configuration and use this token
```

_See code: [src/commands/incident/log.ts](https://github.com/martindstone/pagerduty-cli/blob/v0.0.78/src/commands/incident/log.ts)_

## `pd incident:merge`

Merge PagerDuty Incidents

```
USAGE
  $ pd incident:merge

OPTIONS
  -F, --from=from            Login email of a PD user account for the "From:" header. Use only with legacy API tokens.
  -I, --parent_id=parent_id  Use this incident ID as the parent ID.
  -b, --useauth=useauth      Use the saved REST API token with this alias
  -h, --help                 show CLI help

  -i, --ids=ids              Merge incidents with the given ID. Specify multiple times for multiple incidents. If -I is
                             not given, the first incident in the list will be the parent incident.

  -o, --open                 Open the merged incident in the browser

  -p, --pipe                 Read incident IDs from stdin, for use with pipes. If -I is not given, the first incident ID
                             from the pipe will be the parent incident.

  --debug                    Print REST API call debug logs

  --token=token              Ignore the saved configuration and use this token
```

_See code: [src/commands/incident/merge.ts](https://github.com/martindstone/pagerduty-cli/blob/v0.0.78/src/commands/incident/merge.ts)_

## `pd incident:notes`

See or add notes on PagerDuty Incidents

```
USAGE
  $ pd incident:notes

OPTIONS
  -F, --from=from         Login email of a PD user account for the "From:" header. Use only with legacy API tokens.
  -b, --useauth=useauth   Use the saved REST API token with this alias
  -h, --help              show CLI help
  -i, --id=id             (required) Incident ID.
  -n, --note=note         Note to add
  -x, --extended          show extra columns
  --columns=columns       only show provided columns (comma-separated)
  --csv                   output is csv format [alias: --output=csv]
  --debug                 Print REST API call debug logs
  --filter=filter         filter property by partial string matching, ex: name=foo
  --no-header             hide table header from output
  --no-truncate           do not truncate output to fit screen
  --output=csv|json|yaml  output in a more machine friendly format
  --sort=sort             property to sort by (prepend '-' for descending)
  --token=token           Ignore the saved configuration and use this token
```

_See code: [src/commands/incident/notes.ts](https://github.com/martindstone/pagerduty-cli/blob/v0.0.78/src/commands/incident/notes.ts)_

## `pd incident:open`

Open PagerDuty Incidents in your browser

```
USAGE
  $ pd incident:open

OPTIONS
  -b, --useauth=useauth  Use the saved REST API token with this alias
  -h, --help             show CLI help
  -i, --ids=ids          Incident ID's to open. Specify multiple times for multiple incidents.
  -m, --me               Open all incidents assigned to me
  -p, --pipe             Read incident ID's from stdin.
  --debug                Print REST API call debug logs
  --token=token          Ignore the saved configuration and use this token
```

_See code: [src/commands/incident/open.ts](https://github.com/martindstone/pagerduty-cli/blob/v0.0.78/src/commands/incident/open.ts)_

## `pd incident:priority`

Set priority on PagerDuty Incidents

```
USAGE
  $ pd incident:priority

OPTIONS
  -F, --from=from          Login email of a PD user account for the "From:" header. Use only with legacy API tokens.
  -b, --useauth=useauth    Use the saved REST API token with this alias
  -h, --help               show CLI help
  -i, --ids=ids            Incident ID's to set priority on. Specify multiple times for multiple incidents.
  -m, --me                 Set priority on all incidents assigned to me
  -n, --priority=priority  (required) The name of the priority to set.
  -p, --pipe               Read incident ID's from stdin.
  --debug                  Print REST API call debug logs
  --token=token            Ignore the saved configuration and use this token
```

_See code: [src/commands/incident/priority.ts](https://github.com/martindstone/pagerduty-cli/blob/v0.0.78/src/commands/incident/priority.ts)_

## `pd incident:resolve`

Resolve PagerDuty Incidents

```
USAGE
  $ pd incident:resolve

OPTIONS
  -F, --from=from        Login email of a PD user account for the "From:" header. Use only with legacy API tokens.
  -b, --useauth=useauth  Use the saved REST API token with this alias
  -h, --help             show CLI help
  -i, --ids=ids          Incident ID's to resolve. Specify multiple times for multiple incidents.
  -m, --me               Resolve all incidents assigned to me
  -p, --pipe             Read incident ID's from stdin.
  --debug                Print REST API call debug logs
  --token=token          Ignore the saved configuration and use this token
```

_See code: [src/commands/incident/resolve.ts](https://github.com/martindstone/pagerduty-cli/blob/v0.0.78/src/commands/incident/resolve.ts)_

## `pd log`

Show PagerDuty Domain Log Entries

```
USAGE
  $ pd log

OPTIONS
  -O, --overview             Get only `overview` log entries
  -b, --useauth=useauth      Use the saved REST API token with this alias

  -d, --delimiter=delimiter  [default:
                             ] Delimiter for fields that have more than one value

  -h, --help                 show CLI help

  -j, --json                 output full details as JSON

  -k, --keys=keys            Additional fields to display. Specify multiple times for multiple fields.

  -x, --extended             show extra columns

  --columns=columns          only show provided columns (comma-separated)

  --csv                      output is csv format [alias: --output=csv]

  --debug                    Print REST API call debug logs

  --filter=filter            filter property by partial string matching, ex: name=foo

  --no-header                hide table header from output

  --no-truncate              do not truncate output to fit screen

  --output=csv|json|yaml     output in a more machine friendly format

  --since=since              [default: 30 days ago] The start of the date range over which you want to search.

  --sort=sort                property to sort by (prepend '-' for descending)

  --token=token              Ignore the saved configuration and use this token

  --until=until              The end of the date range over which you want to search.
```

_See code: [src/commands/log.ts](https://github.com/martindstone/pagerduty-cli/blob/v0.0.78/src/commands/log.ts)_

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

  -b, --useauth=useauth    Use the saved REST API token with this alias

  -e, --endpoint=endpoint  (required) The path to the endpoint, for example, `/users/PXXXXXX` or `/services`

  -h, --help               show CLI help

  --debug                  Print REST API call debug logs

  --token=token            Ignore the saved configuration and use this token
```

_See code: [src/commands/rest/delete.ts](https://github.com/martindstone/pagerduty-cli/blob/v0.0.78/src/commands/rest/delete.ts)_

## `pd rest:fetch`

Fetch objects from PagerDuty

```
USAGE
  $ pd rest:fetch

OPTIONS
  -H, --headers=headers      [default: ] Headers to add, for example, `From=martin@pagerduty.com`. Specify multiple
                             times for multiple headers.

  -P, --params=params        [default: ] Parameters to add, for example, `query=martin` or `include[]=teams. Specify
                             multiple times for multiple params.

  -b, --useauth=useauth      Use the saved REST API token with this alias

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

  --debug                    Print REST API call debug logs

  --filter=filter            filter property by partial string matching, ex: name=foo

  --no-header                hide table header from output

  --no-truncate              do not truncate output to fit screen

  --output=csv|json|yaml     output in a more machine friendly format

  --sort=sort                property to sort by (prepend '-' for descending)

  --token=token              Ignore the saved configuration and use this token
```

_See code: [src/commands/rest/fetch.ts](https://github.com/martindstone/pagerduty-cli/blob/v0.0.78/src/commands/rest/fetch.ts)_

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

  -b, --useauth=useauth    Use the saved REST API token with this alias

  -e, --endpoint=endpoint  (required) The path to the endpoint, for example, `/users/PXXXXXX` or `/services`

  -h, --help               show CLI help

  --debug                  Print REST API call debug logs

  --token=token            Ignore the saved configuration and use this token
```

_See code: [src/commands/rest/get.ts](https://github.com/martindstone/pagerduty-cli/blob/v0.0.78/src/commands/rest/get.ts)_

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

  -b, --useauth=useauth    Use the saved REST API token with this alias

  -d, --data=data          (required) JSON data to send

  -e, --endpoint=endpoint  (required) The path to the endpoint, for example, `/users/PXXXXXX` or `/services`

  -h, --help               show CLI help

  --debug                  Print REST API call debug logs

  --token=token            Ignore the saved configuration and use this token
```

_See code: [src/commands/rest/post.ts](https://github.com/martindstone/pagerduty-cli/blob/v0.0.78/src/commands/rest/post.ts)_

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

  -b, --useauth=useauth    Use the saved REST API token with this alias

  -d, --data=data          (required) JSON data to send

  -e, --endpoint=endpoint  (required) The path to the endpoint, for example, `/users/PXXXXXX` or `/services`

  -h, --help               show CLI help

  --debug                  Print REST API call debug logs

  --token=token            Ignore the saved configuration and use this token
```

_See code: [src/commands/rest/put.ts](https://github.com/martindstone/pagerduty-cli/blob/v0.0.78/src/commands/rest/put.ts)_

## `pd schedule:copy`

Make a copy of a PagerDuty Schedule

```
USAGE
  $ pd schedule:copy

OPTIONS
  -b, --useauth=useauth          Use the saved REST API token with this alias
  -d, --destination=destination  The name for the new schedule
  -h, --help                     show CLI help
  -i, --id=id                    The ID of the schedule to copy.
  -n, --name=name                The name of the schedule to copy.
  -o, --open                     Open the new schedule in the browser
  -p, --pipe                     Print the new schedule ID only to stdout, for use with pipes.
  --debug                        Print REST API call debug logs
  --token=token                  Ignore the saved configuration and use this token
```

_See code: [src/commands/schedule/copy.ts](https://github.com/martindstone/pagerduty-cli/blob/v0.0.78/src/commands/schedule/copy.ts)_

## `pd schedule:list`

List PagerDuty Schedules

```
USAGE
  $ pd schedule:list

OPTIONS
  -b, --useauth=useauth      Use the saved REST API token with this alias

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

  --debug                    Print REST API call debug logs

  --filter=filter            filter property by partial string matching, ex: name=foo

  --no-header                hide table header from output

  --no-truncate              do not truncate output to fit screen

  --output=csv|json|yaml     output in a more machine friendly format

  --sort=sort                property to sort by (prepend '-' for descending)

  --token=token              Ignore the saved configuration and use this token
```

_See code: [src/commands/schedule/list.ts](https://github.com/martindstone/pagerduty-cli/blob/v0.0.78/src/commands/schedule/list.ts)_

## `pd schedule:oncall`

List a PagerDuty Schedule's on call shifts.

```
USAGE
  $ pd schedule:oncall

OPTIONS
  -b, --useauth=useauth   Use the saved REST API token with this alias
  -h, --help              show CLI help
  -i, --id=id             Show oncalls for the schedule with this ID.
  -j, --json              output full details as JSON
  -k, --keys=keys         Additional fields to display. Specify multiple times for multiple fields.
  -n, --name=name         Show oncalls for the schedule with this name.
  -x, --extended          show extra columns
  --columns=columns       only show provided columns (comma-separated)
  --csv                   output is csv format [alias: --output=csv]
  --debug                 Print REST API call debug logs
  --filter=filter         filter property by partial string matching, ex: name=foo
  --no-header             hide table header from output
  --no-truncate           do not truncate output to fit screen
  --output=csv|json|yaml  output in a more machine friendly format
  --since=since           The start of the date range over which you want to search.
  --sort=sort             property to sort by (prepend '-' for descending)
  --token=token           Ignore the saved configuration and use this token
  --until=until           The end of the date range over which you want to search.
```

_See code: [src/commands/schedule/oncall.ts](https://github.com/martindstone/pagerduty-cli/blob/v0.0.78/src/commands/schedule/oncall.ts)_

## `pd schedule:open`

Open PagerDuty Schedules in the browser

```
USAGE
  $ pd schedule:open

OPTIONS
  -b, --useauth=useauth  Use the saved REST API token with this alias
  -h, --help             show CLI help
  -i, --ids=ids          The IDs of schedules to open.
  -n, --name=name        Open schedules matching this string.
  -p, --pipe             Read schedule ID's from stdin.
  --debug                Print REST API call debug logs
  --token=token          Ignore the saved configuration and use this token
```

_See code: [src/commands/schedule/open.ts](https://github.com/martindstone/pagerduty-cli/blob/v0.0.78/src/commands/schedule/open.ts)_

## `pd schedule:override:add`

Add an override to a PagerDuty schedule.

```
USAGE
  $ pd schedule:override:add

OPTIONS
  -U, --user_email=user_email  The email of the PagerDuty user for the override
  -b, --useauth=useauth        Use the saved REST API token with this alias
  -h, --help                   show CLI help
  -i, --id=id                  Add an override to the schedule with this ID.
  -n, --name=name              Add an override to the schedule with this name.
  -u, --user_id=user_id        The ID of the PagerDuty user for the override
  --debug                      Print REST API call debug logs
  --end=end                    [default: in 1 day] The end time for the override.
  --start=start                [default: now] The start time for the override.
  --token=token                Ignore the saved configuration and use this token
```

_See code: [src/commands/schedule/override/add.ts](https://github.com/martindstone/pagerduty-cli/blob/v0.0.78/src/commands/schedule/override/add.ts)_

## `pd schedule:override:list`

List a PagerDuty Schedule's overrides.

```
USAGE
  $ pd schedule:override:list

OPTIONS
  -b, --useauth=useauth      Use the saved REST API token with this alias

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

  --debug                    Print REST API call debug logs

  --filter=filter            filter property by partial string matching, ex: name=foo

  --no-header                hide table header from output

  --no-truncate              do not truncate output to fit screen

  --output=csv|json|yaml     output in a more machine friendly format

  --since=since              [default: now] The start of the date range over which you want to search.

  --sort=sort                property to sort by (prepend '-' for descending)

  --token=token              Ignore the saved configuration and use this token

  --until=until              [default: in 30 days] The end of the date range over which you want to search.
```

_See code: [src/commands/schedule/override/list.ts](https://github.com/martindstone/pagerduty-cli/blob/v0.0.78/src/commands/schedule/override/list.ts)_

## `pd schedule:render`

Render a PagerDuty Schedule

```
USAGE
  $ pd schedule:render

OPTIONS
  -b, --useauth=useauth   Use the saved REST API token with this alias
  -h, --help              show CLI help
  -i, --id=id             Render the schedule with this ID.
  -n, --name=name         Render the schedule with this name.
  -x, --extended          show extra columns
  --columns=columns       only show provided columns (comma-separated)
  --csv                   output is csv format [alias: --output=csv]
  --debug                 Print REST API call debug logs
  --filter=filter         filter property by partial string matching, ex: name=foo
  --no-header             hide table header from output
  --no-truncate           do not truncate output to fit screen
  --output=csv|json|yaml  output in a more machine friendly format
  --since=since           The start of the date range over which you want to search.
  --sort=sort             property to sort by (prepend '-' for descending)
  --token=token           Ignore the saved configuration and use this token
  --until=until           The end of the date range over which you want to search.
```

_See code: [src/commands/schedule/render.ts](https://github.com/martindstone/pagerduty-cli/blob/v0.0.78/src/commands/schedule/render.ts)_

## `pd schedule:show`

Show a PagerDuty Schedule

```
USAGE
  $ pd schedule:show

OPTIONS
  -b, --useauth=useauth  Use the saved REST API token with this alias
  -h, --help             show CLI help
  -i, --id=id            Show the schedule with this ID.
  -n, --name=name        Show the schedule with this name.
  --debug                Print REST API call debug logs
  --since=since          The start of the date range over which you want to search.
  --token=token          Ignore the saved configuration and use this token
  --until=until          The end of the date range over which you want to search.
```

_See code: [src/commands/schedule/show.ts](https://github.com/martindstone/pagerduty-cli/blob/v0.0.78/src/commands/schedule/show.ts)_

## `pd service:create`

Create a PagerDuty Service

```
USAGE
  $ pd service:create

OPTIONS
  -E, --escalation_policy_name=escalation_policy_name      The name of the service's escalation policy.

  -F, --from=from                                          Login email of a PD user account for the "From:" header. Use
                                                           only with legacy API tokens.

  -b, --useauth=useauth                                    Use the saved REST API token with this alias

  -d, --description=description                            The service's description

  -e, --escalation_policy_id=escalation_policy_id          The ID of the service's escalation policy.

  -h, --help                                               show CLI help

  -n, --name=name                                          (required) The service's name

  -o, --open                                               Open the new service in the browser

  -p, --pipe                                               Print the service ID only to stdout, for use with pipes.

  -r, --auto_resolve_timeout=auto_resolve_timeout          Automatically resolve incidents after this number of minutes

  -t, --ack_timeout=ack_timeout                            Automatically re-trigger incidents after this number of
                                                           minutes

  -u, --urgency=high|low|use_support_hours|severity_based  The urgency of incidents in the service

  --Gc=any|all                                             Do content-based alert grouping. Specify the fields to look
                                                           at with --Gf and choose 'any' or 'all' fields.

  --Gd=Gd                                                  Do time based alert grouping for this number of minutes.

  --Gf=Gf                                                  The fields to look at for content based alert grouping.
                                                           Specify multiple times for multiple fields.

  --Gi                                                     Do intelligent alert grouping

  --Sd=Sd                                                  A day when support hours are active. Specify multiple times
                                                           for multiple days.

  --Se=Se                                                  The time of day when support hours end

  --Ss=Ss                                                  The time of day when support hours start

  --Uc                                                     Change unacknowledged incidents to high urgency when entering
                                                           high-urgency support hours

  --Ud=high|low|severity_based                             Incident urgency during support hours.

  --Uo=high|low|severity_based                             Incident urgency outside of support hours.

  --create_alerts                                          Turn on alert support in the service (default: true)

  --debug                                                  Print REST API call debug logs

  --token=token                                            Ignore the saved configuration and use this token
```

_See code: [src/commands/service/create.ts](https://github.com/martindstone/pagerduty-cli/blob/v0.0.78/src/commands/service/create.ts)_

## `pd service:disable`

Disable PagerDuty Services

```
USAGE
  $ pd service:disable

OPTIONS
  -b, --useauth=useauth  Use the saved REST API token with this alias
  -h, --help             show CLI help
  -i, --ids=ids          Select services with the given ID. Specify multiple times for multiple services.
  -n, --name=name        Select services whose names contain the given text
  -p, --pipe             Read service ID's from stdin.
  --debug                Print REST API call debug logs
  --token=token          Ignore the saved configuration and use this token
```

_See code: [src/commands/service/disable.ts](https://github.com/martindstone/pagerduty-cli/blob/v0.0.78/src/commands/service/disable.ts)_

## `pd service:enable`

Enable PagerDuty Services

```
USAGE
  $ pd service:enable

OPTIONS
  -b, --useauth=useauth  Use the saved REST API token with this alias
  -h, --help             show CLI help
  -i, --ids=ids          Select services with the given ID. Specify multiple times for multiple services.
  -n, --name=name        Select services whose names contain the given text
  -p, --pipe             Read service ID's from stdin.
  --debug                Print REST API call debug logs
  --token=token          Ignore the saved configuration and use this token
```

_See code: [src/commands/service/enable.ts](https://github.com/martindstone/pagerduty-cli/blob/v0.0.78/src/commands/service/enable.ts)_

## `pd service:list`

List PagerDuty Services

```
USAGE
  $ pd service:list

OPTIONS
  -b, --useauth=useauth      Use the saved REST API token with this alias

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

  --debug                    Print REST API call debug logs

  --filter=filter            filter property by partial string matching, ex: name=foo

  --no-header                hide table header from output

  --no-truncate              do not truncate output to fit screen

  --output=csv|json|yaml     output in a more machine friendly format

  --sort=sort                property to sort by (prepend '-' for descending)

  --token=token              Ignore the saved configuration and use this token
```

_See code: [src/commands/service/list.ts](https://github.com/martindstone/pagerduty-cli/blob/v0.0.78/src/commands/service/list.ts)_

## `pd service:open`

Open PagerDuty Services in the browser

```
USAGE
  $ pd service:open

OPTIONS
  -b, --useauth=useauth  Use the saved REST API token with this alias
  -h, --help             show CLI help
  -i, --ids=ids          The IDs of services to open.
  -n, --name=name        Open services matching this string.
  -p, --pipe             Read service ID's from stdin.
  --debug                Print REST API call debug logs
  --token=token          Ignore the saved configuration and use this token
```

_See code: [src/commands/service/open.ts](https://github.com/martindstone/pagerduty-cli/blob/v0.0.78/src/commands/service/open.ts)_

## `pd service:set`

Set PagerDuty Service attributes

```
USAGE
  $ pd service:set

OPTIONS
  -b, --useauth=useauth  Use the saved REST API token with this alias
  -h, --help             show CLI help
  -i, --ids=ids          Select services with the given ID. Specify multiple times for multiple services.
  -k, --key=key          (required) Attribute key to set
  -n, --name=name        Select services whose names contain the given text
  -p, --pipe             Read service ID's from stdin.
  -v, --value=value      (required) Attribute value to set
  --debug                Print REST API call debug logs
  --token=token          Ignore the saved configuration and use this token
```

_See code: [src/commands/service/set.ts](https://github.com/martindstone/pagerduty-cli/blob/v0.0.78/src/commands/service/set.ts)_

## `pd team:create`

Create an empty PagerDuty Team. You can add escalation policies and users later with team:ep and team:user

```
USAGE
  $ pd team:create

OPTIONS
  -A, --parent_name=parent_name  The name of the new team's parent team
  -a, --parent_id=parent_id      The ID of the new team's parent team
  -b, --useauth=useauth          Use the saved REST API token with this alias
  -h, --help                     show CLI help
  -n, --name=name                (required) The name of the team to add.
  -o, --open                     Open the new team in the browser
  -p, --pipe                     Print the team ID only to stdout, for use with pipes.
  --debug                        Print REST API call debug logs
  --description=description      The description of the team
  --token=token                  Ignore the saved configuration and use this token
```

_See code: [src/commands/team/create.ts](https://github.com/martindstone/pagerduty-cli/blob/v0.0.78/src/commands/team/create.ts)_

## `pd team:ep:add`

Add PagerDuty escalation policies to Teams.

```
USAGE
  $ pd team:ep:add

OPTIONS
  -E, --ep_names=ep_names  Add an escalation policy with this name. Specify multiple times for multiple escalation
                           policies.

  -b, --useauth=useauth    Use the saved REST API token with this alias

  -e, --ep_ids=ep_ids      Add an escalation policy with this ID. Specify multiple times for multiple escalation
                           policies.

  -h, --help               show CLI help

  -i, --ids=ids            The IDs of teams to add escalation policies to.

  -n, --name=name          Select teams whose names contain the given text

  --debug                  Print REST API call debug logs

  --token=token            Ignore the saved configuration and use this token
```

_See code: [src/commands/team/ep/add.ts](https://github.com/martindstone/pagerduty-cli/blob/v0.0.78/src/commands/team/ep/add.ts)_

## `pd team:ep:remove`

Remove PagerDuty escalation policies from Teams.

```
USAGE
  $ pd team:ep:remove

OPTIONS
  -E, --ep_names=ep_names  Remove an escalation policy with this name. Specify multiple times for multiple escalation
                           policies.

  -b, --useauth=useauth    Use the saved REST API token with this alias

  -e, --ep_ids=ep_ids      Remove an escalation policy with this ID. Specify multiple times for multiple escalation
                           policies.

  -h, --help               show CLI help

  -i, --ids=ids            The IDs of teams to remove escalation policies from.

  -n, --name=name          Select teams whose names contain the given text

  --debug                  Print REST API call debug logs

  --token=token            Ignore the saved configuration and use this token
```

_See code: [src/commands/team/ep/remove.ts](https://github.com/martindstone/pagerduty-cli/blob/v0.0.78/src/commands/team/ep/remove.ts)_

## `pd team:list`

List PagerDuty Teams

```
USAGE
  $ pd team:list

OPTIONS
  -b, --useauth=useauth      Use the saved REST API token with this alias

  -d, --delimiter=delimiter  [default:
                             ] Delimiter for fields that have more than one value

  -h, --help                 show CLI help

  -j, --json                 output full details as JSON

  -k, --keys=keys            Additional fields to display. Specify multiple times for multiple fields.

  -n, --name=name            Select teams whose names contain the given text

  -p, --pipe                 Print user ID's only to stdout, for use with pipes.

  -x, --extended             show extra columns

  --columns=columns          only show provided columns (comma-separated)

  --csv                      output is csv format [alias: --output=csv]

  --debug                    Print REST API call debug logs

  --filter=filter            filter property by partial string matching, ex: name=foo

  --no-header                hide table header from output

  --no-truncate              do not truncate output to fit screen

  --output=csv|json|yaml     output in a more machine friendly format

  --sort=sort                property to sort by (prepend '-' for descending)

  --token=token              Ignore the saved configuration and use this token
```

_See code: [src/commands/team/list.ts](https://github.com/martindstone/pagerduty-cli/blob/v0.0.78/src/commands/team/list.ts)_

## `pd team:open`

Open PagerDuty Teams in the browser

```
USAGE
  $ pd team:open

OPTIONS
  -b, --useauth=useauth  Use the saved REST API token with this alias
  -h, --help             show CLI help
  -i, --ids=ids          The IDs of teams to open.
  -n, --name=name        Open teams matching this string.
  -p, --pipe             Read team ID's from stdin.
  --debug                Print REST API call debug logs
  --token=token          Ignore the saved configuration and use this token
```

_See code: [src/commands/team/open.ts](https://github.com/martindstone/pagerduty-cli/blob/v0.0.78/src/commands/team/open.ts)_

## `pd team:user:add`

Add PagerDuty users to Teams. If a given user is already a member, this command will set their role on the team.

```
USAGE
  $ pd team:user:add

OPTIONS
  -U, --user_emails=user_emails          Add a user with this email. Specify multiple times for multiple users.
  -b, --useauth=useauth                  Use the saved REST API token with this alias
  -h, --help                             show CLI help
  -i, --ids=ids                          The IDs of teams to add members to.
  -n, --name=name                        Select teams whose names contain the given text
  -r, --role=manager|responder|observer  [default: manager] The role of the user(s) on the team(s)
  -u, --user_ids=user_ids                Add a user with this ID. Specify multiple times for multiple users.
  --debug                                Print REST API call debug logs
  --token=token                          Ignore the saved configuration and use this token
```

_See code: [src/commands/team/user/add.ts](https://github.com/martindstone/pagerduty-cli/blob/v0.0.78/src/commands/team/user/add.ts)_

## `pd team:user:list`

List PagerDuty Team Members

```
USAGE
  $ pd team:user:list

OPTIONS
  -b, --useauth=useauth      Use the saved REST API token with this alias

  -d, --delimiter=delimiter  [default:
                             ] Delimiter for fields that have more than one value

  -h, --help                 show CLI help

  -i, --ids=ids              The IDs of teams to list members for.

  -j, --json                 output full details as JSON

  -k, --keys=keys            Additional fields to display. Specify multiple times for multiple fields.

  -n, --name=name            Select teams whose names contain the given text

  -p, --pipe                 Print user ID's only to stdout, for use with pipes.

  -x, --extended             show extra columns

  --columns=columns          only show provided columns (comma-separated)

  --csv                      output is csv format [alias: --output=csv]

  --debug                    Print REST API call debug logs

  --filter=filter            filter property by partial string matching, ex: name=foo

  --no-header                hide table header from output

  --no-truncate              do not truncate output to fit screen

  --output=csv|json|yaml     output in a more machine friendly format

  --sort=sort                property to sort by (prepend '-' for descending)

  --token=token              Ignore the saved configuration and use this token
```

_See code: [src/commands/team/user/list.ts](https://github.com/martindstone/pagerduty-cli/blob/v0.0.78/src/commands/team/user/list.ts)_

## `pd team:user:remove`

Remove PagerDuty users from Teams

```
USAGE
  $ pd team:user:remove

OPTIONS
  -U, --user_emails=user_emails  Remove a user with this email. Specify multiple times for multiple users.
  -b, --useauth=useauth          Use the saved REST API token with this alias
  -h, --help                     show CLI help
  -i, --ids=ids                  The IDs of teams to remove members from.
  -n, --name=name                Select teams whose names contain the given text
  -u, --user_ids=user_ids        Remove a user with this ID. Specify multiple times for multiple users.
  --debug                        Print REST API call debug logs
  --token=token                  Ignore the saved configuration and use this token
```

_See code: [src/commands/team/user/remove.ts](https://github.com/martindstone/pagerduty-cli/blob/v0.0.78/src/commands/team/user/remove.ts)_

## `pd update [CHANNEL]`

update the pd CLI

```
USAGE
  $ pd update [CHANNEL]

OPTIONS
  --from-local  interactively choose an already installed version
```

_See code: [@oclif/plugin-update](https://github.com/oclif/plugin-update/blob/v1.5.0/src/commands/update.ts)_

## `pd user:contact:add`

Add a contact method to a PagerDuty user

```
USAGE
  $ pd user:contact:add

OPTIONS
  -T, --type=email|phone|sms  (required) The contact method type.
  -a, --address=address       (required) The contact method address or phone number.
  -b, --useauth=useauth       Use the saved REST API token with this alias
  -e, --email=email           Add contact to the user with this login email.
  -h, --help                  show CLI help
  -i, --id=id                 Add contact to the user with this ID.
  -l, --label=label           (required) The contact method label.
  --debug                     Print REST API call debug logs
  --token=token               Ignore the saved configuration and use this token
```

_See code: [src/commands/user/contact/add.ts](https://github.com/martindstone/pagerduty-cli/blob/v0.0.78/src/commands/user/contact/add.ts)_

## `pd user:contact:list`

List a PagerDuty User's contact methods.

```
USAGE
  $ pd user:contact:list

OPTIONS
  -b, --useauth=useauth      Use the saved REST API token with this alias

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

  --debug                    Print REST API call debug logs

  --filter=filter            filter property by partial string matching, ex: name=foo

  --no-header                hide table header from output

  --no-truncate              do not truncate output to fit screen

  --output=csv|json|yaml     output in a more machine friendly format

  --sort=sort                property to sort by (prepend '-' for descending)

  --token=token              Ignore the saved configuration and use this token
```

_See code: [src/commands/user/contact/list.ts](https://github.com/martindstone/pagerduty-cli/blob/v0.0.78/src/commands/user/contact/list.ts)_

## `pd user:contact:set`

Update a contact method for a PagerDuty user

```
USAGE
  $ pd user:contact:set

OPTIONS
  -a, --address=address        The contact method address or phone number to set.
  -b, --useauth=useauth        Use the saved REST API token with this alias
  -c, --contact_id=contact_id  (required) Update the contact with this ID.
  -e, --email=email            Update a contact for the user with this login email.
  -h, --help                   show CLI help
  -i, --id=id                  Update a contact for the user with this ID.
  -l, --label=label            The contact method label to set.
  --debug                      Print REST API call debug logs
  --token=token                Ignore the saved configuration and use this token
```

_See code: [src/commands/user/contact/set.ts](https://github.com/martindstone/pagerduty-cli/blob/v0.0.78/src/commands/user/contact/set.ts)_

## `pd user:create`

Create a PagerDuty User

```
USAGE
  $ pd user:create

OPTIONS
  -F, --from=from
      Login email of a PD user account for the "From:" header. Use only with legacy API tokens.

  -b, --useauth=useauth
      Use the saved REST API token with this alias

  -c, --color=color
      The user's schedule color

  -d, --description=description
      The user's job description

  -e, --email=email
      (required) The user's login email

  -h, --help
      show CLI help

  -n, --name=name
      (required) The user's name

  -o, --open
      Open the new user in the browser

  -p, --pipe
      Print the user ID only to stdout, for use with pipes.

  -r, --role=admin|read_only_user|read_only_limited_user|user|limited_user|observer|restricted_access
      [default: user] The user's role

  -t, --title=title
      The user's job title

  -w, --password=password
      The user's password - if not specified, a random password will be generated

  -z, --timezone=timezone
      [default: UTC] The user's time zone

  --debug
      Print REST API call debug logs

  --show_password
      Show the user's password when creating

  --token=token
      Ignore the saved configuration and use this token
```

_See code: [src/commands/user/create.ts](https://github.com/martindstone/pagerduty-cli/blob/v0.0.78/src/commands/user/create.ts)_

## `pd user:list`

List PagerDuty Users

```
USAGE
  $ pd user:list

OPTIONS
  -E, --exact_email=exact_email  Select the user whose login email is this exact text
  -b, --useauth=useauth          Use the saved REST API token with this alias

  -d, --delimiter=delimiter      [default:
                                 ] Delimiter for fields that have more than one value

  -e, --email=email              Select users whose login email addresses contain the given text

  -h, --help                     show CLI help

  -j, --json                     output full details as JSON

  -k, --keys=keys                Additional fields to display. Specify multiple times for multiple fields.

  -p, --pipe                     Print user ID's only to stdout, for use with pipes.

  -x, --extended                 show extra columns

  --columns=columns              only show provided columns (comma-separated)

  --csv                          output is csv format [alias: --output=csv]

  --debug                        Print REST API call debug logs

  --filter=filter                filter property by partial string matching, ex: name=foo

  --no-header                    hide table header from output

  --no-truncate                  do not truncate output to fit screen

  --output=csv|json|yaml         output in a more machine friendly format

  --sort=sort                    property to sort by (prepend '-' for descending)

  --token=token                  Ignore the saved configuration and use this token
```

_See code: [src/commands/user/list.ts](https://github.com/martindstone/pagerduty-cli/blob/v0.0.78/src/commands/user/list.ts)_

## `pd user:log`

Show PagerDuty User Log Entries

```
USAGE
  $ pd user:log

OPTIONS
  -E, --exact_email=exact_email  Select the user whose login email is this exact text
  -O, --overview                 Get only `overview` log entries
  -b, --useauth=useauth          Use the saved REST API token with this alias

  -d, --delimiter=delimiter      [default:
                                 ] Delimiter for fields that have more than one value

  -e, --email=email              Select users whose login email addresses contain the given text

  -h, --help                     show CLI help

  -i, --ids=ids                  Select users with the given ID. Specify multiple times for multiple users.

  -j, --json                     output full details as JSON

  -k, --keys=keys                Additional fields to display. Specify multiple times for multiple fields.

  -p, --pipe                     Read user IDs from stdin, for use with pipes.

  -x, --extended                 show extra columns

  --columns=columns              only show provided columns (comma-separated)

  --csv                          output is csv format [alias: --output=csv]

  --debug                        Print REST API call debug logs

  --filter=filter                filter property by partial string matching, ex: name=foo

  --no-header                    hide table header from output

  --no-truncate                  do not truncate output to fit screen

  --output=csv|json|yaml         output in a more machine friendly format

  --since=since                  [default: 30 days ago] The start of the date range over which you want to search.

  --sort=sort                    property to sort by (prepend '-' for descending)

  --token=token                  Ignore the saved configuration and use this token

  --until=until                  The end of the date range over which you want to search.
```

_See code: [src/commands/user/log.ts](https://github.com/martindstone/pagerduty-cli/blob/v0.0.78/src/commands/user/log.ts)_

## `pd user:oncall`

List a PagerDuty User's on call shifts.

```
USAGE
  $ pd user:oncall

OPTIONS
  -a, --always            Include 'Always on call.'
  -b, --useauth=useauth   Use the saved REST API token with this alias
  -e, --email=email       Show oncalls for the user with this login email.
  -h, --help              show CLI help
  -i, --id=id             Show oncalls for the user with this ID.
  -j, --json              output full details as JSON
  -k, --keys=keys         Additional fields to display. Specify multiple times for multiple fields.
  -m, --me                Show my oncalls.
  -x, --extended          show extra columns
  --columns=columns       only show provided columns (comma-separated)
  --csv                   output is csv format [alias: --output=csv]
  --debug                 Print REST API call debug logs
  --filter=filter         filter property by partial string matching, ex: name=foo
  --no-header             hide table header from output
  --no-truncate           do not truncate output to fit screen
  --output=csv|json|yaml  output in a more machine friendly format
  --since=since           The start of the date range over which you want to search.
  --sort=sort             property to sort by (prepend '-' for descending)
  --token=token           Ignore the saved configuration and use this token
  --until=until           The end of the date range over which you want to search.
```

_See code: [src/commands/user/oncall.ts](https://github.com/martindstone/pagerduty-cli/blob/v0.0.78/src/commands/user/oncall.ts)_

## `pd user:replace`

Replace PagerDuty Users in all Schedules and Escalation Policies

```
USAGE
  $ pd user:replace

OPTIONS
  -U, --user_email=user_email  The email of the replacement user.
  -b, --useauth=useauth        Use the saved REST API token with this alias
  -d, --deleted                Replace all deleted users
  -h, --help                   show CLI help
  -i, --ids=ids                Replace users with the given IDs. Specify multiple times for multiple users.
  -p, --pipe                   Read user ID's from stdin.
  -u, --user_id=user_id        The ID of the replacement user.
  --debug                      Print REST API call debug logs
  --force                      Extreme danger mode: do not prompt before updating
  --token=token                Ignore the saved configuration and use this token
```

_See code: [src/commands/user/replace.ts](https://github.com/martindstone/pagerduty-cli/blob/v0.0.78/src/commands/user/replace.ts)_

## `pd user:session:list`

List a PagerDuty User's sessions.

```
USAGE
  $ pd user:session:list

OPTIONS
  -b, --useauth=useauth   Use the saved REST API token with this alias
  -e, --email=email       Show sessions for the user with this login email.
  -h, --help              show CLI help
  -i, --id=id             Show sessions for the user with this ID.
  -j, --json              output full details as JSON
  -k, --keys=keys         Additional fields to display. Specify multiple times for multiple fields.
  -p, --pipe              Print session ID's only to stdout, for use with pipes.
  -q, --query=query       Query the API output
  -x, --extended          show extra columns
  --columns=columns       only show provided columns (comma-separated)
  --csv                   output is csv format [alias: --output=csv]
  --debug                 Print REST API call debug logs
  --filter=filter         filter property by partial string matching, ex: name=foo
  --no-header             hide table header from output
  --no-truncate           do not truncate output to fit screen
  --output=csv|json|yaml  output in a more machine friendly format
  --since=since           The start of the date range over which you want to search.
  --sort=sort             property to sort by (prepend '-' for descending)
  --token=token           Ignore the saved configuration and use this token
  --until=until           The end of the date range over which you want to search.
```

_See code: [src/commands/user/session/list.ts](https://github.com/martindstone/pagerduty-cli/blob/v0.0.78/src/commands/user/session/list.ts)_

## `pd user:set`

Set PagerDuty User attributes

```
USAGE
  $ pd user:set

OPTIONS
  -E, --exact_emails=exact_emails  Select a user whose login email is this exact text.  Specify multiple times for
                                   multiple emails.

  -b, --useauth=useauth            Use the saved REST API token with this alias

  -e, --emails=emails              Select users whose emails contain the given text. Specify multiple times for multiple
                                   emails.

  -h, --help                       show CLI help

  -i, --ids=ids                    Select users with the given ID. Specify multiple times for multiple users.

  -k, --key=key                    (required) Attribute key to set

  -p, --pipe                       Read user ID's from stdin.

  -v, --value=value                (required) Attribute value to set

  --debug                          Print REST API call debug logs

  --token=token                    Ignore the saved configuration and use this token
```

_See code: [src/commands/user/set.ts](https://github.com/martindstone/pagerduty-cli/blob/v0.0.78/src/commands/user/set.ts)_

## `pd util:timestamp [DATE]`

Make ISO8601 timestamps

```
USAGE
  $ pd util:timestamp [DATE]

ARGUMENTS
  DATE  A human-style date/time, like "4pm 1/1/2021" or "Dec 2 1pm", etc. Default: now

OPTIONS
  -b, --useauth=useauth  Use the saved REST API token with this alias
  -h, --help             show CLI help
  --debug                Print REST API call debug logs
  --token=token          Ignore the saved configuration and use this token
```

_See code: [src/commands/util/timestamp.ts](https://github.com/martindstone/pagerduty-cli/blob/v0.0.78/src/commands/util/timestamp.ts)_
<!-- commandsstop -->
