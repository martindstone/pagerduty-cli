`pd ep`
=======

See/manage escalation policies

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
