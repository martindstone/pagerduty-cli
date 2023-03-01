`pd team`
=========

See/Manage teams

* [`pd team create`](#pd-team-create)
* [`pd team ep add`](#pd-team-ep-add)
* [`pd team ep list`](#pd-team-ep-list)
* [`pd team ep remove`](#pd-team-ep-remove)
* [`pd team list`](#pd-team-list)
* [`pd team open`](#pd-team-open)
* [`pd team user add`](#pd-team-user-add)
* [`pd team user list`](#pd-team-user-list)
* [`pd team user remove`](#pd-team-user-remove)

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
