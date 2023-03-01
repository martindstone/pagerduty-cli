`pd util`
=========

Utility commands

* [`pd util deleteresource`](#pd-util-deleteresource)
* [`pd util timestamp`](#pd-util-timestamp)

## `pd util deleteresource`

Dangerous - Delete PagerDuty Resources

```
USAGE
  $ pd util deleteresource

FLAGS
  -b, --useauth=<value>         Use the saved REST API token with this alias
  -h, --help                    Show CLI help.
  -i, --ids=<value>...          Select resources with the given ID. Specify multiple times for multiple resources.
  -p, --pipe                    Read resource ID's from stdin.
  -t, --resource-type=<option>  (required) The type of PagerDuty resource to delete. You have to provide either -i or -p
                                to specify IDs of objects to delete.
                                <options:
                                business_service|escalation_policy|extension|response_play|ruleset|schedule|service|tag|
                                team|user|webhook_subscription|automation_action|automation_runner|field|field_schema>
  --debug                       Print REST API call debug logs
  --force                       Extreme danger mode: do not prompt before deleting
  --token=<value>               Ignore the saved configuration and use this token

DESCRIPTION
  Dangerous - Delete PagerDuty Resources
```

## `pd util timestamp`

Make ISO8601 timestamps

```
USAGE
  $ pd util timestamp

ARGUMENTS
  DATE  A human-style date/time, like "4pm 1/1/2021" or "Dec 2 1pm", etc. Default: now

FLAGS
  -h, --help  Show CLI help.
  --debug     Print REST API call debug logs

DESCRIPTION
  Make ISO8601 timestamps
```
