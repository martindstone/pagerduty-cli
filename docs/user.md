`pd user`
=========

See/manage users

* [`pd user contact add`](#pd-user-contact-add)
* [`pd user contact list`](#pd-user-contact-list)
* [`pd user contact set`](#pd-user-contact-set)
* [`pd user create`](#pd-user-create)
* [`pd user delete`](#pd-user-delete)
* [`pd user list`](#pd-user-list)
* [`pd user log`](#pd-user-log)
* [`pd user oncall`](#pd-user-oncall)
* [`pd user replace`](#pd-user-replace)
* [`pd user session list`](#pd-user-session-list)
* [`pd user set`](#pd-user-set)

## `pd user contact add`

Add a contact method to a PagerDuty user

```
USAGE
  $ pd user contact add

FLAGS
  -T, --type=<option>    (required) The contact method type.
                         <options: email|phone|sms>
  -a, --address=<value>  (required) The contact method address or phone number.
  -b, --useauth=<value>  Use the saved REST API token with this alias
  -e, --email=<value>    Add contact to the user with this login email.
  -h, --help             Show CLI help.
  -i, --id=<value>       Add contact to the user with this ID.
  -l, --label=<value>    (required) The contact method label.
  --debug                Print REST API call debug logs
  --token=<value>        Ignore the saved configuration and use this token

DESCRIPTION
  Add a contact method to a PagerDuty user
```

## `pd user contact list`

List a PagerDuty User's contact methods.

```
USAGE
  $ pd user contact list

FLAGS
  -b, --useauth=<value>    Use the saved REST API token with this alias
  -d, --delimiter=<value>  [default: \n] Delimiter for fields that have more than one value
  -e, --email=<value>      Show contacts for the user with this login email.
  -h, --help               Show CLI help.
  -i, --id=<value>         Show contacts for the user with this ID.
  -j, --json               output full details as JSON
  -k, --keys=<value>...    Additional fields to display. Specify multiple times for multiple fields.
  -p, --pipe               Print contact ID's only to stdout, for use with pipes.
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
  List a PagerDuty User's contact methods.
```

## `pd user contact set`

Update a contact method for a PagerDuty user

```
USAGE
  $ pd user contact set

FLAGS
  -a, --address=<value>     The contact method address or phone number to set.
  -b, --useauth=<value>     Use the saved REST API token with this alias
  -c, --contact_id=<value>  (required) Update the contact with this ID.
  -e, --email=<value>       Update a contact for the user with this login email.
  -h, --help                Show CLI help.
  -i, --id=<value>          Update a contact for the user with this ID.
  -l, --label=<value>       The contact method label to set.
  --debug                   Print REST API call debug logs
  --token=<value>           Ignore the saved configuration and use this token

DESCRIPTION
  Update a contact method for a PagerDuty user
```

## `pd user create`

Create a PagerDuty User

```
USAGE
  $ pd user create

FLAGS
  -F, --from=<value>         Login email of a PD user account for the "From:" header. Use only with legacy API tokens.
  -b, --useauth=<value>      Use the saved REST API token with this alias
  -c, --color=<value>        The user's schedule color
  -d, --description=<value>  The user's job description
  -e, --email=<value>        (required) The user's login email
  -h, --help                 Show CLI help.
  -n, --name=<value>         (required) The user's name
  -o, --open                 Open the new user in the browser
  -p, --pipe                 Print the user ID only to stdout, for use with pipes.
  -r, --role=<option>        [default: user] The user's role
                             <options:
                             admin|read_only_user|read_only_limited_user|user|limited_user|observer|restricted_access>
  -t, --title=<value>        The user's job title
  -w, --password=<value>     The user's password - if not specified, a random password will be generated
  -z, --timezone=<value>     [default: UTC] The user's time zone
  --debug                    Print REST API call debug logs
  --show_password            Show the user's password when creating
  --token=<value>            Ignore the saved configuration and use this token

DESCRIPTION
  Create a PagerDuty User
```

## `pd user delete`

Dangerous - Delete PagerDuty Users

```
USAGE
  $ pd user delete

FLAGS
  -E, --exact_emails=<value>...  Select a user whose login email is this exact text.  Specify multiple times for
                                 multiple emails.
  -b, --useauth=<value>          Use the saved REST API token with this alias
  -e, --emails=<value>...        Select users whose emails contain the given text. Specify multiple times for multiple
                                 emails.
  -h, --help                     Show CLI help.
  -i, --ids=<value>...           Select users with the given ID. Specify multiple times for multiple users.
  -p, --pipe                     Read user ID's from stdin.
  --debug                        Print REST API call debug logs
  --force                        Extreme danger mode: do not prompt before deleting
  --token=<value>                Ignore the saved configuration and use this token

DESCRIPTION
  Dangerous - Delete PagerDuty Users
```

## `pd user list`

List PagerDuty Users

```
USAGE
  $ pd user list

FLAGS
  -C, --contact_country_code=<value>...  Select only users with an SMS or Phone Contact method in the country (defined
                                         by the ISO 3166-1 alpha-2 country code)
  -E, --exact_email=<value>              Select the user whose login email is this exact text
  -b, --useauth=<value>                  Use the saved REST API token with this alias
  -d, --delimiter=<value>                [default: \n] Delimiter for fields that have more than one value
  -e, --email=<value>                    Select users whose login email addresses contain the given text
  -h, --help                             Show CLI help.
  -j, --json                             output full details as JSON
  -k, --keys=<value>...                  Additional fields to display. Specify multiple times for multiple fields.
  -n, --name=<value>                     Select users whose names contain the given text
  -p, --pipe                             Print user ID's only to stdout, for use with pipes.
  -x, --extended                         show extra columns
  --columns=<value>                      only show provided columns (comma-separated)
  --csv                                  output is csv format [alias: --output=csv]
  --debug                                Print REST API call debug logs
  --filter=<value>                       filter property by partial string matching, ex: name=foo
  --limit=<value>                        Return no more than this many entries. This option turns off table filtering
                                         options.
  --no-header                            hide table header from output
  --no-truncate                          do not truncate output to fit screen
  --output=<option>                      output in a more machine friendly format
                                         <options: csv|json|yaml>
  --sort=<value>                         property to sort by (prepend '-' for descending)
  --token=<value>                        Ignore the saved configuration and use this token

DESCRIPTION
  List PagerDuty Users
```

## `pd user log`

Show PagerDuty User Log Entries

```
USAGE
  $ pd user log

FLAGS
  -E, --exact_email=<value>  Select the user whose login email is this exact text
  -O, --overview             Get only `overview` log entries
  -b, --useauth=<value>      Use the saved REST API token with this alias
  -d, --delimiter=<value>    [default: \n] Delimiter for fields that have more than one value
  -e, --email=<value>        Select users whose login email addresses contain the given text
  -h, --help                 Show CLI help.
  -i, --ids=<value>...       Select users with the given ID. Specify multiple times for multiple users.
  -j, --json                 output full details as JSON
  -k, --keys=<value>...      Additional fields to display. Specify multiple times for multiple fields.
  -n, --name=<value>         Select objects whose names contain the given text
  -p, --pipe                 Print object ID's only to stdout, for use with pipes.
  -x, --extended             show extra columns
  --columns=<value>          only show provided columns (comma-separated)
  --csv                      output is csv format [alias: --output=csv]
  --debug                    Print REST API call debug logs
  --filter=<value>           filter property by partial string matching, ex: name=foo
  --limit=<value>            Return no more than this many entries. This option turns off table filtering options.
  --no-header                hide table header from output
  --no-truncate              do not truncate output to fit screen
  --output=<option>          output in a more machine friendly format
                             <options: csv|json|yaml>
  --since=<value>            [default: 30 days ago] The start of the date range over which you want to search.
  --sort=<value>             property to sort by (prepend '-' for descending)
  --token=<value>            Ignore the saved configuration and use this token
  --until=<value>            The end of the date range over which you want to search.

DESCRIPTION
  Show PagerDuty User Log Entries
```

## `pd user oncall`

List a PagerDuty User's on call shifts.

```
USAGE
  $ pd user oncall

FLAGS
  -a, --always             Include 'Always on call.'
  -b, --useauth=<value>    Use the saved REST API token with this alias
  -d, --delimiter=<value>  [default: \n] Delimiter for fields that have more than one value
  -e, --email=<value>      Show oncalls for the user with this login email.
  -h, --help               Show CLI help.
  -i, --id=<value>         Show oncalls for the user with this ID.
  -j, --json               output full details as JSON
  -k, --keys=<value>...    Additional fields to display. Specify multiple times for multiple fields.
  -m, --me                 Show my oncalls.
  -x, --extended           show extra columns
  --columns=<value>        only show provided columns (comma-separated)
  --csv                    output is csv format [alias: --output=csv]
  --debug                  Print REST API call debug logs
  --filter=<value>         filter property by partial string matching, ex: name=foo
  --no-header              hide table header from output
  --no-truncate            do not truncate output to fit screen
  --output=<option>        output in a more machine friendly format
                           <options: csv|json|yaml>
  --since=<value>          The start of the date range over which you want to search.
  --sort=<value>           property to sort by (prepend '-' for descending)
  --token=<value>          Ignore the saved configuration and use this token
  --until=<value>          The end of the date range over which you want to search.

DESCRIPTION
  List a PagerDuty User's on call shifts.
```

## `pd user replace`

Replace PagerDuty Users in all Schedules and Escalation Policies

```
USAGE
  $ pd user replace

FLAGS
  -U, --user_email=<value>  The email of the replacement user.
  -b, --useauth=<value>     Use the saved REST API token with this alias
  -d, --deleted             Replace all deleted users
  -h, --help                Show CLI help.
  -i, --ids=<value>...      Replace the given user IDs. Specify multiple times for multiple users.
  -p, --pipe                Read IDs of users to replace from stdin.
  -u, --user_id=<value>     The ID of the replacement user.
  --debug                   Print REST API call debug logs
  --force                   Extreme danger mode: do not prompt before updating
  --token=<value>           Ignore the saved configuration and use this token

DESCRIPTION
  Replace PagerDuty Users in all Schedules and Escalation Policies
```

## `pd user session list`

List a PagerDuty User's sessions.

```
USAGE
  $ pd user session list

FLAGS
  -b, --useauth=<value>    Use the saved REST API token with this alias
  -d, --delimiter=<value>  [default: \n] Delimiter for fields that have more than one value
  -e, --email=<value>      Show sessions for the user with this login email.
  -h, --help               Show CLI help.
  -i, --id=<value>         Show sessions for the user with this ID.
  -j, --json               output full details as JSON
  -k, --keys=<value>...    Additional fields to display. Specify multiple times for multiple fields.
  -p, --pipe               Print session ID's only to stdout, for use with pipes.
  -q, --query=<value>      Query the API output
  -x, --extended           show extra columns
  --columns=<value>        only show provided columns (comma-separated)
  --csv                    output is csv format [alias: --output=csv]
  --debug                  Print REST API call debug logs
  --filter=<value>         filter property by partial string matching, ex: name=foo
  --no-header              hide table header from output
  --no-truncate            do not truncate output to fit screen
  --output=<option>        output in a more machine friendly format
                           <options: csv|json|yaml>
  --since=<value>          The start of the date range over which you want to search.
  --sort=<value>           property to sort by (prepend '-' for descending)
  --token=<value>          Ignore the saved configuration and use this token
  --until=<value>          The end of the date range over which you want to search.

DESCRIPTION
  List a PagerDuty User's sessions.
```

## `pd user set`

Set PagerDuty User attributes

```
USAGE
  $ pd user set

FLAGS
  -E, --exact_emails=<value>...  Select a user whose login email is this exact text.  Specify multiple times for
                                 multiple emails.
  -b, --useauth=<value>          Use the saved REST API token with this alias
  -e, --emails=<value>...        Select users whose emails contain the given text. Specify multiple times for multiple
                                 emails.
  -h, --help                     Show CLI help.
  -i, --ids=<value>...           Select users with the given ID. Specify multiple times for multiple users.
  -k, --keys=<value>...          (required) Attribute keys to set. Specify multiple times to set multiple keys.
  -p, --pipe                     Read user ID's from stdin.
  -v, --values=<value>...        (required) Attribute values to set. To set multiple key/values, specify multiple times
                                 in the same order as the keys.
  --debug                        Print REST API call debug logs
  --[no-]jsonvalues              Interpret values as JSON [default: true]
  --token=<value>                Ignore the saved configuration and use this token

DESCRIPTION
  Set PagerDuty User attributes
```
