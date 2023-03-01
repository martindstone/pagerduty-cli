`pd service`
============

See/manage services

* [`pd service create`](#pd-service-create)
* [`pd service disable`](#pd-service-disable)
* [`pd service enable`](#pd-service-enable)
* [`pd service list`](#pd-service-list)
* [`pd service open`](#pd-service-open)
* [`pd service set`](#pd-service-set)

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
