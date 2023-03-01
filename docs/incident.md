`pd incident`
=============

See/manage incidents

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
