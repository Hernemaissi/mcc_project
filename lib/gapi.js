var googleapis = require('googleapis');
    OAuth2Client = googleapis.auth.OAuth2;
    client = '691369167148-clb4cllug1aptbs1tf1v93q416bhnlak.apps.googleusercontent.com';
    secret = 'zSjM9ccao44XGs8Aj-sfaPF0';
    redirect = 'urn:ietf:wg:oauth:2.0:oob';
    oauth2Client = new OAuth2Client(client, secret, redirect);
	
	var calendar_auth_url = oauth2Client.generateAuthUrl({
     access_type: 'offline',
     scope: 'https://www.google.com/m8/feeds'
    });

exports.ping = function() {
    console.log('pong');
};

exports.url = calendar_auth_url;
exports.client = oauth2Client;