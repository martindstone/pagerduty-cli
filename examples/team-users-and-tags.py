#!/usr/bin/env python3

import csv
import json
import subprocess
import argparse

parser = argparse.ArgumentParser('Get teams with members and tags')
parser.add_argument('-o', '--output_file', help="File to write CSV results", required=True)
args = parser.parse_args()

def runcmd(cmd):
  r = subprocess.run(cmd, shell=True, capture_output=True)
  return json.loads(r.stdout)

print(f"Getting teams... ", end='', flush=True)
teams = runcmd(f"pd team:list -j")
print(f"got {len(teams)}")

rows = []
for team in teams:
  print(f"Getting users for {team['name']}... ", end='', flush=True)
  team['users'] = runcmd(f"pd rest:fetch -e teams/{team['id']}/members -P \"include[]=users\"")
  print(f"got {len(team['users'])}")

  print(f"Getting tags for {team['name']}... ", end='', flush=True)
  team['tags'] = runcmd(f"pd rest:fetch -e teams/{team['id']}/tags")
  print(f"got {len(team['tags'])}")
  rows.append([
    team['id'],
    team['name'],
    "\n".join([t['user']['email'] for t in team['users']]),
    "\n".join([t['summary'] for t in team['tags']])
  ])

f = open(args.output_file, "w")
w = csv.writer(f)
w.writerow(["Team ID", "Team Name", "User Emails", "Tag Names"])
w.writerows(rows)