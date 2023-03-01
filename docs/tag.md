`pd tag`
========

Assign/Remove Tags to/from PagerDuty objects

* [`pd tag assign`](#pd-tag-assign)
* [`pd tag list`](#pd-tag-list)
* [`pd tag listobjects`](#pd-tag-listobjects)

## `pd tag assign`

Assign/Remove Tags to/from PagerDuty objects

```
USAGE
  $ pd tag assign

FLAGS
  -A, --add_names=<value>...     [default: ] The name of a Tag to add. If no tag with this name exists, a new tag will
                                 be created. Specify multiple times for multiple tags
  -R, --remove_names=<value>...  [default: ] The name of a Tag to remove. Specify multiple times for multiple tags
  -U, --user_emails=<value>...   [default: ] The email of a User to assign this tag to. Specify multiple times for
                                 multiple users
  -a, --add_ids=<value>...       [default: ] The ID of a Tag to add. Specify multiple times for multiple tags
  -b, --useauth=<value>          Use the saved REST API token with this alias
  -e, --ep_ids=<value>...        [default: ] The ID of an Escalation Policy to assign this tag to. Specify multiple
                                 times for multiple users
  -h, --help                     Show CLI help.
  -r, --remove_ids=<value>...    [default: ] The ID of a Tag to remove. Specify multiple times for multiple tags
  -t, --team_ids=<value>...      [default: ] The ID of a Team to assign this tag to. Specify multiple times for multiple
                                 teams
  -u, --user_ids=<value>...      [default: ] The ID of a User to assign this tag to. Specify multiple times for multiple
                                 users
  --debug                        Print REST API call debug logs
  --token=<value>                Ignore the saved configuration and use this token

DESCRIPTION
  Assign/Remove Tags to/from PagerDuty objects
```

## `pd tag list`

List PagerDuty Tags

```
USAGE
  $ pd tag list

FLAGS
  -b, --useauth=<value>    Use the saved REST API token with this alias
  -d, --delimiter=<value>  [default: \n] Delimiter for fields that have more than one value
  -h, --help               Show CLI help.
  -j, --json               output full details as JSON
  -k, --keys=<value>...    Additional fields to display. Specify multiple times for multiple fields.
  -n, --name=<value>       Select objects whose names contain the given text
  -p, --pipe               Print object ID's only to stdout, for use with pipes.
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
  List PagerDuty Tags
```

## `pd tag listobjects`

List Tagged PagerDuty Objects (Connected Entities)

```
USAGE
  $ pd tag listobjects

FLAGS
  -b, --useauth=<value>    Use the saved REST API token with this alias
  -d, --delimiter=<value>  [default: \n] Delimiter for fields that have more than one value
  -h, --help               Show CLI help.
  -i, --ids=<value>...     [default: ] The ID of a Tag to show. Specify multiple times for multiple tags
  -j, --json               output full details as JSON
  -k, --keys=<value>...    Additional fields to display. Specify multiple times for multiple fields.
  -n, --names=<value>...   [default: ] The name of a Tag to show. Specify multiple times for multiple tags
  -p, --pipe               Print object ID's only to stdout, for use with pipes.
  -t, --types=<option>...  [default: users,teams,escalation_policies] The types of objects to show. Specify multiple
                           times for multiple types
                           <options: users|teams|escalation_policies>
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
  List Tagged PagerDuty Objects (Connected Entities)
```
