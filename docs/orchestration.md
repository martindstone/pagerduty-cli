`pd orchestration`
==================

Manage global orchestrations

* [`pd orchestration add`](#pd-orchestration-add)
* [`pd orchestration list`](#pd-orchestration-list)
* [`pd orchestration route add`](#pd-orchestration-route-add)
* [`pd orchestration route delete`](#pd-orchestration-route-delete)
* [`pd orchestration route list`](#pd-orchestration-route-list)

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
