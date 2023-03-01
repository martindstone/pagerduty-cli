`pd bs`
=======

See/manage business services

* [`pd bs create`](#pd-bs-create)
* [`pd bs list`](#pd-bs-list)
* [`pd bs subscriber list`](#pd-bs-subscriber-list)

## `pd bs create`

Create a PagerDuty Business Service

```
USAGE
  $ pd bs create

FLAGS
  -T, --team_name=<value>    The name team that owns the Business Service.
  -b, --useauth=<value>      Use the saved REST API token with this alias
  -c, --contact=<value>      The owner of the Business Service.
  -d, --description=<value>  The service's description
  -h, --help                 Show CLI help.
  -n, --name=<value>         (required) The service's name
  -o, --open                 Open the new service in the browser
  -p, --pipe                 Print the service ID only to stdout, for use with pipes.
  -t, --team_id=<value>      The ID of the team that owns the Business Service.
  --debug                    Print REST API call debug logs
  --token=<value>            Ignore the saved configuration and use this token

DESCRIPTION
  Create a PagerDuty Business Service
```

## `pd bs list`

List PagerDuty Business Services

```
USAGE
  $ pd bs list

FLAGS
  -b, --useauth=<value>    Use the saved REST API token with this alias
  -d, --delimiter=<value>  [default: \n] Delimiter for fields that have more than one value
  -h, --help               Show CLI help.
  -j, --json               output full details as JSON
  -k, --keys=<value>...    Additional fields to display. Specify multiple times for multiple fields.
  -n, --name=<value>       Select business services whose names contain the given text
  -p, --pipe               Print business service ID's only to stdout, for use with pipes.
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
  List PagerDuty Business Services
```

## `pd bs subscriber list`

List PagerDuty Business Service Subscribers

```
USAGE
  $ pd bs subscriber list

FLAGS
  -b, --useauth=<value>  Use the saved REST API token with this alias
  -h, --help             Show CLI help.
  -i, --id=<value>       Business Service ID to list subscribers for.
  -j, --json             output full details as JSON
  -n, --name=<value>     Business Service name to list subscribers for.
  -p, --pipe             Print subscriber ID's only to stdout, for use with pipes.
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
  List PagerDuty Business Service Subscribers
```
