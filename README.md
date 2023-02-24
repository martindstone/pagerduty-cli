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
* [`pd analytics incident`](#pd-analytics-incident)
* [`pd analytics incident raw`](#pd-analytics-incident-raw)
* [`pd auth add`](#pd-auth-add)
* [`pd auth delete`](#pd-auth-delete)
* [`pd auth get`](#pd-auth-get)
* [`pd auth list`](#pd-auth-list)
* [`pd auth add`](#pd-auth-add-1)
* [`pd auth use`](#pd-auth-use)
* [`pd auth web`](#pd-auth-web)
* [`pd autocomplete [SHELL]`](#pd-autocomplete-shell)
* [`pd automation action create`](#pd-automation-action-create)
* [`pd automation action list`](#pd-automation-action-list)
* [`pd automation runner create`](#pd-automation-runner-create)
* [`pd automation runner list`](#pd-automation-runner-list)
* [`pd commands`](#pd-commands)
* [`pd ep copy`](#pd-ep-copy)
* [`pd ep create`](#pd-ep-create)
* [`pd ep level add`](#pd-ep-level-add)
* [`pd ep level remove`](#pd-ep-level-remove)
* [`pd ep list`](#pd-ep-list)
* [`pd ep listdeletedusers`](#pd-ep-listdeletedusers)
* [`pd ep oncall`](#pd-ep-oncall)
* [`pd ep open`](#pd-ep-open)
* [`pd ep target add`](#pd-ep-target-add)
* [`pd ep target remove`](#pd-ep-target-remove)
* [`pd event alert`](#pd-event-alert)
* [`pd event change`](#pd-event-change)
* [`pd field create`](#pd-field-create)
* [`pd field list`](#pd-field-list)
* [`pd field option create`](#pd-field-option-create)
* [`pd field option list`](#pd-field-option-list)
* [`pd field option remove`](#pd-field-option-remove)
* [`pd field schema addfield`](#pd-field-schema-addfield)
* [`pd field schema assignment create`](#pd-field-schema-assignment-create)
* [`pd field schema assignment list`](#pd-field-schema-assignment-list)
* [`pd field schema assignment remove`](#pd-field-schema-assignment-remove)
* [`pd field schema create`](#pd-field-schema-create)
* [`pd field schema list`](#pd-field-schema-list)
* [`pd field schema listfields`](#pd-field-schema-listfields)
* [`pd field schema removefield`](#pd-field-schema-removefield)
* [`pd help [COMMANDS]`](#pd-help-commands)
* [`pd incident ack`](#pd-incident-ack)
* [`pd incident ack`](#pd-incident-ack-1)
* [`pd incident alerts`](#pd-incident-alerts)
* [`pd incident analytics`](#pd-incident-analytics)
* [`pd incident assign`](#pd-incident-assign)
* [`pd incident create`](#pd-incident-create)
* [`pd incident field get`](#pd-incident-field-get)
* [`pd incident field set`](#pd-incident-field-set)
* [`pd incident list`](#pd-incident-list)
* [`pd incident log`](#pd-incident-log)
* [`pd incident merge`](#pd-incident-merge)
* [`pd incident notes`](#pd-incident-notes)
* [`pd incident open`](#pd-incident-open)
* [`pd incident priority`](#pd-incident-priority)
* [`pd incident assign`](#pd-incident-assign-1)
* [`pd incident rename`](#pd-incident-rename)
* [`pd incident resolve`](#pd-incident-resolve)
* [`pd incident responder add`](#pd-incident-responder-add)
* [`pd incident responder list`](#pd-incident-responder-list)
* [`pd incident set`](#pd-incident-set)
* [`pd incident subscriber add`](#pd-incident-subscriber-add)
* [`pd incident subscriber list`](#pd-incident-subscriber-list)
* [`pd incident subscriber remove`](#pd-incident-subscriber-remove)
* [`pd incident subscriber update`](#pd-incident-subscriber-update)
* [`pd incident set`](#pd-incident-set-1)
* [`pd log`](#pd-log)
* [`pd auth web`](#pd-auth-web-1)
* [`pd orchestration add`](#pd-orchestration-add)
* [`pd orchestration list`](#pd-orchestration-list)
* [`pd orchestration route add`](#pd-orchestration-route-add)
* [`pd orchestration route delete`](#pd-orchestration-route-delete)
* [`pd orchestration route list`](#pd-orchestration-route-list)
* [`pd rest delete`](#pd-rest-delete)
* [`pd rest fetch`](#pd-rest-fetch)
* [`pd rest get`](#pd-rest-get)
* [`pd rest post`](#pd-rest-post)
* [`pd rest put`](#pd-rest-put)
* [`pd schedule copy`](#pd-schedule-copy)
* [`pd schedule create`](#pd-schedule-create)
* [`pd schedule list`](#pd-schedule-list)
* [`pd schedule listdeletedusers`](#pd-schedule-listdeletedusers)
* [`pd schedule oncall`](#pd-schedule-oncall)
* [`pd schedule open`](#pd-schedule-open)
* [`pd schedule override add`](#pd-schedule-override-add)
* [`pd schedule override list`](#pd-schedule-override-list)
* [`pd schedule render`](#pd-schedule-render)
* [`pd schedule show`](#pd-schedule-show)
* [`pd service create`](#pd-service-create)
* [`pd service disable`](#pd-service-disable)
* [`pd service enable`](#pd-service-enable)
* [`pd service list`](#pd-service-list)
* [`pd service open`](#pd-service-open)
* [`pd service set`](#pd-service-set)
* [`pd tag assign`](#pd-tag-assign)
* [`pd tag list`](#pd-tag-list)
* [`pd tag listobjects`](#pd-tag-listobjects)
* [`pd team create`](#pd-team-create)
* [`pd team ep add`](#pd-team-ep-add)
* [`pd team ep list`](#pd-team-ep-list)
* [`pd team ep remove`](#pd-team-ep-remove)
* [`pd team list`](#pd-team-list)
* [`pd team open`](#pd-team-open)
* [`pd team user add`](#pd-team-user-add)
* [`pd team user list`](#pd-team-user-list)
* [`pd team user remove`](#pd-team-user-remove)
* [`pd update [CHANNEL]`](#pd-update-channel)
* [`pd user contact add`](#pd-user-contact-add)
* [`pd user contact list`](#pd-user-contact-list)
* [`pd user contact set`](#pd-user-contact-set)
* [`pd user create`](#pd-user-create)
* [`pd user delete`](#pd-user-delete)
* [`pd user list`](#pd-user-list)
* [`pd user log`](#pd-user-log)
* [`pd user oncall`](#pd-user-oncall)
* [`pd user replace`](#pd-user-replace)
* [`pd user session list`](#pd-user-session-list)
* [`pd user set`](#pd-user-set)
* [`pd util deleteresource`](#pd-util-deleteresource)
* [`pd util timestamp`](#pd-util-timestamp)
* [`pd version`](#pd-version)

## `pd analytics incident`

Get PagerDuty Incident Analytics

```
USAGE
  $ pd analytics incident

FLAGS
  -M, --major                    Include only major incidents
  -S, --services=<value>...      Service names to include. Specify multiple times for multiple services.
  -b, --useauth=<value>          Use the saved REST API token with this alias
  -d, --delimiter=<value>        [default: \n] Delimiter for fields that have more than one value
  -g, --aggregate_unit=<option>  The time unit to aggregate metrics by. If no value is provided, the metrics will be
                                 aggregated for the entire period.
                                 <options: day|week|month>
  -h, --help                     Show CLI help.
  -j, --json                     output full details as JSON
  -k, --keys=<value>...          Additional fields to display. Specify multiple times for multiple fields.
  -t, --teams=<value>...         Team names to include. Specify multiple times for multiple teams.
  -u, --urgencies=<option>...    [default: high,low] Urgencies to include.
                                 <options: high|low>
  -x, --extended                 show extra columns
  --columns=<value>              only show provided columns (comma-separated)
  --csv                          output is csv format [alias: --output=csv]
  --debug                        Print REST API call debug logs
  --filter=<value>               filter property by partial string matching, ex: name=foo
  --no-header                    hide table header from output
  --no-truncate                  do not truncate output to fit screen
  --output=<option>              output in a more machine friendly format
                                 <options: csv|json|yaml>
  --since=<value>                [default: 7 days ago] The start of the date range over which you want to search.
  --sort=<value>                 property to sort by (prepend '-' for descending)
  --token=<value>                Ignore the saved configuration and use this token
  --until=<value>                [default: now] The end of the date range over which you want to search.

DESCRIPTION
  Get PagerDuty Incident Analytics
```

## `pd analytics incident raw`

Get PagerDuty Raw Incident Analytics

```
USAGE
  $ pd analytics incident raw

FLAGS
  -M, --major                Include only major incidents
  -S, --services=<value>...  Service names to include. Specify multiple times for multiple services.
  -b, --useauth=<value>      Use the saved REST API token with this alias
  -d, --delimiter=<value>    [default: \n] Delimiter for fields that have more than one value
  -h, --help                 Show CLI help.
  -j, --json                 output full details as JSON
  -k, --keys=<value>...      Additional fields to display. Specify multiple times for multiple fields.
  -t, --teams=<value>...     Team names to include. Specify multiple times for multiple teams.
  -x, --extended             show extra columns
  --columns=<value>          only show provided columns (comma-separated)
  --csv                      output is csv format [alias: --output=csv]
  --debug                    Print REST API call debug logs
  --filter=<value>           filter property by partial string matching, ex: name=foo
  --no-header                hide table header from output
  --no-truncate              do not truncate output to fit screen
  --output=<option>          output in a more machine friendly format
                             <options: csv|json|yaml>
  --since=<value>            The start of the date range over which you want to search.
  --sort=<value>             property to sort by (prepend '-' for descending)
  --token=<value>            Ignore the saved configuration and use this token
  --until=<value>            The end of the date range over which you want to search.

DESCRIPTION
  Get PagerDuty Raw Incident Analytics
```

## `pd auth add`

Add an authenticated PagerDuty domain

```
USAGE
  $ pd auth add

FLAGS
  -a, --alias=<value>  The alias to use for this token. Defaults to the name of the PD subdomain
  -d, --[no-]default   Use this token as the default for all PD commands
  -h, --help           Show CLI help.
  -t, --token=<value>  A PagerDuty API token
  --debug              Print REST API call debug logs

DESCRIPTION
  Add an authenticated PagerDuty domain

ALIASES
  $ pd auth set
```

## `pd auth delete`

Delete a PagerDuty domain authentication

```
USAGE
  $ pd auth delete

FLAGS
  -a, --alias=<value>  (required) The alias of the PD domain authentication to delete
  -h, --help           Show CLI help.
  --debug              Print REST API call debug logs

DESCRIPTION
  Delete a PagerDuty domain authentication
```

## `pd auth get`

Get the current authenticated PagerDuty domain

```
USAGE
  $ pd auth get

FLAGS
  -h, --help  Show CLI help.
  --debug     Print REST API call debug logs

DESCRIPTION
  Get the current authenticated PagerDuty domain
```

## `pd auth list`

List authenticated PagerDuty domains

```
USAGE
  $ pd auth list

FLAGS
  -h, --help  Show CLI help.
  --debug     Print REST API call debug logs

DESCRIPTION
  List authenticated PagerDuty domains
```

## `pd auth add`

Add an authenticated PagerDuty domain

```
USAGE
  $ pd auth add

FLAGS
  -a, --alias=<value>  The alias to use for this token. Defaults to the name of the PD subdomain
  -d, --[no-]default   Use this token as the default for all PD commands
  -h, --help           Show CLI help.
  -t, --token=<value>  A PagerDuty API token
  --debug              Print REST API call debug logs

DESCRIPTION
  Add an authenticated PagerDuty domain

ALIASES
  $ pd auth set
```

## `pd auth use`

Choose a saved authenticated PagerDuty domain to use with all pd commands

```
USAGE
  $ pd auth use

FLAGS
  -a, --alias=<value>  (required) The alias of the PD domain to use
  -h, --help           Show CLI help.
  --debug              Print REST API call debug logs

DESCRIPTION
  Choose a saved authenticated PagerDuty domain to use with all pd commands
```

## `pd auth web`

Authenticate with PagerDuty in the browser

```
USAGE
  $ pd auth web

FLAGS
  -a, --alias=<value>  The alias to use for this token. Defaults to the name of the PD subdomain
  -d, --[no-]default   Use this token as the default for all PD commands
  -h, --help           Show CLI help.
  --debug              Print REST API call debug logs

DESCRIPTION
  Authenticate with PagerDuty in the browser

ALIASES
  $ pd login
```

## `pd autocomplete [SHELL]`

display autocomplete installation instructions

```
USAGE
  $ pd autocomplete [SHELL] [-r]

ARGUMENTS
  SHELL  shell type

FLAGS
  -r, --refresh-cache  Refresh cache (ignores displaying instructions)

DESCRIPTION
  display autocomplete installation instructions

EXAMPLES
  $ pd autocomplete

  $ pd autocomplete bash

  $ pd autocomplete zsh

  $ pd autocomplete --refresh-cache
```

_See code: [@oclif/plugin-autocomplete](https://github.com/oclif/plugin-autocomplete/blob/v1.4.6/src/commands/autocomplete/index.ts)_

## `pd automation action create`

Create a PagerDuty Automation Action

```
USAGE
  $ pd automation action create

FLAGS
  -R, --runner_name=<value>         The name of the runner to run this action
  -S, --service_names=<value>...    The names of services whose incidents will have this action available.
  -T, --team_names=<value>...       The names of teams that will have access to run this action.
  -X, --script_from_stdin           For script actions - read the body of the script from stdin.
  -b, --useauth=<value>             Use the saved REST API token with this alias
  -c, --classification=<option>     The classification of the new automation action
                                    <options: diagnostic|remediation>
  -d, --description=<value>         (required) The description of the new automation action
  -h, --help                        Show CLI help.
  -i, --invocation_command=<value>  For script actions - if the script body is not an executable file, the path to the
                                    command to run it with.
  -j, --job_id=<value>              For process automation actions - the job ID of the job to run
  -n, --name=<value>                (required) The name of the new automation action
  -o, --open                        Open the new action in the browser once it's been created
  -p, --pipe                        Print the new action ID only to stdout, for use with pipes.
  -r, --runner_id=<value>           The ID of the runner to run this action
  -s, --service_ids=<value>...      The IDs of services whose incidents will have this action available.
  -t, --team_ids=<value>...         The IDs of teams that will have access to run this action.
  -x, --script=<value>              For script actions - the body of the script to be executed on the runner.
  --debug                           Print REST API call debug logs
  --job_arguments=<value>           For process automation actions - arguments to pass to the job
  --token=<value>                   Ignore the saved configuration and use this token

DESCRIPTION
  Create a PagerDuty Automation Action
```

## `pd automation action list`

List PagerDuty Automation Actions

```
USAGE
  $ pd automation action list

FLAGS
  -b, --useauth=<value>    Use the saved REST API token with this alias
  -d, --delimiter=<value>  [default: \n] Delimiter for fields that have more than one value
  -h, --help               Show CLI help.
  -j, --json               output full details as JSON
  -k, --keys=<value>...    Additional fields to display. Specify multiple times for multiple fields.
  -n, --name=<value>       Select automation actions whose names contain the given text
  -p, --pipe               Print automation action ID's only to stdout, for use with pipes.
  -x, --extended           show extra columns
  --columns=<value>        only show provided columns (comma-separated)
  --csv                    output is csv format [alias: --output=csv]
  --debug                  Print REST API call debug logs
  --filter=<value>         filter property by partial string matching, ex: name=foo
  --limit=<value>          Return no more than this many entries. This option turns off table filtering options.
  --no-header              hide table header from output
  --no-truncate            do not truncate output to fit screen
  --output=<option>        output in a more machine friendly format
                           <options: csv|json|yaml>
  --sort=<value>           property to sort by (prepend '-' for descending)
  --token=<value>          Ignore the saved configuration and use this token

DESCRIPTION
  List PagerDuty Automation Actions
```

## `pd automation runner create`

Create a PagerDuty Automation Action

```
USAGE
  $ pd automation runner create

FLAGS
  -T, --team_names=<value>...     The names of teams associated with this runner
  -b, --useauth=<value>           Use the saved REST API token with this alias
  -d, --description=<value>       (required) The description of the new runner
  -h, --help                      Show CLI help.
  -k, --runbook_api_key=<value>   For Runbook Automation runners, the API key to use to connect to the Runbook server
  -n, --name=<value>              (required) The name of the new runner
  -o, --open                      Open the new runner in the browser once it's been created
  -p, --pipe                      Print only the new runner credentials (for Process Automation runners) or ID (for
                                  Runbook Automation runners) to stdout.
  -t, --team_ids=<value>...       The IDs of teams associated with this runner
  -u, --runbook_base_uri=<value>  For Runbook Automation runners, the base URI of the Runbook server to connect to
  -y, --runner_type=<option>      (required) The type of runner to create. Use `sidecar` to create a Process Automation
                                  runner, and `runbook` to create a Runbook Automation runner
                                  <options: sidecar|runbook>
  --debug                         Print REST API call debug logs
  --token=<value>                 Ignore the saved configuration and use this token

DESCRIPTION
  Create a PagerDuty Automation Action
```

## `pd automation runner list`

List PagerDuty Automation Actions Runners

```
USAGE
  $ pd automation runner list

FLAGS
  -b, --useauth=<value>    Use the saved REST API token with this alias
  -d, --delimiter=<value>  [default: \n] Delimiter for fields that have more than one value
  -h, --help               Show CLI help.
  -j, --json               output full details as JSON
  -k, --keys=<value>...    Additional fields to display. Specify multiple times for multiple fields.
  -n, --name=<value>       Select runners whose names contain the given text
  -p, --pipe               Print runner ID's only to stdout, for use with pipes.
  -x, --extended           show extra columns
  --columns=<value>        only show provided columns (comma-separated)
  --csv                    output is csv format [alias: --output=csv]
  --debug                  Print REST API call debug logs
  --filter=<value>         filter property by partial string matching, ex: name=foo
  --health                 Also get runner health info (uses more API requests)
  --limit=<value>          Return no more than this many entries. This option turns off table filtering options.
  --no-header              hide table header from output
  --no-truncate            do not truncate output to fit screen
  --output=<option>        output in a more machine friendly format
                           <options: csv|json|yaml>
  --sort=<value>           property to sort by (prepend '-' for descending)
  --token=<value>          Ignore the saved configuration and use this token

DESCRIPTION
  List PagerDuty Automation Actions Runners
```

## `pd commands`

list all the commands

```
USAGE
  $ pd commands [--json] [-h] [--hidden] [--tree] [--columns <value> | -x] [--sort <value>] [--filter <value>]
    [--output csv|json|yaml |  | [--csv | --no-truncate]] [--no-header | ]

FLAGS
  -h, --help         Show CLI help.
  -x, --extended     show extra columns
  --columns=<value>  only show provided columns (comma-separated)
  --csv              output is csv format [alias: --output=csv]
  --filter=<value>   filter property by partial string matching, ex: name=foo
  --hidden           show hidden commands
  --no-header        hide table header from output
  --no-truncate      do not truncate output to fit screen
  --output=<option>  output in a more machine friendly format
                     <options: csv|json|yaml>
  --sort=<value>     property to sort by (prepend '-' for descending)
  --tree             show tree of commands

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  list all the commands
```

_See code: [@oclif/plugin-commands](https://github.com/oclif/plugin-commands/blob/v2.2.9/src/commands/commands.ts)_

## `pd ep copy`

Make a copy of a PagerDuty Escalation Policy

```
USAGE
  $ pd ep copy

FLAGS
  -b, --useauth=<value>      Use the saved REST API token with this alias
  -d, --destination=<value>  The name for the new escalation policy
  -h, --help                 Show CLI help.
  -i, --id=<value>           The ID of the escalation policy to copy.
  -n, --name=<value>         The name of the escalation policy to copy.
  -o, --open                 Open the new escalation policy in the browser
  -p, --pipe                 Print the new escalation policy ID only to stdout, for use with pipes.
  --debug                    Print REST API call debug logs
  --token=<value>            Ignore the saved configuration and use this token

DESCRIPTION
  Make a copy of a PagerDuty Escalation Policy
```

## `pd ep create`

Create a PagerDuty Escalation Policy with a single level. You can add levels and targets later with ep:level and ep:target

```
USAGE
  $ pd ep create

FLAGS
  -S, --schedule_names=<value>...  Add a target schedule with this name. Specify multiple times for multiple targets.
  -U, --user_emails=<value>...     Add a target user with this email. Specify multiple times for multiple targets.
  -b, --useauth=<value>            Use the saved REST API token with this alias
  -d, --delay=<value>              [default: 30] Delay in minutes before unacknowledged incidents escalate away from
                                   this level
  -h, --help                       Show CLI help.
  -n, --name=<value>               (required) The name of the escalation policy to add.
  -o, --open                       Open the new escalation policy in the browser
  -p, --pipe                       Print the escalation policy ID only to stdout, for use with pipes.
  -r, --repeat=<value>             Number of times to repeat this level
  -s, --schedule_ids=<value>...    Add a target schedule with this ID. Specify multiple times for multiple targets.
  -u, --user_ids=<value>...        Add a target user with this ID. Specify multiple times for multiple targets.
  --debug                          Print REST API call debug logs
  --description=<value>            The description of the escalation policy
  --token=<value>                  Ignore the saved configuration and use this token

DESCRIPTION
  Create a PagerDuty Escalation Policy with a single level. You can add levels and targets later with ep:level and
  ep:target
```

## `pd ep level add`

Add a level to PagerDuty Escalation Policies

```
USAGE
  $ pd ep level add

FLAGS
  -S, --schedule_names=<value>...  Add a target schedule with this name. Specify multiple times for multiple targets.
  -U, --user_emails=<value>...     Add a target user with this email. Specify multiple times for multiple targets.
  -b, --useauth=<value>            Use the saved REST API token with this alias
  -d, --delay=<value>              [default: 30] Delay in minutes before unacknowledged incidents escalate away from
                                   this level
  -h, --help                       Show CLI help.
  -i, --ids=<value>...             The IDs of escalation policies to update.
  -l, --level=<value>              (required) Escalation policy level to add (the lowest level is 1; any existing levels
                                   at or above the added level will be moved up. To add the top level, specify any
                                   number higher than the existing number of levels (e.g., 99))
  -n, --name=<value>               Update escalation policies whose names match this string.
  -p, --pipe                       Read escalation policy ID's from stdin.
  -s, --schedule_ids=<value>...    Add a target schedule with this ID. Specify multiple times for multiple targets.
  -u, --user_ids=<value>...        Add a target user with this ID. Specify multiple times for multiple targets.
  --debug                          Print REST API call debug logs
  --token=<value>                  Ignore the saved configuration and use this token

DESCRIPTION
  Add a level to PagerDuty Escalation Policies
```

## `pd ep level remove`

Remove a level from PagerDuty Escalation Policies

```
USAGE
  $ pd ep level remove

FLAGS
  -b, --useauth=<value>  Use the saved REST API token with this alias
  -h, --help             Show CLI help.
  -i, --ids=<value>...   The IDs of escalation policies to update.
  -l, --level=<value>    (required) Escalation policy level to remove (the lowest level is 1; any existing levels above
                         the deleted level will be moved down.
  -n, --name=<value>     Update escalation policies whose names match this string.
  -p, --pipe             Read escalation policy ID's from stdin.
  --debug                Print REST API call debug logs
  --token=<value>        Ignore the saved configuration and use this token

DESCRIPTION
  Remove a level from PagerDuty Escalation Policies
```

## `pd ep list`

List PagerDuty Escalation Policies

```
USAGE
  $ pd ep list

FLAGS
  -b, --useauth=<value>    Use the saved REST API token with this alias
  -d, --delimiter=<value>  [default: \n] Delimiter for fields that have more than one value
  -h, --help               Show CLI help.
  -j, --json               output full details as JSON
  -k, --keys=<value>...    Additional fields to display. Specify multiple times for multiple fields.
  -n, --name=<value>       Select escalation policies whose names contain the given text
  -p, --pipe               Print escalation policy ID's only to stdout, for use with pipes.
  -x, --extended           show extra columns
  --columns=<value>        only show provided columns (comma-separated)
  --csv                    output is csv format [alias: --output=csv]
  --debug                  Print REST API call debug logs
  --filter=<value>         filter property by partial string matching, ex: name=foo
  --limit=<value>          Return no more than this many entries. This option turns off table filtering options.
  --no-header              hide table header from output
  --no-truncate            do not truncate output to fit screen
  --output=<option>        output in a more machine friendly format
                           <options: csv|json|yaml>
  --sort=<value>           property to sort by (prepend '-' for descending)
  --token=<value>          Ignore the saved configuration and use this token

DESCRIPTION
  List PagerDuty Escalation Policies
```

## `pd ep listdeletedusers`

List deleted users in all PagerDuty Escalation Policies

```
USAGE
  $ pd ep listdeletedusers

FLAGS
  -b, --useauth=<value>  Use the saved REST API token with this alias
  -h, --help             Show CLI help.
  -x, --extended         show extra columns
  --columns=<value>      only show provided columns (comma-separated)
  --csv                  output is csv format [alias: --output=csv]
  --debug                Print REST API call debug logs
  --filter=<value>       filter property by partial string matching, ex: name=foo
  --no-header            hide table header from output
  --no-truncate          do not truncate output to fit screen
  --output=<option>      output in a more machine friendly format
                         <options: csv|json|yaml>
  --sort=<value>         property to sort by (prepend '-' for descending)
  --token=<value>        Ignore the saved configuration and use this token

DESCRIPTION
  List deleted users in all PagerDuty Escalation Policies
```

## `pd ep oncall`

List a PagerDuty Escalation Policy's on call shifts.

```
USAGE
  $ pd ep oncall

FLAGS
  -b, --useauth=<value>    Use the saved REST API token with this alias
  -d, --delimiter=<value>  [default: \n] Delimiter for fields that have more than one value
  -h, --help               Show CLI help.
  -i, --id=<value>         Show oncalls for the EP with this ID.
  -j, --json               output full details as JSON
  -k, --keys=<value>...    Additional fields to display. Specify multiple times for multiple fields.
  -n, --name=<value>       Show oncalls for the EP with this name.
  -x, --extended           show extra columns
  --columns=<value>        only show provided columns (comma-separated)
  --csv                    output is csv format [alias: --output=csv]
  --debug                  Print REST API call debug logs
  --filter=<value>         filter property by partial string matching, ex: name=foo
  --no-header              hide table header from output
  --no-truncate            do not truncate output to fit screen
  --output=<option>        output in a more machine friendly format
                           <options: csv|json|yaml>
  --since=<value>          The start of the date range over which you want to search.
  --sort=<value>           property to sort by (prepend '-' for descending)
  --token=<value>          Ignore the saved configuration and use this token
  --until=<value>          The end of the date range over which you want to search.

DESCRIPTION
  List a PagerDuty Escalation Policy's on call shifts.
```

## `pd ep open`

Open PagerDuty Escalation policies in the browser

```
USAGE
  $ pd ep open

FLAGS
  -b, --useauth=<value>  Use the saved REST API token with this alias
  -h, --help             Show CLI help.
  -i, --ids=<value>...   The IDs of escalation policies to open.
  -n, --name=<value>     Open escalation policies whose names match this string.
  -p, --pipe             Read escalation policy ID's from stdin.
  --debug                Print REST API call debug logs
  --token=<value>        Ignore the saved configuration and use this token

DESCRIPTION
  Open PagerDuty Escalation policies in the browser
```

## `pd ep target add`

Add targets to PagerDuty Escalation Policies

```
USAGE
  $ pd ep target add

FLAGS
  -S, --schedule_names=<value>...  Add a target schedule with this name. Specify multiple times for multiple targets.
  -U, --user_emails=<value>...     Add a target user with this email. Specify multiple times for multiple targets.
  -b, --useauth=<value>            Use the saved REST API token with this alias
  -h, --help                       Show CLI help.
  -i, --ids=<value>...             The IDs of escalation policies to update.
  -l, --level=<value>              (required) Escalation policy level to add targets to
  -n, --name=<value>               Update escalation policies whose names match this string.
  -p, --pipe                       Read escalation policy ID's from stdin.
  -s, --schedule_ids=<value>...    Add a target schedule with this ID. Specify multiple times for multiple targets.
  -u, --user_ids=<value>...        Add a target user with this ID. Specify multiple times for multiple targets.
  --debug                          Print REST API call debug logs
  --token=<value>                  Ignore the saved configuration and use this token

DESCRIPTION
  Add targets to PagerDuty Escalation Policies
```

## `pd ep target remove`

Remove targets from PagerDuty Escalation Policies

```
USAGE
  $ pd ep target remove

FLAGS
  -S, --schedule_names=<value>...  Remove a target schedule with this name. Specify multiple times for multiple targets.
  -U, --user_emails=<value>...     Remove a target user with this email. Specify multiple times for multiple targets.
  -b, --useauth=<value>            Use the saved REST API token with this alias
  -h, --help                       Show CLI help.
  -i, --ids=<value>...             The IDs of escalation policies to update.
  -l, --level=<value>              (required) Escalation policy level to remove targets from
  -n, --name=<value>               Update escalation policies whose names match this string.
  -p, --pipe                       Read escalation policy ID's from stdin.
  -s, --schedule_ids=<value>...    Remove a target schedule with this ID. Specify multiple times for multiple targets.
  -u, --user_ids=<value>...        Remove a target user with this ID. Specify multiple times for multiple targets.
  --debug                          Print REST API call debug logs
  --token=<value>                  Ignore the saved configuration and use this token

DESCRIPTION
  Remove targets from PagerDuty Escalation Policies
```

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

## `pd field create`

Create a PagerDuty Custom Field

```
USAGE
  $ pd field create

FLAGS
  -N, --display_name=<value>  (required) A human readable name for the field
  -b, --useauth=<value>       Use the saved REST API token with this alias
  -d, --description=<value>   A human readable description for the field
  -f, --fixed                 Fixed-options field. Specify to create a field that can only take on specific values
                              defined in a list.
  -h, --help                  Show CLI help.
  -m, --multi                 Multi-value field. Specify to create a field that can contain a list of <type> values.
  -n, --name=<value>          (required) An identifier for the field intended primarily for scripting or other
                              programmatic use.
  -p, --pipe                  Print the field ID only to stdout, for use with pipes.
  -t, --type=<option>         The data type of the field
                              <options: string|integer|float|boolean|datetime|url>
  --debug                     Print REST API call debug logs
  --token=<value>             Ignore the saved configuration and use this token

DESCRIPTION
  Create a PagerDuty Custom Field
```

## `pd field list`

List PagerDuty Custom Fields

```
USAGE
  $ pd field list

FLAGS
  -b, --useauth=<value>    Use the saved REST API token with this alias
  -d, --delimiter=<value>  [default:
                           ] Delimiter for fields that have more than one value
  -h, --help               Show CLI help.
  -j, --json               output full details as JSON
  -k, --keys=<value>...    Additional fields to display. Specify multiple times for multiple fields.
  -p, --pipe               Print field ID's only to stdout, for use with pipes.
  -x, --extended           show extra columns
  --columns=<value>        only show provided columns (comma-separated)
  --csv                    output is csv format [alias: --output=csv]
  --debug                  Print REST API call debug logs
  --filter=<value>         filter property by partial string matching, ex: name=foo
  --no-header              hide table header from output
  --no-truncate            do not truncate output to fit screen
  --output=<option>        output in a more machine friendly format
                           <options: csv|json|yaml>
  --sort=<value>           property to sort by (prepend '-' for descending)
  --token=<value>          Ignore the saved configuration and use this token

DESCRIPTION
  List PagerDuty Custom Fields
```

## `pd field option create`

Create an option for a fixed-options Custom Field

```
USAGE
  $ pd field option create

FLAGS
  -b, --useauth=<value>  Use the saved REST API token with this alias
  -h, --help             Show CLI help.
  -i, --id=<value>       (required) The ID of a fixed-options Field to add an option to.
  -p, --pipe             Print the new field option ID only to stdout, for use with pipes.
  -v, --value=<value>    (required) The field option value to add
  --debug                Print REST API call debug logs
  --token=<value>        Ignore the saved configuration and use this token

DESCRIPTION
  Create an option for a fixed-options Custom Field
```

## `pd field option list`

List PagerDuty Custom Field Options

```
USAGE
  $ pd field option list

FLAGS
  -b, --useauth=<value>  Use the saved REST API token with this alias
  -h, --help             Show CLI help.
  -i, --id=<value>       (required) The ID of a fixed-options Field to list options for.
  -j, --json             output full details as JSON
  -k, --keys=<value>...  Additional fields to display. Specify multiple times for multiple fields.
  -p, --pipe             Print field option ID's only to stdout, for use with pipes.
  -x, --extended         show extra columns
  --columns=<value>      only show provided columns (comma-separated)
  --csv                  output is csv format [alias: --output=csv]
  --debug                Print REST API call debug logs
  --filter=<value>       filter property by partial string matching, ex: name=foo
  --no-header            hide table header from output
  --no-truncate          do not truncate output to fit screen
  --output=<option>      output in a more machine friendly format
                         <options: csv|json|yaml>
  --sort=<value>         property to sort by (prepend '-' for descending)
  --token=<value>        Ignore the saved configuration and use this token

DESCRIPTION
  List PagerDuty Custom Field Options
```

## `pd field option remove`

Remove an option from a fixed-options Custom Field

```
USAGE
  $ pd field option remove

FLAGS
  -b, --useauth=<value>    Use the saved REST API token with this alias
  -h, --help               Show CLI help.
  -i, --id=<value>         (required) The ID of a fixed-options Field to remove an option from.
  -o, --option_id=<value>  (required) The ID of the option to remove from the field.
  --debug                  Print REST API call debug logs
  --token=<value>          Ignore the saved configuration and use this token

DESCRIPTION
  Remove an option from a fixed-options Custom Field
```

## `pd field schema addfield`

Add a Field to a PagerDuty Custom Field Schema

```
USAGE
  $ pd field schema addfield

FLAGS
  -b, --useauth=<value>          Use the saved REST API token with this alias
  -d, --defaultvalue=<value>...  Provide a default value for the field. You can specify multiple times if the field is
                                 multi-valued.
  -f, --field_id=<value>         (required) The ID of a field to add to the schema.
  -h, --help                     Show CLI help.
  -i, --id=<value>               (required) The ID of a Field Schema to add fields to.
  -r, --required                 The specified field is a required field.
  --debug                        Print REST API call debug logs
  --overwrite                    Overwrite existing configuration for this field if it is already present in the schema
  --token=<value>                Ignore the saved configuration and use this token

DESCRIPTION
  Add a Field to a PagerDuty Custom Field Schema
```

## `pd field schema assignment create`

Create a PagerDuty Custom Field Schema Assignment

```
USAGE
  $ pd field schema assignment create

FLAGS
  -b, --useauth=<value>     Use the saved REST API token with this alias
  -h, --help                Show CLI help.
  -i, --id=<value>          (required) The ID of a Field Schema to assign.
  -s, --service_id=<value>  (required) The ID of a service to assign the schema to.
  --debug                   Print REST API call debug logs
  --token=<value>           Ignore the saved configuration and use this token

DESCRIPTION
  Create a PagerDuty Custom Field Schema Assignment
```

## `pd field schema assignment list`

List PagerDuty Custom Field Schema Service Assignments

```
USAGE
  $ pd field schema assignment list

FLAGS
  -b, --useauth=<value>         Use the saved REST API token with this alias
  -d, --delimiter=<value>       [default:
                                ] Delimiter for fields that have more than one value
  -h, --help                    Show CLI help.
  -i, --ids=<value>...          A schema ID to list assignments for. Specify multiple times for multiple schemas.
  -j, --json                    output full details as JSON
  -k, --keys=<value>...         Additional fields to display. Specify multiple times for multiple fields.
  -s, --service_ids=<value>...  A service ID to list assignments for. Specify multiple times for multiple services.
  -x, --extended                show extra columns
  --columns=<value>             only show provided columns (comma-separated)
  --csv                         output is csv format [alias: --output=csv]
  --debug                       Print REST API call debug logs
  --filter=<value>              filter property by partial string matching, ex: name=foo
  --no-header                   hide table header from output
  --no-truncate                 do not truncate output to fit screen
  --output=<option>             output in a more machine friendly format
                                <options: csv|json|yaml>
  --sort=<value>                property to sort by (prepend '-' for descending)
  --token=<value>               Ignore the saved configuration and use this token

DESCRIPTION
  List PagerDuty Custom Field Schema Service Assignments
```

## `pd field schema assignment remove`

Remove a PagerDuty Custom Field Schema Assignment

```
USAGE
  $ pd field schema assignment remove

FLAGS
  -b, --useauth=<value>  Use the saved REST API token with this alias
  -h, --help             Show CLI help.
  -i, --id=<value>       (required) The ID of a Field Schema Assignment to remove.
  --debug                Print REST API call debug logs
  --token=<value>        Ignore the saved configuration and use this token

DESCRIPTION
  Remove a PagerDuty Custom Field Schema Assignment
```

## `pd field schema create`

Create a PagerDuty Custom Field Schema

```
USAGE
  $ pd field schema create

FLAGS
  -b, --useauth=<value>      Use the saved REST API token with this alias
  -d, --description=<value>  A human readable description for the schema
  -h, --help                 Show CLI help.
  -p, --pipe                 Print the schema ID only to stdout, for use with pipes.
  -t, --title=<value>        (required) An identifier for the schema intended primarily for scripting or other
                             programmatic use.
  --debug                    Print REST API call debug logs
  --token=<value>            Ignore the saved configuration and use this token

DESCRIPTION
  Create a PagerDuty Custom Field Schema
```

## `pd field schema list`

List PagerDuty Custom Field Schemas

```
USAGE
  $ pd field schema list

FLAGS
  -b, --useauth=<value>    Use the saved REST API token with this alias
  -d, --delimiter=<value>  [default:
                           ] Delimiter for fields that have more than one value
  -h, --help               Show CLI help.
  -j, --json               output full details as JSON
  -k, --keys=<value>...    Additional fields to display. Specify multiple times for multiple fields.
  -p, --pipe               Print field ID's only to stdout, for use with pipes.
  -x, --extended           show extra columns
  --columns=<value>        only show provided columns (comma-separated)
  --csv                    output is csv format [alias: --output=csv]
  --debug                  Print REST API call debug logs
  --filter=<value>         filter property by partial string matching, ex: name=foo
  --no-header              hide table header from output
  --no-truncate            do not truncate output to fit screen
  --output=<option>        output in a more machine friendly format
                           <options: csv|json|yaml>
  --sort=<value>           property to sort by (prepend '-' for descending)
  --token=<value>          Ignore the saved configuration and use this token

DESCRIPTION
  List PagerDuty Custom Field Schemas
```

## `pd field schema listfields`

List Fields in a PagerDuty Custom Field Schema

```
USAGE
  $ pd field schema listfields

FLAGS
  -b, --useauth=<value>    Use the saved REST API token with this alias
  -d, --delimiter=<value>  [default:
                           ] Delimiter for fields that have more than one value
  -h, --help               Show CLI help.
  -i, --id=<value>         (required) The ID of the schema to show fields for
  -j, --json               output full details as JSON
  -k, --keys=<value>...    Additional fields to display. Specify multiple times for multiple fields.
  -p, --pipe               Print field ID's only to stdout, for use with pipes.
  -x, --extended           show extra columns
  --columns=<value>        only show provided columns (comma-separated)
  --csv                    output is csv format [alias: --output=csv]
  --debug                  Print REST API call debug logs
  --filter=<value>         filter property by partial string matching, ex: name=foo
  --no-header              hide table header from output
  --no-truncate            do not truncate output to fit screen
  --output=<option>        output in a more machine friendly format
                           <options: csv|json|yaml>
  --sort=<value>           property to sort by (prepend '-' for descending)
  --token=<value>          Ignore the saved configuration and use this token

DESCRIPTION
  List Fields in a PagerDuty Custom Field Schema
```

## `pd field schema removefield`

Remove a Field from a PagerDuty Custom Field Schema

```
USAGE
  $ pd field schema removefield

FLAGS
  -b, --useauth=<value>   Use the saved REST API token with this alias
  -f, --field_id=<value>  (required) The ID of the field to remove from the schema.
  -h, --help              Show CLI help.
  -i, --id=<value>        (required) The ID of the schema to delete a field from
  --debug                 Print REST API call debug logs
  --token=<value>         Ignore the saved configuration and use this token

DESCRIPTION
  Remove a Field from a PagerDuty Custom Field Schema
```

## `pd help [COMMANDS]`

Display help for pd.

```
USAGE
  $ pd help [COMMANDS] [-n]

ARGUMENTS
  COMMANDS  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for pd.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.2.4/src/commands/help.ts)_

## `pd incident ack`

Acknowledge PagerDuty Incidents

```
USAGE
  $ pd incident ack

FLAGS
  -F, --from=<value>     Login email of a PD user account for the "From:" header. Use only with legacy API tokens.
  -b, --useauth=<value>  Use the saved REST API token with this alias
  -h, --help             Show CLI help.
  -i, --ids=<value>...   Incident ID's to acknowledge. Specify multiple times for multiple incidents.
  -m, --me               Acknowledge all incidents assigned to me
  -p, --pipe             Read incident ID's from stdin.
  -z, --snooze=<value>   Also snooze selected incidents for the specified amount of time (5m, '1 hour', default unit is
                         seconds).
  --debug                Print REST API call debug logs
  --token=<value>        Ignore the saved configuration and use this token

DESCRIPTION
  Acknowledge PagerDuty Incidents

ALIASES
  $ pd incident acknowledge
```

## `pd incident ack`

Acknowledge PagerDuty Incidents

```
USAGE
  $ pd incident ack

FLAGS
  -F, --from=<value>     Login email of a PD user account for the "From:" header. Use only with legacy API tokens.
  -b, --useauth=<value>  Use the saved REST API token with this alias
  -h, --help             Show CLI help.
  -i, --ids=<value>...   Incident ID's to acknowledge. Specify multiple times for multiple incidents.
  -m, --me               Acknowledge all incidents assigned to me
  -p, --pipe             Read incident ID's from stdin.
  -z, --snooze=<value>   Also snooze selected incidents for the specified amount of time (5m, '1 hour', default unit is
                         seconds).
  --debug                Print REST API call debug logs
  --token=<value>        Ignore the saved configuration and use this token

DESCRIPTION
  Acknowledge PagerDuty Incidents

ALIASES
  $ pd incident acknowledge
```

## `pd incident alerts`

Show Alerts in PagerDuty Incidents

```
USAGE
  $ pd incident alerts

FLAGS
  -b, --useauth=<value>    Use the saved REST API token with this alias
  -d, --delimiter=<value>  [default: \n] Delimiter for fields that have more than one value
  -h, --help               Show CLI help.
  -i, --ids=<value>...     Show alerts for these Incident ID's. Specify multiple times for multiple incidents.
  -j, --json               output full details as JSON
  -k, --keys=<value>...    Additional fields to display. Specify multiple times for multiple fields.
  -m, --me                 Show alerts for all incidents assigned to me
  -p, --pipe               Read incident ID's from stdin.
  -x, --extended           show extra columns
  --columns=<value>        only show provided columns (comma-separated)
  --csv                    output is csv format [alias: --output=csv]
  --debug                  Print REST API call debug logs
  --filter=<value>         filter property by partial string matching, ex: name=foo
  --no-header              hide table header from output
  --no-truncate            do not truncate output to fit screen
  --output=<option>        output in a more machine friendly format
                           <options: csv|json|yaml>
  --sort=<value>           property to sort by (prepend '-' for descending)
  --token=<value>          Ignore the saved configuration and use this token

DESCRIPTION
  Show Alerts in PagerDuty Incidents
```

## `pd incident analytics`

Get Incident analytics

```
USAGE
  $ pd incident analytics

FLAGS
  -b, --useauth=<value>    Use the saved REST API token with this alias
  -d, --delimiter=<value>  [default: \n] Delimiter for fields that have more than one value
  -h, --help               Show CLI help.
  -i, --ids=<value>...     Incident ID's to look at. Specify multiple times for multiple incidents.
  -j, --json               output full details as JSON
  -k, --keys=<value>...    Additional fields to display. Specify multiple times for multiple fields.
  -p, --pipe               Read incident ID's from stdin.
  -x, --extended           show extra columns
  --columns=<value>        only show provided columns (comma-separated)
  --csv                    output is csv format [alias: --output=csv]
  --debug                  Print REST API call debug logs
  --filter=<value>         filter property by partial string matching, ex: name=foo
  --no-header              hide table header from output
  --no-truncate            do not truncate output to fit screen
  --output=<option>        output in a more machine friendly format
                           <options: csv|json|yaml>
  --sort=<value>           property to sort by (prepend '-' for descending)
  --token=<value>          Ignore the saved configuration and use this token

DESCRIPTION
  Get Incident analytics
```

## `pd incident assign`

Assign/Reassign PagerDuty Incidents

```
USAGE
  $ pd incident assign

FLAGS
  -E, --assign_to_ep_name=<value>         Escalation policy name to assign incidents to.
  -F, --from=<value>                      Login email of a PD user account for the "From:" header. Use only with legacy
                                          API tokens.
  -U, --assign_to_user_emails=<value>...  User emails to assign incidents to. Specify multiple times for multiple
                                          assignees.
  -b, --useauth=<value>                   Use the saved REST API token with this alias
  -e, --assign_to_ep_id=<value>           Escalation policy ID to assign incidents to.
  -h, --help                              Show CLI help.
  -i, --ids=<value>...                    Incident ID's to assign. Specify multiple times for multiple incidents.
  -m, --me                                Reassign all incidents that are currently assigned to me
  -p, --pipe                              Read incident ID's from stdin.
  -u, --assign_to_user_ids=<value>...     User ID's to assign incidents to. Specify multiple times for multiple
                                          assignees.
  --debug                                 Print REST API call debug logs
  --token=<value>                         Ignore the saved configuration and use this token

DESCRIPTION
  Assign/Reassign PagerDuty Incidents

ALIASES
  $ pd incident reassign
```

## `pd incident create`

Create a PagerDuty Incident

```
USAGE
  $ pd incident create

FLAGS
  -E, --escalation_policy=<value>  The name of the escalation policy to assign the incident to
  -F, --from=<value>               Login email of a PD user account for the "From:" header. Use only with legacy API
                                   tokens.
  -P, --priority=<value>           Incident priority
  -S, --service=<value>            The name of the service to create the incident in
  -U, --user=<value>...            The email of a user to assign the incident to
  -b, --useauth=<value>            Use the saved REST API token with this alias
  -d, --details=<value>            Incident details
  -h, --help                       Show CLI help.
  -k, --key=<value>                Incident key
  -o, --open                       Open the new incident in the browser
  -p, --pipe                       Print the incident ID only to stdout, for use with pipes.
  -t, --title=<value>              (required) Incident title
  -u, --urgency=<option>           Incident urgency
                                   <options: high|low>
  --debug                          Print REST API call debug logs
  --escalation_policy_id=<value>   The ID of the escalation policy to assign the incident to
  --service_id=<value>             The ID of the service to create the incident in
  --token=<value>                  Ignore the saved configuration and use this token
  --user_id=<value>...             The ID of a user to assign the incident to

DESCRIPTION
  Create a PagerDuty Incident
```

## `pd incident field get`

Get Custom Field Values on PagerDuty Incidents

```
USAGE
  $ pd incident field get

FLAGS
  -b, --useauth=<value>    Use the saved REST API token with this alias
  -d, --delimiter=<value>  [default:
                           ] Delimiter for fields that have more than one value
  -h, --help               Show CLI help.
  -i, --ids=<value>...     Incident ID's to show. Specify multiple times for multiple incidents.
  -m, --me                 Show all incidents that are currently assigned to me
  -n, --display_name       Show the display names of fields rather than their canonical names.
  -p, --pipe               Read incident ID's from stdin.
  --debug                  Print REST API call debug logs
  --token=<value>          Ignore the saved configuration and use this token

DESCRIPTION
  Get Custom Field Values on PagerDuty Incidents
```

## `pd incident field set`

Set Custom Field Values on PagerDuty Incidents

```
USAGE
  $ pd incident field set

FLAGS
  -b, --useauth=<value>    Use the saved REST API token with this alias
  -h, --help               Show CLI help.
  -i, --ids=<value>...     Incident ID's to update. Specify multiple times for multiple incidents.
  -m, --me                 Update all incidents that are currently assigned to me
  -n, --names=<value>...   (required) Custom Field names to set. Specify multiple times to set multiple fields.
  -p, --pipe               Read incident ID's from stdin.
  -v, --values=<value>...  (required) Custom Field values to set. To set multiple name/values, specify multiple times in
                           the same order as the names.
  --debug                  Print REST API call debug logs
  --[no-]jsonvalues        Interpret values as JSON [default: true]
  --token=<value>          Ignore the saved configuration and use this token

DESCRIPTION
  Set Custom Field Values on PagerDuty Incidents
```

## `pd incident list`

List PagerDuty Incidents

```
USAGE
  $ pd incident list

FLAGS
  -E, --exact_assignees=<value>...  Return incidents assigned to the PD account whose login email is exactly this text.
                                    Specify multiple times for multiple assignees.
  -S, --services=<value>...         Return incidents in services whose names contain this text. Specify multiple times
                                    for multiple service filters.
  -T, --exact_teams=<value>...      Return incidents belonging to the team whose name is exactly this text. Specify
                                    multiple times for multiple teams.
  -X, --exact_services=<value>...   Return incidents in the service whose name is exactly this text. Specify multiple
                                    times for multiple services.
  -b, --useauth=<value>             Use the saved REST API token with this alias
  -d, --delimiter=<value>           [default: \n] Delimiter for fields that have more than one value
  -e, --assignees=<value>...        Return incidents assigned to PD accounts whose login emails contain this text.
                                    Specify multiple times for multiple assignee filters.
  -h, --help                        Show CLI help.
  -j, --json                        output full details as JSON
  -k, --keys=<value>...             Additional fields to display. Specify multiple times for multiple fields.
  -m, --me                          Return incidents assigned to me
  -n, --name=<value>                Select incidents whose names contain the given text
  -p, --pipe                        Print incident ID's only to stdout, for use with pipes.
  -s, --statuses=<option>...        [default: open] Return only incidents with the given statuses. Specify multiple
                                    times for multiple statuses.
                                    <options: open|closed|triggered|acknowledged|resolved>
  -t, --teams=<value>...            Return incidents belonging to teams whose names contain this text. Specify multiple
                                    times for multiple team filters.
  -u, --urgencies=<option>...       [default: high,low] Urgencies to include.
                                    <options: high|low>
  -x, --extended                    show extra columns
  --columns=<value>                 only show provided columns (comma-separated)
  --csv                             output is csv format [alias: --output=csv]
  --debug                           Print REST API call debug logs
  --filter=<value>                  filter property by partial string matching, ex: name=foo
  --limit=<value>                   Return no more than this many entries. This option turns off table filtering
                                    options.
  --no-header                       hide table header from output
  --no-truncate                     do not truncate output to fit screen
  --notes                           Also show incident notes (Uses a lot more HTTPS requests!)
  --output=<option>                 output in a more machine friendly format
                                    <options: csv|json|yaml>
  --since=<value>                   The start of the date range over which you want to search.
  --sort=<value>                    property to sort by (prepend '-' for descending)
  --token=<value>                   Ignore the saved configuration and use this token
  --until=<value>                   The end of the date range over which you want to search.

DESCRIPTION
  List PagerDuty Incidents
```

## `pd incident log`

Show PagerDuty Incident Log Entries

```
USAGE
  $ pd incident log

FLAGS
  -O, --overview           Get only `overview` log entries
  -b, --useauth=<value>    Use the saved REST API token with this alias
  -d, --delimiter=<value>  [default: \n] Delimiter for fields that have more than one value
  -h, --help               Show CLI help.
  -i, --ids=<value>...     Select incidents with the given ID. Specify multiple times for multiple incidents.
  -j, --json               output full details as JSON
  -k, --keys=<value>...    Additional fields to display. Specify multiple times for multiple fields.
  -p, --pipe               Read incident IDs from stdin, for use with pipes.
  -x, --extended           show extra columns
  --columns=<value>        only show provided columns (comma-separated)
  --csv                    output is csv format [alias: --output=csv]
  --debug                  Print REST API call debug logs
  --filter=<value>         filter property by partial string matching, ex: name=foo
  --no-header              hide table header from output
  --no-truncate            do not truncate output to fit screen
  --output=<option>        output in a more machine friendly format
                           <options: csv|json|yaml>
  --sort=<value>           property to sort by (prepend '-' for descending)
  --token=<value>          Ignore the saved configuration and use this token

DESCRIPTION
  Show PagerDuty Incident Log Entries
```

## `pd incident merge`

Merge PagerDuty Incidents

```
USAGE
  $ pd incident merge

FLAGS
  -F, --from=<value>       Login email of a PD user account for the "From:" header. Use only with legacy API tokens.
  -I, --parent_id=<value>  Use this incident ID as the parent ID.
  -b, --useauth=<value>    Use the saved REST API token with this alias
  -h, --help               Show CLI help.
  -i, --ids=<value>...     Merge incidents with the given ID. Specify multiple times for multiple incidents. If -I is
                           not given, the first incident in the list will be the parent incident.
  -o, --open               Open the merged incident in the browser
  -p, --pipe               Read incident IDs from stdin, for use with pipes. If -I is not given, the first incident ID
                           from the pipe will be the parent incident.
  --debug                  Print REST API call debug logs
  --token=<value>          Ignore the saved configuration and use this token

DESCRIPTION
  Merge PagerDuty Incidents
```

## `pd incident notes`

See or add notes on PagerDuty Incidents

```
USAGE
  $ pd incident notes

FLAGS
  -F, --from=<value>     Login email of a PD user account for the "From:" header. Use only with legacy API tokens.
  -b, --useauth=<value>  Use the saved REST API token with this alias
  -h, --help             Show CLI help.
  -i, --id=<value>       (required) Incident ID.
  -n, --note=<value>     Note to add
  -x, --extended         show extra columns
  --columns=<value>      only show provided columns (comma-separated)
  --csv                  output is csv format [alias: --output=csv]
  --debug                Print REST API call debug logs
  --filter=<value>       filter property by partial string matching, ex: name=foo
  --no-header            hide table header from output
  --no-truncate          do not truncate output to fit screen
  --output=<option>      output in a more machine friendly format
                         <options: csv|json|yaml>
  --sort=<value>         property to sort by (prepend '-' for descending)
  --token=<value>        Ignore the saved configuration and use this token

DESCRIPTION
  See or add notes on PagerDuty Incidents
```

## `pd incident open`

Open PagerDuty Incidents in your browser

```
USAGE
  $ pd incident open

FLAGS
  -b, --useauth=<value>  Use the saved REST API token with this alias
  -h, --help             Show CLI help.
  -i, --ids=<value>...   Incident ID's to open. Specify multiple times for multiple incidents.
  -m, --me               Open all incidents assigned to me
  -p, --pipe             Read incident ID's from stdin.
  --debug                Print REST API call debug logs
  --token=<value>        Ignore the saved configuration and use this token

DESCRIPTION
  Open PagerDuty Incidents in your browser
```

## `pd incident priority`

Set priority on PagerDuty Incidents

```
USAGE
  $ pd incident priority

FLAGS
  -F, --from=<value>      Login email of a PD user account for the "From:" header. Use only with legacy API tokens.
  -b, --useauth=<value>   Use the saved REST API token with this alias
  -h, --help              Show CLI help.
  -i, --ids=<value>...    Incident ID's to set priority on. Specify multiple times for multiple incidents.
  -m, --me                Set priority on all incidents assigned to me
  -n, --priority=<value>  (required) The name of the priority to set.
  -p, --pipe              Read incident ID's from stdin.
  --debug                 Print REST API call debug logs
  --token=<value>         Ignore the saved configuration and use this token

DESCRIPTION
  Set priority on PagerDuty Incidents
```

## `pd incident assign`

Assign/Reassign PagerDuty Incidents

```
USAGE
  $ pd incident assign

FLAGS
  -E, --assign_to_ep_name=<value>         Escalation policy name to assign incidents to.
  -F, --from=<value>                      Login email of a PD user account for the "From:" header. Use only with legacy
                                          API tokens.
  -U, --assign_to_user_emails=<value>...  User emails to assign incidents to. Specify multiple times for multiple
                                          assignees.
  -b, --useauth=<value>                   Use the saved REST API token with this alias
  -e, --assign_to_ep_id=<value>           Escalation policy ID to assign incidents to.
  -h, --help                              Show CLI help.
  -i, --ids=<value>...                    Incident ID's to assign. Specify multiple times for multiple incidents.
  -m, --me                                Reassign all incidents that are currently assigned to me
  -p, --pipe                              Read incident ID's from stdin.
  -u, --assign_to_user_ids=<value>...     User ID's to assign incidents to. Specify multiple times for multiple
                                          assignees.
  --debug                                 Print REST API call debug logs
  --token=<value>                         Ignore the saved configuration and use this token

DESCRIPTION
  Assign/Reassign PagerDuty Incidents

ALIASES
  $ pd incident reassign
```

## `pd incident rename`

Rename (change the title of) PagerDuty Incidents

```
USAGE
  $ pd incident rename

FLAGS
  -F, --from=<value>     Login email of a PD user account for the "From:" header. Use only with legacy API tokens.
  -b, --useauth=<value>  Use the saved REST API token with this alias
  -h, --help             Show CLI help.
  -i, --ids=<value>...   Incident ID's to rename. Specify multiple times for multiple incidents.
  -m, --me               Rename all incidents that are currently assigned to me
  -p, --pipe             Read incident ID's from stdin.
  -t, --title=<value>    Set the incident title to this string
  --debug                Print REST API call debug logs
  --prefix=<value>       Prefix the incident title with this string
  --token=<value>        Ignore the saved configuration and use this token

DESCRIPTION
  Rename (change the title of) PagerDuty Incidents
```

## `pd incident resolve`

Resolve PagerDuty Incidents

```
USAGE
  $ pd incident resolve

FLAGS
  -F, --from=<value>     Login email of a PD user account for the "From:" header. Use only with legacy API tokens.
  -b, --useauth=<value>  Use the saved REST API token with this alias
  -h, --help             Show CLI help.
  -i, --ids=<value>...   Incident ID's to resolve. Specify multiple times for multiple incidents.
  -m, --me               Resolve all incidents assigned to me
  -p, --pipe             Read incident ID's from stdin.
  --debug                Print REST API call debug logs
  --token=<value>        Ignore the saved configuration and use this token

DESCRIPTION
  Resolve PagerDuty Incidents
```

## `pd incident responder add`

Add Responders to PagerDuty Incidents

```
USAGE
  $ pd incident responder add

FLAGS
  -E, --ep_names=<value>...     Escalation policy names to add as responders. Specify multiple times for multiple EPs
  -F, --from=<value>            Login email of a PD user account for the "From:" header. Use only with legacy API
                                tokens.
  -U, --user_emails=<value>...  User emails to add as responders. Specify multiple times for multiple users.
  -b, --useauth=<value>         Use the saved REST API token with this alias
  -e, --ep_ids=<value>...       Escalation policy IDs to add as responders. Specify multiple times for multiple EPs
  -h, --help                    Show CLI help.
  -i, --ids=<value>...          Incident ID's to add responders to. Specify multiple times for multiple incidents.
  -m, --me                      Add responders to all incidents that are currently assigned to me
  -p, --pipe                    Read incident ID's from stdin.
  -s, --message=<value>         A custom message to send to the responders
  -u, --user_ids=<value>...     User ID's to add as responders. Specify multiple times for multiple users.
  --debug                       Print REST API call debug logs
  --token=<value>               Ignore the saved configuration and use this token

DESCRIPTION
  Add Responders to PagerDuty Incidents
```

## `pd incident responder list`

List Responders on PagerDuty Incidents

```
USAGE
  $ pd incident responder list

FLAGS
  -b, --useauth=<value>  Use the saved REST API token with this alias
  -h, --help             Show CLI help.
  -i, --ids=<value>...   Incident ID's to list responders on. Specify multiple times for multiple incidents.
  -m, --me               List responders on all incidents that are currently assigned to me
  -p, --pipe             Read incident ID's from stdin.
  -x, --extended         show extra columns
  --columns=<value>      only show provided columns (comma-separated)
  --csv                  output is csv format [alias: --output=csv]
  --debug                Print REST API call debug logs
  --filter=<value>       filter property by partial string matching, ex: name=foo
  --no-header            hide table header from output
  --no-truncate          do not truncate output to fit screen
  --output=<option>      output in a more machine friendly format
                         <options: csv|json|yaml>
  --sort=<value>         property to sort by (prepend '-' for descending)
  --token=<value>        Ignore the saved configuration and use this token

DESCRIPTION
  List Responders on PagerDuty Incidents
```

## `pd incident set`

Update PagerDuty Incidents

```
USAGE
  $ pd incident set

FLAGS
  -F, --from=<value>     Login email of a PD user account for the "From:" header. Use only with legacy API tokens.
  -b, --useauth=<value>  Use the saved REST API token with this alias
  -h, --help             Show CLI help.
  -i, --ids=<value>...   Incident ID's to update. Specify multiple times for multiple incidents.
  -k, --key=<value>      (required) Attribute key to set
  -m, --me               Update all incidents that are currently assigned to me
  -p, --pipe             Read incident ID's from stdin.
  -v, --value=<value>    (required) Attribute value to set
  --debug                Print REST API call debug logs
  --token=<value>        Ignore the saved configuration and use this token

DESCRIPTION
  Update PagerDuty Incidents

ALIASES
  $ pd incident update
```

## `pd incident subscriber add`

Add Subscribers to PagerDuty Incidents

```
USAGE
  $ pd incident subscriber add

FLAGS
  -T, --team_names=<value>...   Team names to add as subscribers. Specify multiple times for multiple teams
  -U, --user_emails=<value>...  User emails to add as subscribers. Specify multiple times for multiple users.
  -b, --useauth=<value>         Use the saved REST API token with this alias
  -h, --help                    Show CLI help.
  -i, --ids=<value>...          Incident ID's to add subscribers to. Specify multiple times for multiple incidents.
  -m, --me                      Add subscribers to all incidents that are currently assigned to me
  -p, --pipe                    Read incident ID's from stdin.
  -t, --team_ids=<value>...     Team IDs to add as subscribers. Specify multiple times for multiple teams
  -u, --user_ids=<value>...     User ID's to add as subscribers. Specify multiple times for multiple users.
  --debug                       Print REST API call debug logs
  --token=<value>               Ignore the saved configuration and use this token

DESCRIPTION
  Add Subscribers to PagerDuty Incidents
```

## `pd incident subscriber list`

List Responders on PagerDuty Incidents

```
USAGE
  $ pd incident subscriber list

FLAGS
  -b, --useauth=<value>  Use the saved REST API token with this alias
  -h, --help             Show CLI help.
  -i, --ids=<value>...   Incident ID's to list subscribers on. Specify multiple times for multiple incidents.
  -m, --me               List subscribers on all incidents that are currently assigned to me
  -p, --pipe             Read incident ID's from stdin.
  -x, --extended         show extra columns
  --columns=<value>      only show provided columns (comma-separated)
  --csv                  output is csv format [alias: --output=csv]
  --debug                Print REST API call debug logs
  --filter=<value>       filter property by partial string matching, ex: name=foo
  --no-header            hide table header from output
  --no-truncate          do not truncate output to fit screen
  --output=<option>      output in a more machine friendly format
                         <options: csv|json|yaml>
  --sort=<value>         property to sort by (prepend '-' for descending)
  --token=<value>        Ignore the saved configuration and use this token

DESCRIPTION
  List Responders on PagerDuty Incidents
```

## `pd incident subscriber remove`

Remove Subscribers from PagerDuty Incidents

```
USAGE
  $ pd incident subscriber remove

FLAGS
  -T, --team_names=<value>...   Team names to remove. Specify multiple times for multiple teams
  -U, --user_emails=<value>...  User emails to remove. Specify multiple times for multiple users.
  -b, --useauth=<value>         Use the saved REST API token with this alias
  -h, --help                    Show CLI help.
  -i, --ids=<value>...          Incident ID's to remove subscribers from. Specify multiple times for multiple incidents.
  -m, --me                      Remove subscribers from all incidents that are currently assigned to me
  -p, --pipe                    Read incident ID's from stdin.
  -t, --team_ids=<value>...     Team IDs to remove. Specify multiple times for multiple teams
  -u, --user_ids=<value>...     User ID's to remove. Specify multiple times for multiple users.
  --debug                       Print REST API call debug logs
  --token=<value>               Ignore the saved configuration and use this token

DESCRIPTION
  Remove Subscribers from PagerDuty Incidents
```

## `pd incident subscriber update`

Send a status update to PagerDuty Incident Subscribers

```
USAGE
  $ pd incident subscriber update

FLAGS
  -F, --from=<value>      Login email of a PD user account for the "From:" header. Use only with legacy API tokens.
  -b, --useauth=<value>   Use the saved REST API token with this alias
  -h, --help              Show CLI help.
  -i, --ids=<value>...    Send a status update to subscribers on these Incident ID's. Specify multiple times for
                          multiple incidents.
  -m, --me                Send a status update to subscribers on all incidents that are currently assigned to me
  -p, --pipe              Read incident ID's from stdin.
  --debug                 Print REST API call debug logs
  --html_message=<value>  The html content to be sent for the custom html email status update. Required if sending
                          custom html email.
  --message=<value>       (required) The message to be posted as a status update.
  --subject=<value>       The subject to be sent for the custom html email status update. Required if sending custom
                          html email.
  --token=<value>         Ignore the saved configuration and use this token

DESCRIPTION
  Send a status update to PagerDuty Incident Subscribers
```

## `pd incident set`

Update PagerDuty Incidents

```
USAGE
  $ pd incident set

FLAGS
  -F, --from=<value>     Login email of a PD user account for the "From:" header. Use only with legacy API tokens.
  -b, --useauth=<value>  Use the saved REST API token with this alias
  -h, --help             Show CLI help.
  -i, --ids=<value>...   Incident ID's to update. Specify multiple times for multiple incidents.
  -k, --key=<value>      (required) Attribute key to set
  -m, --me               Update all incidents that are currently assigned to me
  -p, --pipe             Read incident ID's from stdin.
  -v, --value=<value>    (required) Attribute value to set
  --debug                Print REST API call debug logs
  --token=<value>        Ignore the saved configuration and use this token

DESCRIPTION
  Update PagerDuty Incidents

ALIASES
  $ pd incident update
```

## `pd log`

Show PagerDuty Domain Log Entries

```
USAGE
  $ pd log

FLAGS
  -O, --overview           Get only `overview` log entries
  -b, --useauth=<value>    Use the saved REST API token with this alias
  -d, --delimiter=<value>  [default: \n] Delimiter for fields that have more than one value
  -h, --help               Show CLI help.
  -j, --json               output full details as JSON
  -k, --keys=<value>...    Additional fields to display. Specify multiple times for multiple fields.
  -x, --extended           show extra columns
  --columns=<value>        only show provided columns (comma-separated)
  --csv                    output is csv format [alias: --output=csv]
  --debug                  Print REST API call debug logs
  --filter=<value>         filter property by partial string matching, ex: name=foo
  --no-header              hide table header from output
  --no-truncate            do not truncate output to fit screen
  --output=<option>        output in a more machine friendly format
                           <options: csv|json|yaml>
  --since=<value>          [default: 30 days ago] The start of the date range over which you want to search.
  --sort=<value>           property to sort by (prepend '-' for descending)
  --token=<value>          Ignore the saved configuration and use this token
  --until=<value>          The end of the date range over which you want to search.

DESCRIPTION
  Show PagerDuty Domain Log Entries
```

_See code: [src/commands/log.ts](https://github.com/martindstone/pagerduty-cli/blob/v0.1.13/src/commands/log.ts)_

## `pd auth web`

Authenticate with PagerDuty in the browser

```
USAGE
  $ pd auth web

FLAGS
  -a, --alias=<value>  The alias to use for this token. Defaults to the name of the PD subdomain
  -d, --[no-]default   Use this token as the default for all PD commands
  -h, --help           Show CLI help.
  --debug              Print REST API call debug logs

DESCRIPTION
  Authenticate with PagerDuty in the browser

ALIASES
  $ pd login
```

## `pd orchestration add`

Add a PagerDuty Event Orchestration

```
USAGE
  $ pd orchestration add

FLAGS
  -T, --team_name=<value>    The name of the team that owns this orchestration. If none is specified, only admins have
                             access.
  -b, --useauth=<value>      Use the saved REST API token with this alias
  -d, --description=<value>  The description of the orchestration to add
  -h, --help                 Show CLI help.
  -n, --name=<value>         The name of the orchestration to add
  -t, --team_id=<value>      The ID of the team that owns this orchestration. If none is specified, only admins have
                             access.
  --debug                    Print REST API call debug logs
  --token=<value>            Ignore the saved configuration and use this token

DESCRIPTION
  Add a PagerDuty Event Orchestration
```

## `pd orchestration list`

List PagerDuty Event Orchestrations

```
USAGE
  $ pd orchestration list

FLAGS
  -b, --useauth=<value>    Use the saved REST API token with this alias
  -d, --delimiter=<value>  [default: \n] Delimiter for fields that have more than one value
  -h, --help               Show CLI help.
  -j, --json               output full details as JSON
  -k, --keys=<value>...    Additional fields to display. Specify multiple times for multiple fields.
  -p, --pipe               Print orchestration ID's only to stdout, for use with pipes.
  -x, --extended           show extra columns
  --columns=<value>        only show provided columns (comma-separated)
  --csv                    output is csv format [alias: --output=csv]
  --debug                  Print REST API call debug logs
  --filter=<value>         filter property by partial string matching, ex: name=foo
  --no-header              hide table header from output
  --no-truncate            do not truncate output to fit screen
  --output=<option>        output in a more machine friendly format
                           <options: csv|json|yaml>
  --sort=<value>           property to sort by (prepend '-' for descending)
  --token=<value>          Ignore the saved configuration and use this token

DESCRIPTION
  List PagerDuty Event Orchestrations
```

## `pd orchestration route add`

Add a Route to a PagerDuty Event Orchestration

```
USAGE
  $ pd orchestration route add

FLAGS
  -S, --service_name=<value>   The name of a PagerDuty service to route to
  -b, --useauth=<value>        Use the saved REST API token with this alias
  -c, --conditions=<value>...  The conditions that must be true for the route action to occur
  -d, --description=<value>    A human-readable description of what the route does
  -h, --help                   Show CLI help.
  -i, --id=<value>             (required) The ID of the orchestration to add a route to
  -s, --service_id=<value>     The ID of a PagerDuty service to route to
  --debug                      Print REST API call debug logs
  --token=<value>              Ignore the saved configuration and use this token

DESCRIPTION
  Add a Route to a PagerDuty Event Orchestration
```

## `pd orchestration route delete`

Delete a Route from a PagerDuty Event Orchestration

```
USAGE
  $ pd orchestration route delete

FLAGS
  -S, --service_names=<value>...  Delete routes that route to the PagerDuty service with this name. Specify multiple
                                  times to delete multiple routes.
  -b, --useauth=<value>           Use the saved REST API token with this alias
  -h, --help                      Show CLI help.
  -i, --id=<value>                (required) The ID of the orchestration to delete a route from
  -r, --route_ids=<value>...      The ID of the route to delete. Specify multiple times to delete multiple routes.
  -s, --service_ids=<value>...    Delete routes that route to the PagerDuty service with this ID. Specify multiple times
                                  to delete multiple routes.
  --debug                         Print REST API call debug logs
  --token=<value>                 Ignore the saved configuration and use this token

DESCRIPTION
  Delete a Route from a PagerDuty Event Orchestration
```

## `pd orchestration route list`

List PagerDuty Event Orchestration Routes

```
USAGE
  $ pd orchestration route list

FLAGS
  -b, --useauth=<value>    Use the saved REST API token with this alias
  -d, --delimiter=<value>  [default: \n] Delimiter for fields that have more than one value
  -h, --help               Show CLI help.
  -i, --id=<value>         (required) The ID of the orchestration whose routes to list
  -j, --json               output full details as JSON
  -k, --keys=<value>...    Additional fields to display. Specify multiple times for multiple fields.
  -p, --pipe               Print orchestration ID's only to stdout, for use with pipes.
  -x, --extended           show extra columns
  --columns=<value>        only show provided columns (comma-separated)
  --csv                    output is csv format [alias: --output=csv]
  --debug                  Print REST API call debug logs
  --filter=<value>         filter property by partial string matching, ex: name=foo
  --no-header              hide table header from output
  --no-truncate            do not truncate output to fit screen
  --output=<option>        output in a more machine friendly format
                           <options: csv|json|yaml>
  --sort=<value>           property to sort by (prepend '-' for descending)
  --token=<value>          Ignore the saved configuration and use this token

DESCRIPTION
  List PagerDuty Event Orchestration Routes
```

## `pd rest delete`

Make a DELETE request to PagerDuty

```
USAGE
  $ pd rest delete

FLAGS
  -H, --headers=<value>...  [default: ] Headers to add, for example, `From=martin@pagerduty.com`. Specify multiple times
                            for multiple headers.
  -P, --params=<value>...   [default: ] Parameters to add, for example, `query=martin` or `include[]=teams`. Specify
                            multiple times for multiple params.
  -b, --useauth=<value>     Use the saved REST API token with this alias
  -e, --endpoint=<value>    (required) The path to the endpoint, for example, `/users/PXXXXXX` or `/services`
  -h, --help                Show CLI help.
  --debug                   Print REST API call debug logs
  --token=<value>           Ignore the saved configuration and use this token

DESCRIPTION
  Make a DELETE request to PagerDuty
```

## `pd rest fetch`

Fetch objects from PagerDuty

```
USAGE
  $ pd rest fetch

FLAGS
  -H, --headers=<value>...  [default: ] Headers to add, for example, `From=martin@pagerduty.com`. Specify multiple times
                            for multiple headers.
  -P, --params=<value>...   [default: ] Parameters to add, for example, `query=martin` or `include[]=teams. Specify
                            multiple times for multiple params.
  -b, --useauth=<value>     Use the saved REST API token with this alias
  -d, --delimiter=<value>   [default: \n] Delimiter for fields that have more than one value, for use with `--table`.
  -e, --endpoint=<value>    (required) The path to the endpoint, for example, `users` or `services`
  -h, --help                Show CLI help.
  -k, --keys=<value>...     Additional fields to display, for use with `--table`. Specify multiple times for multiple
                            fields.
  -p, --pipe                Print object ID's only to stdout, for use with pipes.
  -t, --table               Output in table format instead of JSON
  -x, --extended            show extra columns
  --columns=<value>         only show provided columns (comma-separated)
  --csv                     output is csv format [alias: --output=csv]
  --debug                   Print REST API call debug logs
  --filter=<value>          filter property by partial string matching, ex: name=foo
  --limit=<value>           Return no more than this many entries. This option turns off table filtering options.
  --no-header               hide table header from output
  --no-truncate             do not truncate output to fit screen
  --output=<option>         output in a more machine friendly format
                            <options: csv|json|yaml>
  --sort=<value>            property to sort by (prepend '-' for descending)
  --token=<value>           Ignore the saved configuration and use this token

DESCRIPTION
  Fetch objects from PagerDuty
```

## `pd rest get`

Make a GET request to PagerDuty

```
USAGE
  $ pd rest get

FLAGS
  -H, --headers=<value>...  [default: ] Headers to add, for example, `From=martin@pagerduty.com`. Specify multiple times
                            for multiple headers.
  -P, --params=<value>...   [default: ] Parameters to add, for example, `query=martin` or `include[]=teams`. Specify
                            multiple times for multiple params.
  -b, --useauth=<value>     Use the saved REST API token with this alias
  -e, --endpoint=<value>    (required) The path to the endpoint, for example, `/users/PXXXXXX` or `/services`
  -h, --help                Show CLI help.
  --debug                   Print REST API call debug logs
  --token=<value>           Ignore the saved configuration and use this token

DESCRIPTION
  Make a GET request to PagerDuty
```

## `pd rest post`

Make a POST request to PagerDuty

```
USAGE
  $ pd rest post

FLAGS
  -H, --headers=<value>...  [default: ] Headers to add, for example, `From=martin@pagerduty.com`. Specify multiple times
                            for multiple headers.
  -P, --params=<value>...   [default: ] Parameters to add, for example, `query=martin` or `include[]=teams. Specify
                            multiple times for multiple params.
  -b, --useauth=<value>     Use the saved REST API token with this alias
  -d, --data=<value>        (required) JSON data to send
  -e, --endpoint=<value>    (required) The path to the endpoint, for example, `/users/PXXXXXX` or `/services`
  -h, --help                Show CLI help.
  --debug                   Print REST API call debug logs
  --token=<value>           Ignore the saved configuration and use this token

DESCRIPTION
  Make a POST request to PagerDuty
```

## `pd rest put`

Make a PUT request to PagerDuty

```
USAGE
  $ pd rest put

FLAGS
  -H, --headers=<value>...  [default: ] Headers to add, for example, `From=martin@pagerduty.com`. Specify multiple times
                            for multiple headers.
  -P, --params=<value>...   [default: ] Parameters to add, for example, `query=martin` or `include[]=teams. Specify
                            multiple times for multiple params.
  -b, --useauth=<value>     Use the saved REST API token with this alias
  -d, --data=<value>        (required) JSON data to send
  -e, --endpoint=<value>    (required) The path to the endpoint, for example, `/users/PXXXXXX` or `/services`
  -h, --help                Show CLI help.
  --debug                   Print REST API call debug logs
  --token=<value>           Ignore the saved configuration and use this token

DESCRIPTION
  Make a PUT request to PagerDuty
```

## `pd schedule copy`

Make a copy of a PagerDuty Schedule

```
USAGE
  $ pd schedule copy

FLAGS
  -b, --useauth=<value>      Use the saved REST API token with this alias
  -d, --destination=<value>  The name for the new schedule
  -h, --help                 Show CLI help.
  -i, --id=<value>           The ID of the schedule to copy.
  -n, --name=<value>         The name of the schedule to copy.
  -o, --open                 Open the new schedule in the browser
  -p, --pipe                 Print the new schedule ID only to stdout, for use with pipes.
  --debug                    Print REST API call debug logs
  --token=<value>            Ignore the saved configuration and use this token

DESCRIPTION
  Make a copy of a PagerDuty Schedule
```

## `pd schedule create`

Create a PagerDuty Schedule

```
USAGE
  $ pd schedule create

FLAGS
  -b, --useauth=<value>             Use the saved REST API token with this alias
  -d, --description=<value>         The description of the schedule to create
  -h, --help                        Show CLI help.
  -l, --turn_length=<value>         [default: 1 day] The rotation turn length of the first layer of the schedule
  -n, --name=<value>                (required) The name of the schedule to create.
  -o, --open                        Open the new schedule in the browser
  -p, --pipe                        Print the new schedule ID only to stdout, for use with pipes.
  -s, --start=<value>               [default: now] The start time of the first layer of the schedule
  -t, --handoff_time=<value>        [default: 09:00] The handoff time of the first layer of the schedule (in the time
                                    zone specified by -z)
  -u, --users=<value>...            (required) The IDs of users to include in the first layer of the schedule. Specify
                                    multiple times, in order, for multiple users.
  -z, --timezone=<value>            [default: UTC] The time zone of the schedule
  --debug                           Print REST API call debug logs
  --rotation_virtual_start=<value>  The effective start time of the first layer. This can be before the start time of
                                    the schedule.
  --token=<value>                   Ignore the saved configuration and use this token

DESCRIPTION
  Create a PagerDuty Schedule
```

## `pd schedule list`

List PagerDuty Schedules

```
USAGE
  $ pd schedule list

FLAGS
  -b, --useauth=<value>    Use the saved REST API token with this alias
  -d, --delimiter=<value>  [default: \n] Delimiter for fields that have more than one value
  -h, --help               Show CLI help.
  -j, --json               output full details as JSON
  -k, --keys=<value>...    Additional fields to display. Specify multiple times for multiple fields.
  -n, --name=<value>       Select schedules whose names contain the given text
  -p, --pipe               Print schedule ID's only to stdout, for use with pipes.
  -x, --extended           show extra columns
  --columns=<value>        only show provided columns (comma-separated)
  --csv                    output is csv format [alias: --output=csv]
  --debug                  Print REST API call debug logs
  --filter=<value>         filter property by partial string matching, ex: name=foo
  --limit=<value>          Return no more than this many entries. This option turns off table filtering options.
  --no-header              hide table header from output
  --no-truncate            do not truncate output to fit screen
  --output=<option>        output in a more machine friendly format
                           <options: csv|json|yaml>
  --sort=<value>           property to sort by (prepend '-' for descending)
  --token=<value>          Ignore the saved configuration and use this token

DESCRIPTION
  List PagerDuty Schedules
```

## `pd schedule listdeletedusers`

List deleted users in all PagerDuty Schedules

```
USAGE
  $ pd schedule listdeletedusers

FLAGS
  -b, --useauth=<value>  Use the saved REST API token with this alias
  -h, --help             Show CLI help.
  -x, --extended         show extra columns
  --columns=<value>      only show provided columns (comma-separated)
  --csv                  output is csv format [alias: --output=csv]
  --debug                Print REST API call debug logs
  --filter=<value>       filter property by partial string matching, ex: name=foo
  --no-header            hide table header from output
  --no-truncate          do not truncate output to fit screen
  --output=<option>      output in a more machine friendly format
                         <options: csv|json|yaml>
  --sort=<value>         property to sort by (prepend '-' for descending)
  --token=<value>        Ignore the saved configuration and use this token

DESCRIPTION
  List deleted users in all PagerDuty Schedules
```

## `pd schedule oncall`

List a PagerDuty Schedule's on call shifts.

```
USAGE
  $ pd schedule oncall

FLAGS
  -b, --useauth=<value>    Use the saved REST API token with this alias
  -d, --delimiter=<value>  [default: \n] Delimiter for fields that have more than one value
  -h, --help               Show CLI help.
  -i, --id=<value>         Show oncalls for the schedule with this ID.
  -j, --json               output full details as JSON
  -k, --keys=<value>...    Additional fields to display. Specify multiple times for multiple fields.
  -n, --name=<value>       Show oncalls for the schedule with this name.
  -x, --extended           show extra columns
  --columns=<value>        only show provided columns (comma-separated)
  --csv                    output is csv format [alias: --output=csv]
  --debug                  Print REST API call debug logs
  --filter=<value>         filter property by partial string matching, ex: name=foo
  --no-header              hide table header from output
  --no-truncate            do not truncate output to fit screen
  --output=<option>        output in a more machine friendly format
                           <options: csv|json|yaml>
  --since=<value>          The start of the date range over which you want to search.
  --sort=<value>           property to sort by (prepend '-' for descending)
  --token=<value>          Ignore the saved configuration and use this token
  --until=<value>          The end of the date range over which you want to search.

DESCRIPTION
  List a PagerDuty Schedule's on call shifts.
```

## `pd schedule open`

Open PagerDuty Schedules in the browser

```
USAGE
  $ pd schedule open

FLAGS
  -b, --useauth=<value>  Use the saved REST API token with this alias
  -h, --help             Show CLI help.
  -i, --ids=<value>...   The IDs of schedules to open.
  -n, --name=<value>     Open schedules matching this string.
  -p, --pipe             Read schedule ID's from stdin.
  --debug                Print REST API call debug logs
  --token=<value>        Ignore the saved configuration and use this token

DESCRIPTION
  Open PagerDuty Schedules in the browser
```

## `pd schedule override add`

Add an override to a PagerDuty schedule.

```
USAGE
  $ pd schedule override add

FLAGS
  -U, --user_email=<value>  The email of the PagerDuty user for the override
  -b, --useauth=<value>     Use the saved REST API token with this alias
  -h, --help                Show CLI help.
  -i, --id=<value>          Add an override to the schedule with this ID.
  -n, --name=<value>        Add an override to the schedule with this name.
  -u, --user_id=<value>     The ID of the PagerDuty user for the override
  --debug                   Print REST API call debug logs
  --end=<value>             [default: in 1 day] The end time for the override.
  --start=<value>           [default: now] The start time for the override.
  --token=<value>           Ignore the saved configuration and use this token

DESCRIPTION
  Add an override to a PagerDuty schedule.
```

## `pd schedule override list`

List a PagerDuty Schedule's overrides.

```
USAGE
  $ pd schedule override list

FLAGS
  -b, --useauth=<value>    Use the saved REST API token with this alias
  -d, --delimiter=<value>  [default: \n] Delimiter for fields that have more than one value
  -h, --help               Show CLI help.
  -i, --id=<value>         Show overrides for the schedule with this ID.
  -j, --json               output full details as JSON
  -k, --keys=<value>...    Additional fields to display. Specify multiple times for multiple fields.
  -n, --name=<value>       Show overrides for the schedule with this name.
  -p, --pipe               Print override ID's only to stdout, for use with pipes.
  -x, --extended           show extra columns
  --columns=<value>        only show provided columns (comma-separated)
  --csv                    output is csv format [alias: --output=csv]
  --debug                  Print REST API call debug logs
  --filter=<value>         filter property by partial string matching, ex: name=foo
  --no-header              hide table header from output
  --no-truncate            do not truncate output to fit screen
  --output=<option>        output in a more machine friendly format
                           <options: csv|json|yaml>
  --since=<value>          [default: now] The start of the date range over which you want to search.
  --sort=<value>           property to sort by (prepend '-' for descending)
  --token=<value>          Ignore the saved configuration and use this token
  --until=<value>          [default: in 30 days] The end of the date range over which you want to search.

DESCRIPTION
  List a PagerDuty Schedule's overrides.
```

## `pd schedule render`

Render a PagerDuty Schedule

```
USAGE
  $ pd schedule render

FLAGS
  -b, --useauth=<value>    Use the saved REST API token with this alias
  -d, --delimiter=<value>  [default: \n] Delimiter for fields that have more than one value
  -h, --help               Show CLI help.
  -i, --id=<value>         Render the schedule with this ID.
  -j, --json               output full details as JSON
  -k, --keys=<value>...    Additional fields to display. Specify multiple times for multiple fields.
  -n, --name=<value>       Render the schedule with this name.
  -x, --extended           show extra columns
  --columns=<value>        only show provided columns (comma-separated)
  --csv                    output is csv format [alias: --output=csv]
  --debug                  Print REST API call debug logs
  --filter=<value>         filter property by partial string matching, ex: name=foo
  --no-header              hide table header from output
  --no-truncate            do not truncate output to fit screen
  --output=<option>        output in a more machine friendly format
                           <options: csv|json|yaml>
  --since=<value>          The start of the date range over which you want to search.
  --sort=<value>           property to sort by (prepend '-' for descending)
  --token=<value>          Ignore the saved configuration and use this token
  --until=<value>          The end of the date range over which you want to search.

DESCRIPTION
  Render a PagerDuty Schedule
```

## `pd schedule show`

Show a PagerDuty Schedule

```
USAGE
  $ pd schedule show

FLAGS
  -b, --useauth=<value>  Use the saved REST API token with this alias
  -h, --help             Show CLI help.
  -i, --id=<value>       Show the schedule with this ID.
  -j, --json             output full details as JSON
  -n, --name=<value>     Show the schedule with this name.
  -x, --extended         show extra columns
  --columns=<value>      only show provided columns (comma-separated)
  --csv                  output is csv format [alias: --output=csv]
  --debug                Print REST API call debug logs
  --filter=<value>       filter property by partial string matching, ex: name=foo
  --no-header            hide table header from output
  --no-truncate          do not truncate output to fit screen
  --output=<option>      output in a more machine friendly format
                         <options: csv|json|yaml>
  --since=<value>        The start of the date range over which you want to search.
  --sort=<value>         property to sort by (prepend '-' for descending)
  --token=<value>        Ignore the saved configuration and use this token
  --until=<value>        The end of the date range over which you want to search.

DESCRIPTION
  Show a PagerDuty Schedule
```

## `pd service create`

Create a PagerDuty Service

```
USAGE
  $ pd service create

FLAGS
  -E, --escalation_policy_name=<value>  The name of the service's escalation policy.
  -F, --from=<value>                    Login email of a PD user account for the "From:" header. Use only with legacy
                                        API tokens.
  -b, --useauth=<value>                 Use the saved REST API token with this alias
  -d, --description=<value>             The service's description
  -e, --escalation_policy_id=<value>    The ID of the service's escalation policy.
  -h, --help                            Show CLI help.
  -n, --name=<value>                    (required) The service's name
  -o, --open                            Open the new service in the browser
  -p, --pipe                            Print the service ID only to stdout, for use with pipes.
  -r, --auto_resolve_timeout=<value>    Automatically resolve incidents after this number of minutes
  -t, --ack_timeout=<value>             Automatically re-trigger incidents after this number of minutes
  -u, --urgency=<option>                The urgency of incidents in the service
                                        <options: high|low|use_support_hours|severity_based>
  --Gc=<option>                         Do content-based alert grouping. Specify the fields to look at with --Gf and
                                        choose 'any' or 'all' fields.
                                        <options: any|all>
  --Gd=<value>                          Do time based alert grouping for this number of minutes.
  --Gf=<value>...                       The fields to look at for content based alert grouping. Specify multiple times
                                        for multiple fields.
  --Gi                                  Do intelligent alert grouping
  --Sd=<value>...                       A day when support hours are active. Specify multiple times for multiple days.
  --Se=<value>                          The time of day when support hours end
  --Ss=<value>                          The time of day when support hours start
  --Uc                                  Change unacknowledged incidents to high urgency when entering high-urgency
                                        support hours
  --Ud=<option>                         Incident urgency during support hours.
                                        <options: high|low|severity_based>
  --Uo=<option>                         Incident urgency outside of support hours.
                                        <options: high|low|severity_based>
  --create_alerts                       Turn on alert support in the service (default: true)
  --debug                               Print REST API call debug logs
  --token=<value>                       Ignore the saved configuration and use this token

DESCRIPTION
  Create a PagerDuty Service
```

## `pd service disable`

Disable PagerDuty Services

```
USAGE
  $ pd service disable

FLAGS
  -b, --useauth=<value>  Use the saved REST API token with this alias
  -h, --help             Show CLI help.
  -i, --ids=<value>...   Select services with the given ID. Specify multiple times for multiple services.
  -n, --name=<value>     Select services whose names contain the given text
  -p, --pipe             Read service ID's from stdin.
  --debug                Print REST API call debug logs
  --token=<value>        Ignore the saved configuration and use this token

DESCRIPTION
  Disable PagerDuty Services
```

## `pd service enable`

Enable PagerDuty Services

```
USAGE
  $ pd service enable

FLAGS
  -b, --useauth=<value>  Use the saved REST API token with this alias
  -h, --help             Show CLI help.
  -i, --ids=<value>...   Select services with the given ID. Specify multiple times for multiple services.
  -n, --name=<value>     Select services whose names contain the given text
  -p, --pipe             Read service ID's from stdin.
  --debug                Print REST API call debug logs
  --token=<value>        Ignore the saved configuration and use this token

DESCRIPTION
  Enable PagerDuty Services
```

## `pd service list`

List PagerDuty Services

```
USAGE
  $ pd service list

FLAGS
  -b, --useauth=<value>    Use the saved REST API token with this alias
  -d, --delimiter=<value>  [default: \n] Delimiter for fields that have more than one value
  -h, --help               Show CLI help.
  -j, --json               output full details as JSON
  -k, --keys=<value>...    Additional fields to display. Specify multiple times for multiple fields.
  -n, --name=<value>       Select services whose names contain the given text
  -p, --pipe               Print service ID's only to stdout, for use with pipes.
  -t, --teams=<value>...   Team names to include. Specify multiple times for multiple teams.
  -x, --extended           show extra columns
  --columns=<value>        only show provided columns (comma-separated)
  --csv                    output is csv format [alias: --output=csv]
  --debug                  Print REST API call debug logs
  --filter=<value>         filter property by partial string matching, ex: name=foo
  --limit=<value>          Return no more than this many entries. This option turns off table filtering options.
  --no-header              hide table header from output
  --no-truncate            do not truncate output to fit screen
  --output=<option>        output in a more machine friendly format
                           <options: csv|json|yaml>
  --sort=<value>           property to sort by (prepend '-' for descending)
  --token=<value>          Ignore the saved configuration and use this token

DESCRIPTION
  List PagerDuty Services
```

## `pd service open`

Open PagerDuty Services in the browser

```
USAGE
  $ pd service open

FLAGS
  -b, --useauth=<value>  Use the saved REST API token with this alias
  -h, --help             Show CLI help.
  -i, --ids=<value>...   The IDs of services to open.
  -n, --name=<value>     Open services matching this string.
  -p, --pipe             Read service ID's from stdin.
  --debug                Print REST API call debug logs
  --token=<value>        Ignore the saved configuration and use this token

DESCRIPTION
  Open PagerDuty Services in the browser
```

## `pd service set`

Set PagerDuty Service attributes

```
USAGE
  $ pd service set

FLAGS
  -N, --exact_names=<value>...  Select a service whose name is this exact text. Specify multiple times for multiple
                                services.
  -b, --useauth=<value>         Use the saved REST API token with this alias
  -h, --help                    Show CLI help.
  -i, --ids=<value>...          Select services with the given ID. Specify multiple times for multiple services.
  -k, --keys=<value>...         (required) Attribute keys to set. Specify multiple times to set multiple keys.
  -n, --names=<value>...        Select services whose names contain the given text. Specify multiple times for multiple
                                names.
  -p, --pipe                    Read service ID's from stdin.
  -v, --values=<value>...       (required) Attribute values to set. To set multiple key/values, specify multiple times
                                in the same order as the keys.
  --debug                       Print REST API call debug logs
  --[no-]jsonvalues             Interpret values as JSON [default: true]
  --token=<value>               Ignore the saved configuration and use this token

DESCRIPTION
  Set PagerDuty Service attributes
```

## `pd tag assign`

Assign/Remove Tags to/from PagerDuty objects

```
USAGE
  $ pd tag assign

FLAGS
  -A, --add_names=<value>...     [default: ] The name of a Tag to add. If no tag with this name exists, a new tag will
                                 be created. Specify multiple times for multiple tags
  -R, --remove_names=<value>...  [default: ] The name of a Tag to remove. Specify multiple times for multiple tags
  -U, --user_emails=<value>...   [default: ] The email of a User to assign this tag to. Specify multiple times for
                                 multiple users
  -a, --add_ids=<value>...       [default: ] The ID of a Tag to add. Specify multiple times for multiple tags
  -b, --useauth=<value>          Use the saved REST API token with this alias
  -e, --ep_ids=<value>...        [default: ] The ID of an Escalation Policy to assign this tag to. Specify multiple
                                 times for multiple users
  -h, --help                     Show CLI help.
  -r, --remove_ids=<value>...    [default: ] The ID of a Tag to remove. Specify multiple times for multiple tags
  -t, --team_ids=<value>...      [default: ] The ID of a Team to assign this tag to. Specify multiple times for multiple
                                 teams
  -u, --user_ids=<value>...      [default: ] The ID of a User to assign this tag to. Specify multiple times for multiple
                                 users
  --debug                        Print REST API call debug logs
  --token=<value>                Ignore the saved configuration and use this token

DESCRIPTION
  Assign/Remove Tags to/from PagerDuty objects
```

## `pd tag list`

List PagerDuty Tags

```
USAGE
  $ pd tag list

FLAGS
  -b, --useauth=<value>    Use the saved REST API token with this alias
  -d, --delimiter=<value>  [default: \n] Delimiter for fields that have more than one value
  -h, --help               Show CLI help.
  -j, --json               output full details as JSON
  -k, --keys=<value>...    Additional fields to display. Specify multiple times for multiple fields.
  -n, --name=<value>       Select objects whose names contain the given text
  -p, --pipe               Print object ID's only to stdout, for use with pipes.
  -x, --extended           show extra columns
  --columns=<value>        only show provided columns (comma-separated)
  --csv                    output is csv format [alias: --output=csv]
  --debug                  Print REST API call debug logs
  --filter=<value>         filter property by partial string matching, ex: name=foo
  --limit=<value>          Return no more than this many entries. This option turns off table filtering options.
  --no-header              hide table header from output
  --no-truncate            do not truncate output to fit screen
  --output=<option>        output in a more machine friendly format
                           <options: csv|json|yaml>
  --sort=<value>           property to sort by (prepend '-' for descending)
  --token=<value>          Ignore the saved configuration and use this token

DESCRIPTION
  List PagerDuty Tags
```

## `pd tag listobjects`

List Tagged PagerDuty Objects (Connected Entities)

```
USAGE
  $ pd tag listobjects

FLAGS
  -b, --useauth=<value>    Use the saved REST API token with this alias
  -d, --delimiter=<value>  [default: \n] Delimiter for fields that have more than one value
  -h, --help               Show CLI help.
  -i, --ids=<value>...     [default: ] The ID of a Tag to show. Specify multiple times for multiple tags
  -j, --json               output full details as JSON
  -k, --keys=<value>...    Additional fields to display. Specify multiple times for multiple fields.
  -n, --names=<value>...   [default: ] The name of a Tag to show. Specify multiple times for multiple tags
  -p, --pipe               Print object ID's only to stdout, for use with pipes.
  -t, --types=<option>...  [default: users,teams,escalation_policies] The types of objects to show. Specify multiple
                           times for multiple types
                           <options: users|teams|escalation_policies>
  -x, --extended           show extra columns
  --columns=<value>        only show provided columns (comma-separated)
  --csv                    output is csv format [alias: --output=csv]
  --debug                  Print REST API call debug logs
  --filter=<value>         filter property by partial string matching, ex: name=foo
  --no-header              hide table header from output
  --no-truncate            do not truncate output to fit screen
  --output=<option>        output in a more machine friendly format
                           <options: csv|json|yaml>
  --sort=<value>           property to sort by (prepend '-' for descending)
  --token=<value>          Ignore the saved configuration and use this token

DESCRIPTION
  List Tagged PagerDuty Objects (Connected Entities)
```

## `pd team create`

Create an empty PagerDuty Team. You can add escalation policies and users later with team:ep and team:user

```
USAGE
  $ pd team create

FLAGS
  -A, --parent_name=<value>  The name of the new team's parent team
  -a, --parent_id=<value>    The ID of the new team's parent team
  -b, --useauth=<value>      Use the saved REST API token with this alias
  -h, --help                 Show CLI help.
  -n, --name=<value>         (required) The name of the team to add.
  -o, --open                 Open the new team in the browser
  -p, --pipe                 Print the team ID only to stdout, for use with pipes.
  --debug                    Print REST API call debug logs
  --description=<value>      The description of the team
  --token=<value>            Ignore the saved configuration and use this token

DESCRIPTION
  Create an empty PagerDuty Team. You can add escalation policies and users later with team:ep and team:user
```

## `pd team ep add`

Add PagerDuty escalation policies to Teams.

```
USAGE
  $ pd team ep add

FLAGS
  -E, --ep_names=<value>...  Add an escalation policy with this name. Specify multiple times for multiple escalation
                             policies.
  -b, --useauth=<value>      Use the saved REST API token with this alias
  -e, --ep_ids=<value>...    Add an escalation policy with this ID. Specify multiple times for multiple escalation
                             policies.
  -h, --help                 Show CLI help.
  -i, --ids=<value>...       The IDs of teams to add escalation policies to.
  -n, --name=<value>         Select teams whose names contain the given text
  --debug                    Print REST API call debug logs
  --token=<value>            Ignore the saved configuration and use this token

DESCRIPTION
  Add PagerDuty escalation policies to Teams.
```

## `pd team ep list`

List the Escalation Policies for a PagerDuty Team

```
USAGE
  $ pd team ep list

FLAGS
  -b, --useauth=<value>    Use the saved REST API token with this alias
  -d, --delimiter=<value>  [default: \n] Delimiter for fields that have more than one value
  -h, --help               Show CLI help.
  -i, --ids=<value>...     The IDs of teams to list escalation policies for.
  -j, --json               output full details as JSON
  -k, --keys=<value>...    Additional fields to display. Specify multiple times for multiple fields.
  -n, --name=<value>       Select teams whose names contain the given text
  -p, --pipe               Print escalation policy ID's only to stdout, for use with pipes.
  -x, --extended           show extra columns
  --columns=<value>        only show provided columns (comma-separated)
  --csv                    output is csv format [alias: --output=csv]
  --debug                  Print REST API call debug logs
  --filter=<value>         filter property by partial string matching, ex: name=foo
  --no-header              hide table header from output
  --no-truncate            do not truncate output to fit screen
  --output=<option>        output in a more machine friendly format
                           <options: csv|json|yaml>
  --sort=<value>           property to sort by (prepend '-' for descending)
  --token=<value>          Ignore the saved configuration and use this token

DESCRIPTION
  List the Escalation Policies for a PagerDuty Team
```

## `pd team ep remove`

Remove PagerDuty escalation policies from Teams.

```
USAGE
  $ pd team ep remove

FLAGS
  -E, --ep_names=<value>...  Remove an escalation policy with this name. Specify multiple times for multiple escalation
                             policies.
  -b, --useauth=<value>      Use the saved REST API token with this alias
  -e, --ep_ids=<value>...    Remove an escalation policy with this ID. Specify multiple times for multiple escalation
                             policies.
  -h, --help                 Show CLI help.
  -i, --ids=<value>...       The IDs of teams to remove escalation policies from.
  -n, --name=<value>         Select teams whose names contain the given text
  --debug                    Print REST API call debug logs
  --token=<value>            Ignore the saved configuration and use this token

DESCRIPTION
  Remove PagerDuty escalation policies from Teams.
```

## `pd team list`

List PagerDuty Teams

```
USAGE
  $ pd team list

FLAGS
  -b, --useauth=<value>    Use the saved REST API token with this alias
  -d, --delimiter=<value>  [default: \n] Delimiter for fields that have more than one value
  -h, --help               Show CLI help.
  -j, --json               output full details as JSON
  -k, --keys=<value>...    Additional fields to display. Specify multiple times for multiple fields.
  -n, --name=<value>       Select teams whose names contain the given text
  -p, --pipe               Print team ID's only to stdout, for use with pipes.
  -x, --extended           show extra columns
  --columns=<value>        only show provided columns (comma-separated)
  --csv                    output is csv format [alias: --output=csv]
  --debug                  Print REST API call debug logs
  --filter=<value>         filter property by partial string matching, ex: name=foo
  --limit=<value>          Return no more than this many entries. This option turns off table filtering options.
  --no-header              hide table header from output
  --no-truncate            do not truncate output to fit screen
  --output=<option>        output in a more machine friendly format
                           <options: csv|json|yaml>
  --sort=<value>           property to sort by (prepend '-' for descending)
  --token=<value>          Ignore the saved configuration and use this token

DESCRIPTION
  List PagerDuty Teams
```

## `pd team open`

Open PagerDuty Teams in the browser

```
USAGE
  $ pd team open

FLAGS
  -b, --useauth=<value>  Use the saved REST API token with this alias
  -h, --help             Show CLI help.
  -i, --ids=<value>...   The IDs of teams to open.
  -n, --name=<value>     Open teams matching this string.
  -p, --pipe             Read team ID's from stdin.
  --debug                Print REST API call debug logs
  --token=<value>        Ignore the saved configuration and use this token

DESCRIPTION
  Open PagerDuty Teams in the browser
```

## `pd team user add`

Add PagerDuty users to Teams. If a given user is already a member, this command will set their role on the team.

```
USAGE
  $ pd team user add

FLAGS
  -U, --user_emails=<value>...  Add a user with this email. Specify multiple times for multiple users.
  -b, --useauth=<value>         Use the saved REST API token with this alias
  -h, --help                    Show CLI help.
  -i, --ids=<value>...          The IDs of teams to add members to.
  -n, --name=<value>            Select teams whose names contain the given text
  -r, --role=<option>           [default: manager] The role of the user(s) on the team(s)
                                <options: manager|responder|observer>
  -u, --user_ids=<value>...     Add a user with this ID. Specify multiple times for multiple users.
  --debug                       Print REST API call debug logs
  --token=<value>               Ignore the saved configuration and use this token

DESCRIPTION
  Add PagerDuty users to Teams. If a given user is already a member, this command will set their role on the team.
```

## `pd team user list`

List PagerDuty Team Members

```
USAGE
  $ pd team user list

FLAGS
  -b, --useauth=<value>    Use the saved REST API token with this alias
  -d, --delimiter=<value>  [default: \n] Delimiter for fields that have more than one value
  -h, --help               Show CLI help.
  -i, --ids=<value>...     The IDs of teams to list members for.
  -j, --json               output full details as JSON
  -k, --keys=<value>...    Additional fields to display. Specify multiple times for multiple fields.
  -n, --name=<value>       Select teams whose names contain the given text
  -p, --pipe               Print user ID's only to stdout, for use with pipes.
  -x, --extended           show extra columns
  --columns=<value>        only show provided columns (comma-separated)
  --csv                    output is csv format [alias: --output=csv]
  --debug                  Print REST API call debug logs
  --filter=<value>         filter property by partial string matching, ex: name=foo
  --no-header              hide table header from output
  --no-truncate            do not truncate output to fit screen
  --output=<option>        output in a more machine friendly format
                           <options: csv|json|yaml>
  --sort=<value>           property to sort by (prepend '-' for descending)
  --token=<value>          Ignore the saved configuration and use this token

DESCRIPTION
  List PagerDuty Team Members
```

## `pd team user remove`

Remove PagerDuty users from Teams

```
USAGE
  $ pd team user remove

FLAGS
  -U, --user_emails=<value>...  Remove a user with this email. Specify multiple times for multiple users.
  -b, --useauth=<value>         Use the saved REST API token with this alias
  -h, --help                    Show CLI help.
  -i, --ids=<value>...          The IDs of teams to remove members from.
  -n, --name=<value>            Select teams whose names contain the given text
  -u, --user_ids=<value>...     Remove a user with this ID. Specify multiple times for multiple users.
  --debug                       Print REST API call debug logs
  --token=<value>               Ignore the saved configuration and use this token

DESCRIPTION
  Remove PagerDuty users from Teams
```

## `pd update [CHANNEL]`

update the pd CLI

```
USAGE
  $ pd update [CHANNEL] [-a] [-v <value> | -i] [--force]

FLAGS
  -a, --available        Install a specific version.
  -i, --interactive      Interactively select version to install. This is ignored if a channel is provided.
  -v, --version=<value>  Install a specific version.
  --force                Force a re-download of the requested version.

DESCRIPTION
  update the pd CLI

EXAMPLES
  Update to the stable channel:

    $ pd update stable

  Update to a specific version:

    $ pd update --version 1.0.0

  Interactively select version:

    $ pd update --interactive

  See available versions:

    $ pd update --available
```

_See code: [@oclif/plugin-update](https://github.com/oclif/plugin-update/blob/v3.1.4/src/commands/update.ts)_

## `pd user contact add`

Add a contact method to a PagerDuty user

```
USAGE
  $ pd user contact add

FLAGS
  -T, --type=<option>    (required) The contact method type.
                         <options: email|phone|sms>
  -a, --address=<value>  (required) The contact method address or phone number.
  -b, --useauth=<value>  Use the saved REST API token with this alias
  -e, --email=<value>    Add contact to the user with this login email.
  -h, --help             Show CLI help.
  -i, --id=<value>       Add contact to the user with this ID.
  -l, --label=<value>    (required) The contact method label.
  --debug                Print REST API call debug logs
  --token=<value>        Ignore the saved configuration and use this token

DESCRIPTION
  Add a contact method to a PagerDuty user
```

## `pd user contact list`

List a PagerDuty User's contact methods.

```
USAGE
  $ pd user contact list

FLAGS
  -b, --useauth=<value>    Use the saved REST API token with this alias
  -d, --delimiter=<value>  [default: \n] Delimiter for fields that have more than one value
  -e, --email=<value>      Show contacts for the user with this login email.
  -h, --help               Show CLI help.
  -i, --id=<value>         Show contacts for the user with this ID.
  -j, --json               output full details as JSON
  -k, --keys=<value>...    Additional fields to display. Specify multiple times for multiple fields.
  -p, --pipe               Print contact ID's only to stdout, for use with pipes.
  -x, --extended           show extra columns
  --columns=<value>        only show provided columns (comma-separated)
  --csv                    output is csv format [alias: --output=csv]
  --debug                  Print REST API call debug logs
  --filter=<value>         filter property by partial string matching, ex: name=foo
  --no-header              hide table header from output
  --no-truncate            do not truncate output to fit screen
  --output=<option>        output in a more machine friendly format
                           <options: csv|json|yaml>
  --sort=<value>           property to sort by (prepend '-' for descending)
  --token=<value>          Ignore the saved configuration and use this token

DESCRIPTION
  List a PagerDuty User's contact methods.
```

## `pd user contact set`

Update a contact method for a PagerDuty user

```
USAGE
  $ pd user contact set

FLAGS
  -a, --address=<value>     The contact method address or phone number to set.
  -b, --useauth=<value>     Use the saved REST API token with this alias
  -c, --contact_id=<value>  (required) Update the contact with this ID.
  -e, --email=<value>       Update a contact for the user with this login email.
  -h, --help                Show CLI help.
  -i, --id=<value>          Update a contact for the user with this ID.
  -l, --label=<value>       The contact method label to set.
  --debug                   Print REST API call debug logs
  --token=<value>           Ignore the saved configuration and use this token

DESCRIPTION
  Update a contact method for a PagerDuty user
```

## `pd user create`

Create a PagerDuty User

```
USAGE
  $ pd user create

FLAGS
  -F, --from=<value>         Login email of a PD user account for the "From:" header. Use only with legacy API tokens.
  -b, --useauth=<value>      Use the saved REST API token with this alias
  -c, --color=<value>        The user's schedule color
  -d, --description=<value>  The user's job description
  -e, --email=<value>        (required) The user's login email
  -h, --help                 Show CLI help.
  -n, --name=<value>         (required) The user's name
  -o, --open                 Open the new user in the browser
  -p, --pipe                 Print the user ID only to stdout, for use with pipes.
  -r, --role=<option>        [default: user] The user's role
                             <options:
                             admin|read_only_user|read_only_limited_user|user|limited_user|observer|restricted_access>
  -t, --title=<value>        The user's job title
  -w, --password=<value>     The user's password - if not specified, a random password will be generated
  -z, --timezone=<value>     [default: UTC] The user's time zone
  --debug                    Print REST API call debug logs
  --show_password            Show the user's password when creating
  --token=<value>            Ignore the saved configuration and use this token

DESCRIPTION
  Create a PagerDuty User
```

## `pd user delete`

Dangerous - Delete PagerDuty Users

```
USAGE
  $ pd user delete

FLAGS
  -E, --exact_emails=<value>...  Select a user whose login email is this exact text.  Specify multiple times for
                                 multiple emails.
  -b, --useauth=<value>          Use the saved REST API token with this alias
  -e, --emails=<value>...        Select users whose emails contain the given text. Specify multiple times for multiple
                                 emails.
  -h, --help                     Show CLI help.
  -i, --ids=<value>...           Select users with the given ID. Specify multiple times for multiple users.
  -p, --pipe                     Read user ID's from stdin.
  --debug                        Print REST API call debug logs
  --force                        Extreme danger mode: do not prompt before deleting
  --token=<value>                Ignore the saved configuration and use this token

DESCRIPTION
  Dangerous - Delete PagerDuty Users
```

## `pd user list`

List PagerDuty Users

```
USAGE
  $ pd user list

FLAGS
  -E, --exact_email=<value>  Select the user whose login email is this exact text
  -b, --useauth=<value>      Use the saved REST API token with this alias
  -d, --delimiter=<value>    [default: \n] Delimiter for fields that have more than one value
  -e, --email=<value>        Select users whose login email addresses contain the given text
  -h, --help                 Show CLI help.
  -j, --json                 output full details as JSON
  -k, --keys=<value>...      Additional fields to display. Specify multiple times for multiple fields.
  -n, --name=<value>         Select users whose names contain the given text
  -p, --pipe                 Print user ID's only to stdout, for use with pipes.
  -x, --extended             show extra columns
  --columns=<value>          only show provided columns (comma-separated)
  --csv                      output is csv format [alias: --output=csv]
  --debug                    Print REST API call debug logs
  --filter=<value>           filter property by partial string matching, ex: name=foo
  --limit=<value>            Return no more than this many entries. This option turns off table filtering options.
  --no-header                hide table header from output
  --no-truncate              do not truncate output to fit screen
  --output=<option>          output in a more machine friendly format
                             <options: csv|json|yaml>
  --sort=<value>             property to sort by (prepend '-' for descending)
  --token=<value>            Ignore the saved configuration and use this token

DESCRIPTION
  List PagerDuty Users
```

## `pd user log`

Show PagerDuty User Log Entries

```
USAGE
  $ pd user log

FLAGS
  -E, --exact_email=<value>  Select the user whose login email is this exact text
  -O, --overview             Get only `overview` log entries
  -b, --useauth=<value>      Use the saved REST API token with this alias
  -d, --delimiter=<value>    [default: \n] Delimiter for fields that have more than one value
  -e, --email=<value>        Select users whose login email addresses contain the given text
  -h, --help                 Show CLI help.
  -i, --ids=<value>...       Select users with the given ID. Specify multiple times for multiple users.
  -j, --json                 output full details as JSON
  -k, --keys=<value>...      Additional fields to display. Specify multiple times for multiple fields.
  -n, --name=<value>         Select objects whose names contain the given text
  -p, --pipe                 Print object ID's only to stdout, for use with pipes.
  -x, --extended             show extra columns
  --columns=<value>          only show provided columns (comma-separated)
  --csv                      output is csv format [alias: --output=csv]
  --debug                    Print REST API call debug logs
  --filter=<value>           filter property by partial string matching, ex: name=foo
  --limit=<value>            Return no more than this many entries. This option turns off table filtering options.
  --no-header                hide table header from output
  --no-truncate              do not truncate output to fit screen
  --output=<option>          output in a more machine friendly format
                             <options: csv|json|yaml>
  --since=<value>            [default: 30 days ago] The start of the date range over which you want to search.
  --sort=<value>             property to sort by (prepend '-' for descending)
  --token=<value>            Ignore the saved configuration and use this token
  --until=<value>            The end of the date range over which you want to search.

DESCRIPTION
  Show PagerDuty User Log Entries
```

## `pd user oncall`

List a PagerDuty User's on call shifts.

```
USAGE
  $ pd user oncall

FLAGS
  -a, --always             Include 'Always on call.'
  -b, --useauth=<value>    Use the saved REST API token with this alias
  -d, --delimiter=<value>  [default: \n] Delimiter for fields that have more than one value
  -e, --email=<value>      Show oncalls for the user with this login email.
  -h, --help               Show CLI help.
  -i, --id=<value>         Show oncalls for the user with this ID.
  -j, --json               output full details as JSON
  -k, --keys=<value>...    Additional fields to display. Specify multiple times for multiple fields.
  -m, --me                 Show my oncalls.
  -x, --extended           show extra columns
  --columns=<value>        only show provided columns (comma-separated)
  --csv                    output is csv format [alias: --output=csv]
  --debug                  Print REST API call debug logs
  --filter=<value>         filter property by partial string matching, ex: name=foo
  --no-header              hide table header from output
  --no-truncate            do not truncate output to fit screen
  --output=<option>        output in a more machine friendly format
                           <options: csv|json|yaml>
  --since=<value>          The start of the date range over which you want to search.
  --sort=<value>           property to sort by (prepend '-' for descending)
  --token=<value>          Ignore the saved configuration and use this token
  --until=<value>          The end of the date range over which you want to search.

DESCRIPTION
  List a PagerDuty User's on call shifts.
```

## `pd user replace`

Replace PagerDuty Users in all Schedules and Escalation Policies

```
USAGE
  $ pd user replace

FLAGS
  -U, --user_email=<value>  The email of the replacement user.
  -b, --useauth=<value>     Use the saved REST API token with this alias
  -d, --deleted             Replace all deleted users
  -h, --help                Show CLI help.
  -i, --ids=<value>...      Replace the given user IDs. Specify multiple times for multiple users.
  -p, --pipe                Read IDs of users to replace from stdin.
  -u, --user_id=<value>     The ID of the replacement user.
  --debug                   Print REST API call debug logs
  --force                   Extreme danger mode: do not prompt before updating
  --token=<value>           Ignore the saved configuration and use this token

DESCRIPTION
  Replace PagerDuty Users in all Schedules and Escalation Policies
```

## `pd user session list`

List a PagerDuty User's sessions.

```
USAGE
  $ pd user session list

FLAGS
  -b, --useauth=<value>    Use the saved REST API token with this alias
  -d, --delimiter=<value>  [default: \n] Delimiter for fields that have more than one value
  -e, --email=<value>      Show sessions for the user with this login email.
  -h, --help               Show CLI help.
  -i, --id=<value>         Show sessions for the user with this ID.
  -j, --json               output full details as JSON
  -k, --keys=<value>...    Additional fields to display. Specify multiple times for multiple fields.
  -p, --pipe               Print session ID's only to stdout, for use with pipes.
  -q, --query=<value>      Query the API output
  -x, --extended           show extra columns
  --columns=<value>        only show provided columns (comma-separated)
  --csv                    output is csv format [alias: --output=csv]
  --debug                  Print REST API call debug logs
  --filter=<value>         filter property by partial string matching, ex: name=foo
  --no-header              hide table header from output
  --no-truncate            do not truncate output to fit screen
  --output=<option>        output in a more machine friendly format
                           <options: csv|json|yaml>
  --since=<value>          The start of the date range over which you want to search.
  --sort=<value>           property to sort by (prepend '-' for descending)
  --token=<value>          Ignore the saved configuration and use this token
  --until=<value>          The end of the date range over which you want to search.

DESCRIPTION
  List a PagerDuty User's sessions.
```

## `pd user set`

Set PagerDuty User attributes

```
USAGE
  $ pd user set

FLAGS
  -E, --exact_emails=<value>...  Select a user whose login email is this exact text.  Specify multiple times for
                                 multiple emails.
  -b, --useauth=<value>          Use the saved REST API token with this alias
  -e, --emails=<value>...        Select users whose emails contain the given text. Specify multiple times for multiple
                                 emails.
  -h, --help                     Show CLI help.
  -i, --ids=<value>...           Select users with the given ID. Specify multiple times for multiple users.
  -k, --keys=<value>...          (required) Attribute keys to set. Specify multiple times to set multiple keys.
  -p, --pipe                     Read user ID's from stdin.
  -v, --values=<value>...        (required) Attribute values to set. To set multiple key/values, specify multiple times
                                 in the same order as the keys.
  --debug                        Print REST API call debug logs
  --[no-]jsonvalues              Interpret values as JSON [default: true]
  --token=<value>                Ignore the saved configuration and use this token

DESCRIPTION
  Set PagerDuty User attributes
```

## `pd util deleteresource`

Dangerous - Delete PagerDuty Resources

```
USAGE
  $ pd util deleteresource

FLAGS
  -b, --useauth=<value>         Use the saved REST API token with this alias
  -h, --help                    Show CLI help.
  -i, --ids=<value>...          Select resources with the given ID. Specify multiple times for multiple resources.
  -p, --pipe                    Read resource ID's from stdin.
  -t, --resource-type=<option>  (required) The type of PagerDuty resource to delete. You have to provide either -i or -p
                                to specify IDs of objects to delete.
                                <options:
                                business_service|escalation_policy|extension|response_play|ruleset|schedule|service|tag|
                                team|user|webhook_subscription|automation_action|automation_runner|field|field_schema>
  --debug                       Print REST API call debug logs
  --force                       Extreme danger mode: do not prompt before deleting
  --token=<value>               Ignore the saved configuration and use this token

DESCRIPTION
  Dangerous - Delete PagerDuty Resources
```

## `pd util timestamp`

Make ISO8601 timestamps

```
USAGE
  $ pd util timestamp

ARGUMENTS
  DATE  A human-style date/time, like "4pm 1/1/2021" or "Dec 2 1pm", etc. Default: now

FLAGS
  -h, --help  Show CLI help.
  --debug     Print REST API call debug logs

DESCRIPTION
  Make ISO8601 timestamps
```

## `pd version`

```
USAGE
  $ pd version [--json] [--verbose]

FLAGS
  --verbose  Show additional information about the CLI.

GLOBAL FLAGS
  --json  Format output as json.

FLAG DESCRIPTIONS
  --verbose  Show additional information about the CLI.

    Additionally shows the architecture, node version, operating system, and versions of plugins that the CLI is using.
```

_See code: [@oclif/plugin-version](https://github.com/oclif/plugin-version/blob/v1.2.1/src/commands/version.ts)_
<!-- commandsstop -->
