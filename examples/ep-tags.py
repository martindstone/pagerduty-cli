#!/usr/bin/env python3

import csv
import json
import subprocess
import argparse

parser = argparse.ArgumentParser('Get escalation policies with teams and tags')
parser.add_argument('-o', '--output_file', help="File to write CSV results", required=True)
args = parser.parse_args()

def runcmd(cmd):
  r = subprocess.run(cmd, shell=True, capture_output=True)
  return json.loads(r.stdout)

print(f"Getting escalation policies... ", end='', flush=True)
eps = runcmd(f"pd ep:list -j")
print(f"got {len(eps)}")

rows = []
for ep in eps:
  print(f"Getting tags for {ep['name']}... ", end='', flush=True)
  ep['tags'] = runcmd(f"pd rest:fetch -e escalation_policies/{ep['id']}/tags")
  print(f"got {len(ep['tags'])}")
  rows.append([
    ep['id'],
    ep['name'],
    "\n".join([t['summary'] for t in ep['teams']]),
    "\n".join([t['summary'] for t in ep['tags']])
  ])

f = open(args.output_file, "w")
w = csv.writer(f)
w.writerow(["Escalation Policy ID", "Escalation Policy Name", "Team Names", "Tag Names"])
w.writerows(rows)