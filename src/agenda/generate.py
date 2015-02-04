#!/usr/bin/env python
import json
agenda = {
    'duration': '00:30:00',
    'slides': '12',
    'title': 'A Gentle Introduction to SGSN-MME Infra',
    'children': [
        {'title': 'Who Are SGSN-MME Infra', 'start': 1, 'end': 5},
        {'title': 'What SGSN-MME Infra Support', 'start': 6, 'end': 6},
        {'title': 'When You Need To Contact Infra', 'start': 7, 'end': 7},
        {'title': 'How To Contact Infra', 'start': 8, 'end': 8},
        {'title': 'How To Use Redmine', 'start': 9, 'end': 9},
        {'title': 'How Proposal Is Handled', 'start': 10, 'end': 11},
        {'title': 'Question And Answer', 'start': 12, 'end': 12},
    ],
}
print json.dumps(agenda)
