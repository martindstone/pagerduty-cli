#!/usr/bin/env python3

import csv
import json
import subprocess
import argparse

parser = argparse.ArgumentParser('Get integrations for all services')
parser.add_argument('-o', '--output_file', help="File to write CSV results", required=True)
args = parser.parse_args()

def runcmd(cmd):
  r = subprocess.run(cmd, shell=True, capture_output=True)
  return json.loads(r.stdout)

print(f"Getting services with integrations... ", end='', flush=True)
services = runcmd(f"pd rest fetch -e services -P \"include[]=integrations\"")
print(f"got {len(services)}")

rows = []
for service in services:
  for integration in service['integrations']:
    rows.append([
      service['id'],
      service['name'],
      integration['id'],
      integration['summary'],
      integration['type'],
      integration['integration_key'] if 'integration_key' in integration else integration['integration_email']
    ])

f = open(args.output_file, "w")
w = csv.writer(f)
w.writerow([
  'Service ID',
  'Service Name',
  'Integration ID',
  'Integration Name',
  'Integration Type',
  'Integration Key/Address',
])
w.writerows(rows)