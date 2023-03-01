`pd automation`
===============

Manage automation actions and runners

* [`pd automation action create`](#pd-automation-action-create)
* [`pd automation action list`](#pd-automation-action-list)
* [`pd automation runner create`](#pd-automation-runner-create)
* [`pd automation runner list`](#pd-automation-runner-list)

## `pd automation action create`

Create a PagerDuty Automation Action

```
USAGE
  $ pd automation action create

FLAGS
  -R, --runner_name=<value>         The name of the runner to run this action
  -S, --service_names=<value>...    The names of services whose incidents will have this action available.
  -T, --team_names=<value>...       The names of teams that will have access to run this action.
  -X, --script_from_stdin           For script actions - read the body of the script from stdin.
  -b, --useauth=<value>             Use the saved REST API token with this alias
  -c, --classification=<option>     The classification of the new automation action
                                    <options: diagnostic|remediation>
  -d, --description=<value>         (required) The description of the new automation action
  -h, --help                        Show CLI help.
  -i, --invocation_command=<value>  For script actions - if the script body is not an executable file, the path to the
                                    command to run it with.
  -j, --job_id=<value>              For process automation actions - the job ID of the job to run
  -n, --name=<value>                (required) The name of the new automation action
  -o, --open                        Open the new action in the browser once it's been created
  -p, --pipe                        Print the new action ID only to stdout, for use with pipes.
  -r, --runner_id=<value>           The ID of the runner to run this action
  -s, --service_ids=<value>...      The IDs of services whose incidents will have this action available.
  -t, --team_ids=<value>...         The IDs of teams that will have access to run this action.
  -x, --script=<value>              For script actions - the body of the script to be executed on the runner.
  --debug                           Print REST API call debug logs
  --job_arguments=<value>           For process automation actions - arguments to pass to the job
  --token=<value>                   Ignore the saved configuration and use this token

DESCRIPTION
  Create a PagerDuty Automation Action
```

## `pd automation action list`

List PagerDuty Automation Actions

```
USAGE
  $ pd automation action list

FLAGS
  -b, --useauth=<value>    Use the saved REST API token with this alias
  -d, --delimiter=<value>  [default: \n] Delimiter for fields that have more than one value
  -h, --help               Show CLI help.
  -j, --json               output full details as JSON
  -k, --keys=<value>...    Additional fields to display. Specify multiple times for multiple fields.
  -n, --name=<value>       Select automation actions whose names contain the given text
  -p, --pipe               Print automation action ID's only to stdout, for use with pipes.
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
  List PagerDuty Automation Actions
```

## `pd automation runner create`

Create a PagerDuty Automation Action

```
USAGE
  $ pd automation runner create

FLAGS
  -T, --team_names=<value>...     The names of teams associated with this runner
  -b, --useauth=<value>           Use the saved REST API token with this alias
  -d, --description=<value>       (required) The description of the new runner
  -h, --help                      Show CLI help.
  -k, --runbook_api_key=<value>   For Runbook Automation runners, the API key to use to connect to the Runbook server
  -n, --name=<value>              (required) The name of the new runner
  -o, --open                      Open the new runner in the browser once it's been created
  -p, --pipe                      Print only the new runner credentials (for Process Automation runners) or ID (for
                                  Runbook Automation runners) to stdout.
  -t, --team_ids=<value>...       The IDs of teams associated with this runner
  -u, --runbook_base_uri=<value>  For Runbook Automation runners, the base URI of the Runbook server to connect to
  -y, --runner_type=<option>      (required) The type of runner to create. Use `sidecar` to create a Process Automation
                                  runner, and `runbook` to create a Runbook Automation runner
                                  <options: sidecar|runbook>
  --debug                         Print REST API call debug logs
  --token=<value>                 Ignore the saved configuration and use this token

DESCRIPTION
  Create a PagerDuty Automation Action
```

## `pd automation runner list`

List PagerDuty Automation Actions Runners

```
USAGE
  $ pd automation runner list

FLAGS
  -b, --useauth=<value>    Use the saved REST API token with this alias
  -d, --delimiter=<value>  [default: \n] Delimiter for fields that have more than one value
  -h, --help               Show CLI help.
  -j, --json               output full details as JSON
  -k, --keys=<value>...    Additional fields to display. Specify multiple times for multiple fields.
  -n, --name=<value>       Select runners whose names contain the given text
  -p, --pipe               Print runner ID's only to stdout, for use with pipes.
  -x, --extended           show extra columns
  --columns=<value>        only show provided columns (comma-separated)
  --csv                    output is csv format [alias: --output=csv]
  --debug                  Print REST API call debug logs
  --filter=<value>         filter property by partial string matching, ex: name=foo
  --health                 Also get runner health info (uses more API requests)
  --limit=<value>          Return no more than this many entries. This option turns off table filtering options.
  --no-header              hide table header from output
  --no-truncate            do not truncate output to fit screen
  --output=<option>        output in a more machine friendly format
                           <options: csv|json|yaml>
  --sort=<value>           property to sort by (prepend '-' for descending)
  --token=<value>          Ignore the saved configuration and use this token

DESCRIPTION
  List PagerDuty Automation Actions Runners
```
