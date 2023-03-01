`pd schedule`
=============

See/manage schedules

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
