# PagerDuty CLI Example Scripts

Here's a somewhat random assortment of scripts that use PagerDuty CLI To do stuff. Maybe they can be a starting point for your own cool thing!

## alert_compression.py

_Get alert compression stats_

options:
```
  -s START_TIME, --start_time START_TIME
        The start of the time range you want to search
  -e END_TIME, --end_time END_TIME
        The end of the time range you want to search
  -o OUTPUT_FILE, --output_file OUTPUT_FILE
        File to write CSV results to
```

## all_oncalls_with_contacts.py

_Get oncalls with contact info_

options:
```
  -s START_TIME, --start_time START_TIME
        The start of the time range you want to search
  -e END_TIME, --end_time END_TIME
        The end of the time range you want to search
  -o OUTPUT_FILE, --output_file OUTPUT_FILE
        File to write CSV results
```

## basic_incident_details.py

_Get a list of basic incident details_

options:
```
  -o OUTPUT_FILE, --output_file OUTPUT_FILE
        File to write CSV results
  -s START, --start START
        The start of the time range for the incident list
  -e END, --end END
        The start of the time range for the incident list
```

## ep-rules-list-targets.py

_Get escalation policy rules with delay minutes and targets_

options:
```
  -o OUTPUT_FILE, --output_file OUTPUT_FILE
        File to write CSV results
```

## ep-tags.py

_Get escalation policies with teams and tags_

options:
```
  -o OUTPUT_FILE, --output_file OUTPUT_FILE
        File to write CSV results
```

## responders.py

_Get stats on incident responder responses_

options:
```
  -o OUTPUT_FILE, --output_file OUTPUT_FILE
        File to write CSV results
  -s START, --start START
        The start of the time range to look at
  -e END, --end END
        The end of the time range to look at
```

## schedule_coverage.py

_Get schedule coverage stats_

options:
```
  -s START_TIME, --start_time START_TIME
        The start of the time range you want to search
  -e END_TIME, --end_time END_TIME
        The end of the time range you want to search
  -o OUTPUT_FILE, --output_file OUTPUT_FILE
        File to write CSV results to
```

## snow_pass.py

_Change password on ServiceNow (v6.0) extensions_

options:
```
  -u USER, --user USER  User to change to
  -p PASSWORD, --password PASSWORD
        Password to change to
```

## team-users-and-tags.py

_Get teams with members and tags_

options:
```
  -o OUTPUT_FILE, --output_file OUTPUT_FILE
        File to write CSV results
```

## user-create-delete.py

_Get users created/deleted_

options:
```
  -s START_TIME, --start_time START_TIME
        The start of the time range you want to search
  -e END_TIME, --end_time END_TIME
        The end of the time range you want to search
  -o OUTPUT_FILE, --output_file OUTPUT_FILE
        File to write CSV results
```

## user-tags.py

_Get users with tags_

options:
```
  -o OUTPUT_FILE, --output_file OUTPUT_FILE
        File to write CSV results
```
