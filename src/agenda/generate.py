#!/usr/bin/env python
import json
agenda = {
    'duration': '00:30:00',
    'slides': '12',
    'title': 'A Gentle Introduction to SGSN-MME Infra',
    'children': [
        {'title': 'Who Are SGSN-MME Infra?', 'start': 2, 'end': 3},
        {'title': 'What SGSN-MME Infra Support?', 'start': 4, 'end': 4},
        {'title': 'When You Need To Contact Infra?', 'start': 5, 'end': 5},
        {'title': 'How To Contact Infra', 'children':
            [
                {'title': 'Handle New Requirement', 'start': '6', 'end': '8'},
                {'title': 'Handle Bug', 'start': '9', 'end': '9'},
                {'title': 'Handle Support', 'start': '10', 'end': '10'},
            ]},
        {'title': 'Infra Under The Hood', 'start': 11, 'end': 11},
        {'title': 'Question And Answer', 'start': 12, 'end': 12},
    ],
}
print json.dumps(agenda)
