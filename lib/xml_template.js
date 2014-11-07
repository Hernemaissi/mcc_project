var xml = require('xml');
var xmlString = xml({
    'atom:entry':
    [
        {
            '_attr': {
                'xmlns:atom': 'http://www.w3.org/2005/Atom',
                'xmlns:gd': 'http://schemas.google.com/g/2005'
            }
        },
        {
            'atom:category': {
                '_attr': {
                    'scheme': 'http://schemas.google.com/g/2005#kind',
                    'term': 'http://schemas.google.com/contact/2008#contact'
                }
            }
        },
        {
            'gd:name': [
                { 'gd:givenName': '%gname' },
                { 'gd:familyName': '%fname' },
                { 'gd:fullName': '%gname %fname' }
            ]
        },
        {
            'atom:content': [
                {
                    '_attr': {
                        'type': 'text'
                    }
                },
                'Notes'
            ]
        },
        {
            'gd:email': {
                '_attr': {
                    'rel': 'http://schemas.google.com/g/2005#work',
                    'primary': 'true',
                    'address': '%email',
                    'displayName': '%gname'
                }
            }
        }
    ]
}, true);

exports.template = xmlString;