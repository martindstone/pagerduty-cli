#!/usr/bin/env python3

import csv
import datetime
import json
import subprocess
import argparse

parser = argparse.ArgumentParser('Get stats on incident responder responses')
parser.add_argument('-o', '--output_file', help="File to write CSV results", required=True)
parser.add_argument('-s', '--start', help="The start of the time range to look at", default="1 day ago")
parser.add_argument('-e', '--end', help="The end of the time range to look at", default="now")
args = parser.parse_args()

def runcmd(cmd):
  r = subprocess.run(cmd, shell=True, capture_output=True)
  try:
    return json.loads(r.stdout)
  except:
    print(r.stderr)
    return None

logs = runcmd(f"pd log --since '{args.start}' --until '{args.end}' -j")
logs = [x for x in logs if x['type'].startswith('responder')]
logs.reverse()

log_map = {}
for log in logs:
  incident_id = log['incident']['id']
  if not incident_id in log_map:
    log_map[incident_id] = {
      "requests": [],
      "logs": []
    }
  log_map[incident_id]['logs'].append(log)

for incident_id, v in log_map.items():
  logs = v['logs']
  for log in logs:
    if log['type'].startswith('responder_request'):
      v['requests'].append(log)
      v['requests'][-1]['responses'] = []
    else:
      for request in reversed(v['requests']):
        if "responder" in request and request['responder']['id'] == log['agent']['id']:
          request['responses'].append(log)
          break
        elif "responders_list" in request and len([x for x in request['responders_list'] if x['id'] == log['agent']['id']]) > 0:
          request['responses'].append(log)
          break

rows = [[
  "Incident ID",
  "Service",
  "Requested By",
  "Requested At",
  "Escalation Policy",
  "Responder",
  "Responded At",
  "Response",
  "Responded Via",
  "Time To Respond (Minutes)"
]]

log_map_finished = {incident_id: v['requests'] for incident_id, v in log_map.items()}
print(json.dumps(log_map_finished, indent=2))
for incident_id, requests in log_map_finished.items():
  for request in requests:
    if "responders_list" in request:
      requested_responders = request['responders_list']
    else:
      requested_responders = [request['responder']]
    for requested_responder in requested_responders:
      responder_summary = requested_responder['summary']
      if "escalation_policy" in request:
        responder_ep = request['escalation_policy']['summary']
      else:
        responder_ep = "User"
      responder_responses = [x for x in request['responses'] if x['agent']['id'] == requested_responder['id']]
      if len(responder_responses) == 0:
        response = ""
        responded_at = ""
        response_channel = ""
        response_time = ""
      else:
        if responder_responses[0]['type'].startswith("responder_accept"):
          response = "accepted"
        else:
          response = "declined"
        responded_at = responder_responses[0]['created_at']
        response_channel = responder_responses[0]['channel']['type']
        # Calculate minutes difference between requested datetime and response datetime
        drqs = datetime.datetime.strptime(request['created_at'],'%Y-%m-%dT%H:%M:%SZ')
        drsp = datetime.datetime.strptime(responder_responses[0]['created_at'],'%Y-%m-%dT%H:%M:%SZ')
        response_time = (drsp-drqs).total_seconds() / 60.0

      rows.append([
        incident_id,
        request['service']['summary'],
        request['agent']['summary'],
        request['created_at'],
        responder_ep,
        responder_summary,
        responded_at,
        response,
        response_channel,
        response_time
      ])

f = open(args.output_file, "w")
w = csv.writer(f)
w.writerows(rows)
print(f"Wrote {len(rows)} rows to {args.output_file}.")
print(rows)