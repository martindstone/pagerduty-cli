#!/usr/bin/env python3

import json
import subprocess
import argparse

parser = argparse.ArgumentParser('Change password on ServiceNow (v6.0) extensions')
parser.add_argument('-u', '--user', help="User to change to")
parser.add_argument('-p', '--password', help="Password to change to", required=True)
args = parser.parse_args()

def runcmd(cmd):
  r = subprocess.run(cmd, shell=True, capture_output=True)
  return json.loads(r.stdout)

if args.user is not None:
  print(f"Change user to {args.user} and pass to {args.password}")
else:
  print(f"Change pass to {args.password}")

print(f"Getting extensions... ", end='', flush=True)

# Extension schema "PBZUP2B" is SNOW v6. For a list of all extension schemas,
# run the following command:
# pd rest fetch -e extension_schemas -t -k id -k summary

extensions = runcmd(f"pd rest:fetch -e extensions -P extension_schema_id=PBZUP2B")
print(f"changing {len(extensions)} extensions", end='', flush=True)

for extension in extensions:
  body = {
    "extension": {
      "type": "webhook",
      "id": extension["id"],
      "name": extension["name"],
      "config": {
        "snow_password": args.password,
      },
      "extension_schema": extension["extension_schema"],
    }
  }
  if args.user is not None:
    body["extension"]["config"]["snow_user"] = args.user

  bodyJSON = json.dumps(body).replace('"', '\\"')
  r = subprocess.run(f"pd rest:put -e extensions/{extension['id']} -d \"{bodyJSON}\"", shell=True, capture_output=True)
  print('.', end='', flush=True)

print(" done.")
