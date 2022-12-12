#!/usr/bin/env python3

import sys
import csv
import json
import subprocess
import argparse
from datetime import datetime
from decimal import Decimal

def runcmd(cmd):
  r = subprocess.run(cmd, shell=True, capture_output=True)
  try:
    return json.loads(r.stdout)
  except:
    print(r.stderr)
    return None

parser = argparse.ArgumentParser('get alert compression stats')
parser.add_argument('-s', '--start_time', help="The start of the time range you want to search", default='30 days ago')
parser.add_argument('-e', '--end_time', help="The end of the time range you want to search", default='now')
parser.add_argument('-o', '--output_file', help="File to write CSV results to", required=True)
args = parser.parse_args()

r = subprocess.run(f"pd util timestamp {args.start_time}", shell=True, capture_output=True)
start = r.stdout.decode('utf-8').rstrip()
r = subprocess.run(f"pd util timestamp {args.end_time}", shell=True, capture_output=True)
end = r.stdout.decode('utf-8').rstrip()

print(f"Getting services... ", file=sys.stderr, end='', flush=True)
services = runcmd("pd service list -j")
print(f"got {len(services)}", file=sys.stderr)
counts_by_service = {
  service['id']: {
    "name": service['name'],
    "incidents": 0,
    "incidents_with_alerts": 0,
    "alerts": 0,
    "ttr_seconds": 0
  }
  for service in services
}

cmd = f"pd rest fetch -e incidents -P since={start} -P until={end} -P 'statuses[]=resolved'"

print(f"Getting incidents from {start} until {end}... ", file=sys.stderr, end='', flush=True)
incidents = runcmd(cmd)
print(f"got {len(incidents)}", file=sys.stderr)

for incident in incidents:
  service_id = incident['service']['id']
  service_name = incident['service']['summary']
  alert_count = incident['alert_counts']['all']
  created_at = datetime.fromisoformat(incident['created_at'].rstrip('Z'))
  resolved_at = datetime.fromisoformat(incident['last_status_change_at'].rstrip('Z'))
  ttr_seconds = int(resolved_at.timestamp()) - int(created_at.timestamp())

  counts_by_service[service_id]['name'] = service_name
  counts_by_service[service_id]['incidents'] += 1
  counts_by_service[service_id]['alerts'] += alert_count
  counts_by_service[service_id]['ttr_seconds'] += ttr_seconds
  if alert_count > 0:
    counts_by_service[service_id]['incidents_with_alerts'] += 1

rows = []
for service_id, service_counts in counts_by_service.items():
  rows.append({
    "Service ID": service_id,
    "Service Name": service_counts['name'],
    "# Incidents": service_counts['incidents'],
    "# Alerts": service_counts['alerts'],
    "# Incidents with alerts": service_counts['incidents_with_alerts'],
    "Alert compression %": round(Decimal(100 * (1 - service_counts['incidents_with_alerts'] / service_counts['alerts'])), 2) if service_counts['alerts'] > 0 else '',
    "TTR seconds": service_counts['ttr_seconds'],
    "MTTR seconds": round(Decimal(service_counts['ttr_seconds'] / service_counts['incidents']), 0) if service_counts['incidents'] > 0 else '',
  })

f = open(args.output_file, "w")
csvwriter = csv.DictWriter(f, fieldnames=rows[0].keys())
csvwriter.writeheader()
csvwriter.writerows(rows)
