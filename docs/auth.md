`pd auth`
=========

Get/Set authentication token

* [`pd auth add`](#pd-auth-add)
* [`pd auth delete`](#pd-auth-delete)
* [`pd auth get`](#pd-auth-get)
* [`pd auth list`](#pd-auth-list)
* [`pd auth add`](#pd-auth-add-1)
* [`pd auth use`](#pd-auth-use)
* [`pd auth web`](#pd-auth-web)

## `pd auth add`

Add an authenticated PagerDuty domain

```
USAGE
  $ pd auth add

FLAGS
  -a, --alias=<value>  The alias to use for this token. Defaults to the name of the PD subdomain
  -d, --[no-]default   Use this token as the default for all PD commands
  -h, --help           Show CLI help.
  -t, --token=<value>  A PagerDuty API token
  --debug              Print REST API call debug logs

DESCRIPTION
  Add an authenticated PagerDuty domain

ALIASES
  $ pd auth set
```

## `pd auth delete`

Delete a PagerDuty domain authentication

```
USAGE
  $ pd auth delete

FLAGS
  -a, --alias=<value>  (required) The alias of the PD domain authentication to delete
  -h, --help           Show CLI help.
  --debug              Print REST API call debug logs

DESCRIPTION
  Delete a PagerDuty domain authentication
```

## `pd auth get`

Get the current authenticated PagerDuty domain

```
USAGE
  $ pd auth get

FLAGS
  -h, --help  Show CLI help.
  --debug     Print REST API call debug logs

DESCRIPTION
  Get the current authenticated PagerDuty domain
```

## `pd auth list`

List authenticated PagerDuty domains

```
USAGE
  $ pd auth list

FLAGS
  -h, --help  Show CLI help.
  --debug     Print REST API call debug logs

DESCRIPTION
  List authenticated PagerDuty domains
```

## `pd auth add`

Add an authenticated PagerDuty domain

```
USAGE
  $ pd auth add

FLAGS
  -a, --alias=<value>  The alias to use for this token. Defaults to the name of the PD subdomain
  -d, --[no-]default   Use this token as the default for all PD commands
  -h, --help           Show CLI help.
  -t, --token=<value>  A PagerDuty API token
  --debug              Print REST API call debug logs

DESCRIPTION
  Add an authenticated PagerDuty domain

ALIASES
  $ pd auth set
```

## `pd auth use`

Choose a saved authenticated PagerDuty domain to use with all pd commands

```
USAGE
  $ pd auth use

FLAGS
  -a, --alias=<value>  (required) The alias of the PD domain to use
  -h, --help           Show CLI help.
  --debug              Print REST API call debug logs

DESCRIPTION
  Choose a saved authenticated PagerDuty domain to use with all pd commands
```

## `pd auth web`

Authenticate with PagerDuty in the browser

```
USAGE
  $ pd auth web

FLAGS
  -a, --alias=<value>  The alias to use for this token. Defaults to the name of the PD subdomain
  -d, --[no-]default   Use this token as the default for all PD commands
  -h, --help           Show CLI help.
  --debug              Print REST API call debug logs

DESCRIPTION
  Authenticate with PagerDuty in the browser

ALIASES
  $ pd login
```
