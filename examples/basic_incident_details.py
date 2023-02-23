#!/usr/bin/env python3

import sys
import csv
import json
import subprocess
import argparse

parser = argparse.ArgumentParser('Get a list of basic incident details')
parser.add_argument('-o', '--output_file', help="File to write CSV results", required=True)
parser.add_argument('-s', '--start', help="The start of the time range for the incident list", default="1 day ago")
parser.add_argument('-e', '--end', help="The start of the time range for the incident list", default="now")
args = parser.parse_args()

def runcmd(cmd):
  try:
    r = subprocess.run(cmd, shell=True, capture_output=True)
    return json.loads(r.stdout)
  except:
    return None

print("Getting incidents... ", end='', flush=True)
incidents = runcmd(f"pd incident:list -s open -s closed --since \"{args.start}\" --until \"{args.end}\" -j")
if incidents is None or len(incidents) == 0:
  print("didn't get any")
  sys.exit(1)
print(f"got {len(incidents)}")

incident_log_cmd = "pd incident:log -j"
for incident in incidents:
  incident_log_cmd += f" -i {incident['id']}"

print("Getting incident logs... ", end='', flush=True)
incident_logs = runcmd(incident_log_cmd)
print(f"got {len(incident_logs)} log entries")

incident_logs.reverse()
incident_log_map = {}
for entry in incident_logs:
  entry_type = entry['type']
  incident_id = entry['incident']['id']
  if not incident_id in incident_log_map:
    incident_log_map[incident_id] = {
      "notes": []
    }
  if entry_type == 'acknowledge_log_entry':
    if not 'first_ack' in incident_log_map[incident_id]:
      incident_log_map[incident_id]['first_ack'] = entry['created_at']
      incident_log_map[incident_id]['first_ack_by_id'] = entry['agent']['id']
      incident_log_map[incident_id]['first_ack_by_summary'] = entry['agent']['summary']
  elif entry_type == 'resolve_log_entry':
    if not 'resolve' in incident_log_map[incident_id]:
      incident_log_map[incident_id]['resolve'] = entry['created_at']
      incident_log_map[incident_id]['resolve_by_id'] = entry['agent']['id']
      incident_log_map[incident_id]['resolve_by_summary'] = entry['agent']['summary']
  elif entry_type == 'annotate_log_entry':
    note_str = f"{entry['created_at']} {entry['agent']['summary']}: {entry['channel']['summary']}"
    incident_log_map[incident_id]['notes'].append(note_str)

rows = [[
  "Incident ID",
  "Incident number",
  "Incident title",
  "Incident created time",
  "Incident first acknowledgement time",
  "Incident first acknowledged by ID",
  "Incident first acknowledged by Summary",
  "Incident resolved time",
  "Incident resolved by ID",
  "Incident resolved by Summary",
  "Incident notes"
]]

for incident in incidents:
  rows.append([
    incident['id'],
    incident['incident_number'],
    incident['title'],
    incident['created_at'],
    incident_log_map[incident['id']]['first_ack'] if 'first_ack' in incident_log_map[incident['id']] else '',
    incident_log_map[incident['id']]['first_ack_by_id'] if 'first_ack_by_id' in incident_log_map[incident['id']] else '',
    incident_log_map[incident['id']]['first_ack_by_summary'] if 'first_ack_by_summary' in incident_log_map[incident['id']] else '',
    incident_log_map[incident['id']]['resolve'] if 'resolve' in incident_log_map[incident['id']] else '',
    incident_log_map[incident['id']]['resolve_by_id'] if 'resolve_by_id' in incident_log_map[incident['id']] else '',
    incident_log_map[incident['id']]['resolve_by_summary'] if 'resolve_by_summary' in incident_log_map[incident['id']] else '',
    '\n'.join(incident_log_map[incident['id']]['notes'])
  ])

f = open(args.output_file, "w")
w = csv.writer(f)
w.writerows(rows)
print(f"Wrote {len(incidents)} incidents to {args.output_file}.")