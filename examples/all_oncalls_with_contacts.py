#!/usr/bin/env python3

import csv
import json
import subprocess
import argparse

parser = argparse.ArgumentParser('Get oncalls with contact info')
parser.add_argument('-s', '--start_time', help="The start of the time range you want to search", default='00:00 today')
parser.add_argument('-e', '--end_time', help="The end of the time range you want to search", default='00:00 in 1 day')
parser.add_argument('-o', '--output_file', help="File to write CSV results", required=True)
args = parser.parse_args()

def runcmd(cmd):
  r = subprocess.run(cmd, shell=True, capture_output=True)
  return json.loads(r.stdout)

print("Getting users... ", end='', flush=True)
users_list = runcmd('pd user:list -j')
print(f"got {len(users_list)}")

users = {x['id']: x for x in users_list}

print("Getting oncalls... ", end='', flush=True)
r = subprocess.run(f"pd util timestamp {args.start_time}", shell=True, capture_output=True)
start = r.stdout.decode('utf-8').strip()

r = subprocess.run(f"pd util timestamp {args.end_time}", shell=True, capture_output=True)
end = r.stdout.decode('utf-8').strip()

oncalls = runcmd(f"pd rest:fetch -e oncalls -P since={start} -P until={end}")
print(f"got {len(oncalls)}")

rows = [[
  "EP ID",
  "EP Name",
  "EP Level",
  "Start",
  "End",
  "User ID",
  "User Name",
  "User Email",
  "User Contact Methods"
]]

for oncall in oncalls:
  if oncall['user']['id'] in users:
    oncall_user = users[oncall['user']['id']]
  else:
    oncall_user = {
      'email': f"<Deleted user {oncall['user']['id']}>",
      'contact_methods': [],
    }
  contacts = [f"{x['type'].split('_')[0]}: {x['address']}" for x in oncall_user['contact_methods']]
  contacts_str = ', '.join(contacts)
  rows.append([
    oncall['escalation_policy']['id'],
    oncall['escalation_policy']['summary'],
    oncall['escalation_level'],
    oncall['start'] if oncall['start'] else 'none',
    oncall['end'] if oncall['end'] else 'none',
    oncall['user']['id'],
    oncall['user']['summary'],
    oncall_user['email'],
    contacts_str
  ])

f = open(args.output_file, "w")
w = csv.writer(f)
w.writerows(rows)
print(f"Wrote {len(oncalls)} oncalls to {args.output_file}.")