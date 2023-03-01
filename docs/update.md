`pd update`
===========

update the pd CLI

* [`pd update [CHANNEL]`](#pd-update-channel)

## `pd update [CHANNEL]`

update the pd CLI

```
USAGE
  $ pd update [CHANNEL] [-a] [-v <value> | -i] [--force]

FLAGS
  -a, --available        Install a specific version.
  -i, --interactive      Interactively select version to install. This is ignored if a channel is provided.
  -v, --version=<value>  Install a specific version.
  --force                Force a re-download of the requested version.

DESCRIPTION
  update the pd CLI

EXAMPLES
  Update to the stable channel:

    $ pd update stable

  Update to a specific version:

    $ pd update --version 1.0.0

  Interactively select version:

    $ pd update --interactive

  See available versions:

    $ pd update --available
```

_See code: [@oclif/plugin-update](https://github.com/oclif/plugin-update/blob/v3.1.4/src/commands/update.ts)_
