#!/usr/bin/env python3

import csv
import json
import subprocess
import argparse

parser = argparse.ArgumentParser('Get escalation policy rules with delay minutes and targets')
parser.add_argument('-o', '--output_file', help="File to write CSV results", required=True)
args = parser.parse_args()

def runcmd(cmd):
  r = subprocess.run(cmd, shell=True, capture_output=True)
  return json.loads(r.stdout)

print(f"Getting EPs... ", end='', flush=True)
eps = runcmd(f"pd rest fetch -e escalation_policies -P 'include[]=targets'")
print(f"got {len(eps)}")

rows = []
for ep in eps:
  for rule_idx, rule in enumerate(ep['escalation_rules']):
    for target in rule['targets']:
      if target['type'] == 'user':
        users = target['name']
        schedule_name = ''
        schedule_id = ''
      else:
        users = ', '.join([x['summary'] for x in target['users']])
        schedule_name = target['summary']
        schedule_id = target['id']
    rows.append([
      ep['id'],
      ep['summary'],
      rule_idx + 1,
      rule['escalation_delay_in_minutes'],
      schedule_id,
      schedule_name,
      users
    ])

f = open(args.output_file, "w")
w = csv.writer(f)
w.writerow([
  'EP ID',
  'EP Name',
  'EP Level',
  'Rule delay',
  'Target schedule ID',
  'Target schedule name',
  'Target users'
])
w.writerows(rows)