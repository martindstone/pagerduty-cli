#!/usr/bin/env python3

import csv
import json
import subprocess
import argparse

parser = argparse.ArgumentParser('Get users with tags')
parser.add_argument('-o', '--output_file', help="File to write CSV results", required=True)
args = parser.parse_args()

def runcmd(cmd):
  r = subprocess.run(cmd, shell=True, capture_output=True)
  return json.loads(r.stdout)

print(f"Getting users... ", end='', flush=True)
users = runcmd(f"pd user:list -j")
print(f"got {len(users)}")

rows = []
for user in users:
  print(f"Getting tags for {user['email']}... ", end='', flush=True)
  user['tags'] = runcmd(f"pd rest:fetch -e users/{user['id']}/tags")
  print(f"got {len(user['tags'])}")
  rows.append([
    user['id'],
    user['name'],
    user['email'],
    user['role'],
    "\n".join([t['summary'] for t in user['teams']]),
    "\n".join([t['summary'] for t in user['tags']])
  ])

f = open(args.output_file, "w")
w = csv.writer(f)
w.writerow(["User ID", "User Name", "User Email", "User Role", "Team Names", "Tag Names"])
w.writerows(rows)