`pd analytics`
==============

Get PagerDuty Incident Analytics

* [`pd analytics incident`](#pd-analytics-incident)
* [`pd analytics incident raw`](#pd-analytics-incident-raw)

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
