`pd log`
========

Show PagerDuty Domain Log Entries

* [`pd log`](#pd-log)

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

_See code: [src/commands/log.ts](https://github.com/martindstone/pagerduty-cli/blob/v0.1.15/src/commands/log.ts)_
