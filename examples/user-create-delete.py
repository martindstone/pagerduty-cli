#!/usr/bin/env python3

import sys
import json
import subprocess
import datetime
import csv
from dateutil.relativedelta import relativedelta
import argparse

def runcmd(cmd):
  r = subprocess.run(cmd, shell=True, capture_output=True)
  return json.loads(r.stdout)

parser = argparse.ArgumentParser('Get users created/deleted')
parser.add_argument('-s', '--start_time', help="The start of the time range you want to search", default='30 days ago')
parser.add_argument('-e', '--end_time', help="The end of the time range you want to search", default='now')
parser.add_argument('-o', '--output_file', help="File to write CSV results", required=True)
args = parser.parse_args()

r = subprocess.run(f"pd util timestamp {args.start_time}", shell=True, capture_output=True)
start = datetime.datetime.fromisoformat(r.stdout.decode('utf-8').rstrip('Z\n'))
r = subprocess.run(f"pd util timestamp {args.end_time}", shell=True, capture_output=True)
end = datetime.datetime.fromisoformat(r.stdout.decode('utf-8').rstrip('Z\n'))

if start > end:
  print(f"Oops, {start} is later than {end}")
  sys.exit(1)

now = datetime.datetime.utcnow()
if end > now:
  end = now

if start > now:
  print(f"Oops, {start} is in the future")
  sys.exit(1)

records = []
range_start = start
while range_start < end:
  range_end = range_start + relativedelta(months=1)
  print(f"Getting audit records from {range_start.isoformat()}Z to {range_end.isoformat()}Z...", file=sys.stderr)
  r = runcmd(f"pd rest fetch -e audit/records -P since={range_start.isoformat()}Z -P until={range_end.isoformat()}Z" +
    " -P 'root_resource_types[]=users' -P 'actions[]=create' -P actions[]=delete")
  records.extend(r)
  range_start = range_start + relativedelta(months=1)

rows = []
for r in records:
  rows.append({
    'action': r['action'],
    'execution_time': r['execution_time'],
    'name': r['root_resource']['summary'],
    'id': r['root_resource']['id'],
  })

if (len(rows) == 0):
  print("Oops, no users were created/deleted in that time range")
  sys.exit(1)

f = open(args.output_file, 'w')
writer = csv.DictWriter(f, rows[0].keys())
writer.writeheader()
writer.writerows(rows)