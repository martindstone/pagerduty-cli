#!/usr/bin/env python3

import sys
import csv
import json
import subprocess
import argparse

def runcmd(cmd):
  r = subprocess.run(cmd, shell=True, capture_output=True)
  try:
    return json.loads(r.stdout)
  except:
    print(r.stderr)
    return None

parser = argparse.ArgumentParser('Get schedule coverage stats')
parser.add_argument('-s', '--start_time', help="The start of the time range you want to search", default='now')
parser.add_argument('-e', '--end_time', help="The end of the time range you want to search", default='in 30 days')
parser.add_argument('-o', '--output_file', help="File to write CSV results to", required=True)
args = parser.parse_args()

r = subprocess.run(f"pd util timestamp {args.start_time}", shell=True, capture_output=True)
start = r.stdout.decode('utf-8').rstrip()
r = subprocess.run(f"pd util timestamp {args.end_time}", shell=True, capture_output=True)
end = r.stdout.decode('utf-8').rstrip()

print(f"Getting schedules... ", file=sys.stderr, end='', flush=True)
schedules = runcmd("pd schedule list -j")
print(f"got {len(schedules)}", file=sys.stderr)

cmd = f"pd rest fetch -e incidents -P since={start} -P until={end} -P 'statuses[]=resolved'"

full_schedules = []
print(f"Getting schedule details from {start} until {end}", end='', flush=True)
for schedule in schedules:
  r = runcmd(f"pd rest get -e schedules/{schedule['id']} -P since={start} -P until={end}")
  full_schedules.append(r['schedule'])
  print(".", end='', flush=True)

print(" done.")

rows = []
for schedule in full_schedules:
  rows.append({
    'id': schedule['id'],
    'name': schedule['summary'], 
    'coverage %': schedule['final_schedule']['rendered_coverage_percentage'],
  })

print(f"Writing {len(rows)} rows to {args.output_file}...", end='', flush=True)
f = open(args.output_file, "w")
csvwriter = csv.DictWriter(f, fieldnames=rows[0].keys())
csvwriter.writeheader()
csvwriter.writerows(rows)
