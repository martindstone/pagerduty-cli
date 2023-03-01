`pd field`
==========

Manage custom fields

* [`pd field create`](#pd-field-create)
* [`pd field list`](#pd-field-list)
* [`pd field option create`](#pd-field-option-create)
* [`pd field option list`](#pd-field-option-list)
* [`pd field option remove`](#pd-field-option-remove)
* [`pd field schema addfield`](#pd-field-schema-addfield)
* [`pd field schema assignment create`](#pd-field-schema-assignment-create)
* [`pd field schema assignment list`](#pd-field-schema-assignment-list)
* [`pd field schema assignment remove`](#pd-field-schema-assignment-remove)
* [`pd field schema create`](#pd-field-schema-create)
* [`pd field schema list`](#pd-field-schema-list)
* [`pd field schema listfields`](#pd-field-schema-listfields)
* [`pd field schema removefield`](#pd-field-schema-removefield)

## `pd field create`

Create a PagerDuty Custom Field

```
USAGE
  $ pd field create

FLAGS
  -N, --display_name=<value>  (required) A human readable name for the field
  -b, --useauth=<value>       Use the saved REST API token with this alias
  -d, --description=<value>   A human readable description for the field
  -f, --fixed                 Fixed-options field. Specify to create a field that can only take on specific values
                              defined in a list.
  -h, --help                  Show CLI help.
  -m, --multi                 Multi-value field. Specify to create a field that can contain a list of <type> values.
  -n, --name=<value>          (required) An identifier for the field intended primarily for scripting or other
                              programmatic use.
  -p, --pipe                  Print the field ID only to stdout, for use with pipes.
  -t, --type=<option>         The data type of the field
                              <options: string|integer|float|boolean|datetime|url>
  --debug                     Print REST API call debug logs
  --token=<value>             Ignore the saved configuration and use this token

DESCRIPTION
  Create a PagerDuty Custom Field
```

## `pd field list`

List PagerDuty Custom Fields

```
USAGE
  $ pd field list

FLAGS
  -b, --useauth=<value>    Use the saved REST API token with this alias
  -d, --delimiter=<value>  [default:
                           ] Delimiter for fields that have more than one value
  -h, --help               Show CLI help.
  -j, --json               output full details as JSON
  -k, --keys=<value>...    Additional fields to display. Specify multiple times for multiple fields.
  -p, --pipe               Print field ID's only to stdout, for use with pipes.
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
  List PagerDuty Custom Fields
```

## `pd field option create`

Create an option for a fixed-options Custom Field

```
USAGE
  $ pd field option create

FLAGS
  -b, --useauth=<value>  Use the saved REST API token with this alias
  -h, --help             Show CLI help.
  -i, --id=<value>       (required) The ID of a fixed-options Field to add an option to.
  -p, --pipe             Print the new field option ID only to stdout, for use with pipes.
  -v, --value=<value>    (required) The field option value to add
  --debug                Print REST API call debug logs
  --token=<value>        Ignore the saved configuration and use this token

DESCRIPTION
  Create an option for a fixed-options Custom Field
```

## `pd field option list`

List PagerDuty Custom Field Options

```
USAGE
  $ pd field option list

FLAGS
  -b, --useauth=<value>  Use the saved REST API token with this alias
  -h, --help             Show CLI help.
  -i, --id=<value>       (required) The ID of a fixed-options Field to list options for.
  -j, --json             output full details as JSON
  -k, --keys=<value>...  Additional fields to display. Specify multiple times for multiple fields.
  -p, --pipe             Print field option ID's only to stdout, for use with pipes.
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
  List PagerDuty Custom Field Options
```

## `pd field option remove`

Remove an option from a fixed-options Custom Field

```
USAGE
  $ pd field option remove

FLAGS
  -b, --useauth=<value>    Use the saved REST API token with this alias
  -h, --help               Show CLI help.
  -i, --id=<value>         (required) The ID of a fixed-options Field to remove an option from.
  -o, --option_id=<value>  (required) The ID of the option to remove from the field.
  --debug                  Print REST API call debug logs
  --token=<value>          Ignore the saved configuration and use this token

DESCRIPTION
  Remove an option from a fixed-options Custom Field
```

## `pd field schema addfield`

Add a Field to a PagerDuty Custom Field Schema

```
USAGE
  $ pd field schema addfield

FLAGS
  -b, --useauth=<value>          Use the saved REST API token with this alias
  -d, --defaultvalue=<value>...  Provide a default value for the field. You can specify multiple times if the field is
                                 multi-valued.
  -f, --field_id=<value>         (required) The ID of a field to add to the schema.
  -h, --help                     Show CLI help.
  -i, --id=<value>               (required) The ID of a Field Schema to add fields to.
  -r, --required                 The specified field is a required field.
  --debug                        Print REST API call debug logs
  --overwrite                    Overwrite existing configuration for this field if it is already present in the schema
  --token=<value>                Ignore the saved configuration and use this token

DESCRIPTION
  Add a Field to a PagerDuty Custom Field Schema
```

## `pd field schema assignment create`

Create a PagerDuty Custom Field Schema Assignment

```
USAGE
  $ pd field schema assignment create

FLAGS
  -b, --useauth=<value>     Use the saved REST API token with this alias
  -h, --help                Show CLI help.
  -i, --id=<value>          (required) The ID of a Field Schema to assign.
  -s, --service_id=<value>  (required) The ID of a service to assign the schema to.
  --debug                   Print REST API call debug logs
  --token=<value>           Ignore the saved configuration and use this token

DESCRIPTION
  Create a PagerDuty Custom Field Schema Assignment
```

## `pd field schema assignment list`

List PagerDuty Custom Field Schema Service Assignments

```
USAGE
  $ pd field schema assignment list

FLAGS
  -b, --useauth=<value>         Use the saved REST API token with this alias
  -d, --delimiter=<value>       [default:
                                ] Delimiter for fields that have more than one value
  -h, --help                    Show CLI help.
  -i, --ids=<value>...          A schema ID to list assignments for. Specify multiple times for multiple schemas.
  -j, --json                    output full details as JSON
  -k, --keys=<value>...         Additional fields to display. Specify multiple times for multiple fields.
  -s, --service_ids=<value>...  A service ID to list assignments for. Specify multiple times for multiple services.
  -x, --extended                show extra columns
  --columns=<value>             only show provided columns (comma-separated)
  --csv                         output is csv format [alias: --output=csv]
  --debug                       Print REST API call debug logs
  --filter=<value>              filter property by partial string matching, ex: name=foo
  --no-header                   hide table header from output
  --no-truncate                 do not truncate output to fit screen
  --output=<option>             output in a more machine friendly format
                                <options: csv|json|yaml>
  --sort=<value>                property to sort by (prepend '-' for descending)
  --token=<value>               Ignore the saved configuration and use this token

DESCRIPTION
  List PagerDuty Custom Field Schema Service Assignments
```

## `pd field schema assignment remove`

Remove a PagerDuty Custom Field Schema Assignment

```
USAGE
  $ pd field schema assignment remove

FLAGS
  -b, --useauth=<value>  Use the saved REST API token with this alias
  -h, --help             Show CLI help.
  -i, --id=<value>       (required) The ID of a Field Schema Assignment to remove.
  --debug                Print REST API call debug logs
  --token=<value>        Ignore the saved configuration and use this token

DESCRIPTION
  Remove a PagerDuty Custom Field Schema Assignment
```

## `pd field schema create`

Create a PagerDuty Custom Field Schema

```
USAGE
  $ pd field schema create

FLAGS
  -b, --useauth=<value>      Use the saved REST API token with this alias
  -d, --description=<value>  A human readable description for the schema
  -h, --help                 Show CLI help.
  -p, --pipe                 Print the schema ID only to stdout, for use with pipes.
  -t, --title=<value>        (required) An identifier for the schema intended primarily for scripting or other
                             programmatic use.
  --debug                    Print REST API call debug logs
  --token=<value>            Ignore the saved configuration and use this token

DESCRIPTION
  Create a PagerDuty Custom Field Schema
```

## `pd field schema list`

List PagerDuty Custom Field Schemas

```
USAGE
  $ pd field schema list

FLAGS
  -b, --useauth=<value>    Use the saved REST API token with this alias
  -d, --delimiter=<value>  [default:
                           ] Delimiter for fields that have more than one value
  -h, --help               Show CLI help.
  -j, --json               output full details as JSON
  -k, --keys=<value>...    Additional fields to display. Specify multiple times for multiple fields.
  -p, --pipe               Print field ID's only to stdout, for use with pipes.
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
  List PagerDuty Custom Field Schemas
```

## `pd field schema listfields`

List Fields in a PagerDuty Custom Field Schema

```
USAGE
  $ pd field schema listfields

FLAGS
  -b, --useauth=<value>    Use the saved REST API token with this alias
  -d, --delimiter=<value>  [default:
                           ] Delimiter for fields that have more than one value
  -h, --help               Show CLI help.
  -i, --id=<value>         (required) The ID of the schema to show fields for
  -j, --json               output full details as JSON
  -k, --keys=<value>...    Additional fields to display. Specify multiple times for multiple fields.
  -p, --pipe               Print field ID's only to stdout, for use with pipes.
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
  List Fields in a PagerDuty Custom Field Schema
```

## `pd field schema removefield`

Remove a Field from a PagerDuty Custom Field Schema

```
USAGE
  $ pd field schema removefield

FLAGS
  -b, --useauth=<value>   Use the saved REST API token with this alias
  -f, --field_id=<value>  (required) The ID of the field to remove from the schema.
  -h, --help              Show CLI help.
  -i, --id=<value>        (required) The ID of the schema to delete a field from
  --debug                 Print REST API call debug logs
  --token=<value>         Ignore the saved configuration and use this token

DESCRIPTION
  Remove a Field from a PagerDuty Custom Field Schema
```
