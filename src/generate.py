#!/usr/bin/env python

import json

agenda = {
    'duration': '01:11:11',
    'title': 'Infra workflows',
    'children': [
      {'title': 'subtitle1', 'start': 1, 'end': 5},
      {'title': 'subtitle2', 'children': 
        [
          {'title': 'subsubtitle1', 'start': '6', 'end': '7'},
          {'title': 'subsubtitle2', 'start': '8', 'end': '10'},
        ]},
      {'title': 'subtitle3', 'children':
        [
          {'title': 'subsubtitle3', 'start': '11', 'end' : '13'}
        ]}
    ],
}

print json.dumps(agenda)
