`pd rest`
=========

Make raw requests to PagerDuty REST endpoints

* [`pd rest delete`](#pd-rest-delete)
* [`pd rest fetch`](#pd-rest-fetch)
* [`pd rest get`](#pd-rest-get)
* [`pd rest post`](#pd-rest-post)
* [`pd rest put`](#pd-rest-put)

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
