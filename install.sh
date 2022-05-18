#!/bin/bash
{
    set -e

    echoerr() { echo "$@" 1>&2; }

    printf "WARNING: This installation will overwrite /usr/local/lib/pd and /usr/local/bin/pd. Continue? (y/N) "
    read yn
    if [ "$yn" != 'y' ] && [ "$yn" != 'Y' ]; then
      echo "Aborting."
      exit 1
    fi
    SUDO=''
    if [ "$(id -u)" != "0" ]; then
      SUDO='sudo'
      echo "This script requires superuser access."
      echo "You will be prompted for your password by sudo."
      # clear any previous sudo permission
      sudo -k
    fi

    case ":$PATH:" in
      *:/usr/local/bin:*);;
      *)
        echoerr "Your path is missing /usr/local/bin, you need to add this to use this installer."
        exit 1
        ;;
    esac


    # run inside sudo
    $SUDO bash <<SCRIPT
  set -e

  echoerr() { echo "\$@" 1>&2; }

  if [ "\$(uname)" == "Darwin" ]; then
    OS=darwin
  elif [ "\$(expr substr \$(uname -s) 1 5)" == "Linux" ]; then
    OS=linux
  else
    echoerr "This installer is only supported on Linux and MacOS"
    exit 1
  fi

  ARCH="\$(uname -m)"
  if [ "\$ARCH" == "x86_64" ]; then
    ARCH=x64
  elif [[ "\$ARCH" == arm64 && "\$OS" == darwin ]]; then
    ARCH=arm64
  elif [[ "\$ARCH" == arm* ]]; then
    ARCH=arm
  else
    echoerr "unsupported arch: \$ARCH"
    exit 1
  fi

  mkdir -p /usr/local/lib
  cd /usr/local/lib
  rm -rf pd
  URL=https://ms-pagerduty-cli.s3-us-west-2.amazonaws.com/channels/stable/pd-\$OS-\$ARCH.tar.gz
  TAR_ARGS="xz"
  echo "Installing CLI from \$URL"
  if [ \$(command -v curl) ]; then
    curl "\$URL" | tar "\$TAR_ARGS"
  else
    wget -O- "\$URL" | tar "\$TAR_ARGS"
  fi
  # delete old pd bin if exists
  rm -f \$(command -v pd) || true
  rm -f /usr/local/bin/pd
  ln -s /usr/local/lib/pd/bin/pd /usr/local/bin/pd

  # on alpine (and maybe others) the basic node binary does not work
  # remove our node binary and fall back to whatever node is on the PATH
  /usr/local/lib/pd/bin/node -v || rm /usr/local/lib/pd/bin/node

SCRIPT
  # test the CLI
  LOCATION=$(command -v pd)
  echo "pd installed to $LOCATION"
  pd version
}