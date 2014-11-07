gapi = require('./gapi');
xml = require('./xml_template');

exports.exp = function(code) {
	console.log("Token is: " + code);
	gapi.client.getToken(code, function(err, tokens){
	  var access = tokens["access_token"];
	  var url = '/m8/feeds/contacts/default/full?oauth_token=' + access;
	  var headers = {
        'Content-Type': 'application/atom+xml; charset=UTF-8; type=feed',
		'GData-Version': '3.0'
      };

      var options = {
        host: 'www.google.com',
        port: 443,
        path: url,
        method: 'POST',
        headers: headers
      };
	  
	  var https = require('https');
	  mongoskin = require('mongoskin');
	  db = mongoskin.db('mongodb://@localhost:27017/mcc_data', {safe:true});
      db.collection('contactcollection').find().toArray(function(err, result) {
	    for (var i in result) {
	      var req = https.request(options, function(res) {
            res.setEncoding('utf-8');
		    var responseString = '';
		
		    res.on('data', function(data) {
              responseString += data;
            });
		
		    res.on('end', function() {
              console.log(responseString);
            });
          });
	  
	      req.on('error', function(e) {
	        console.log('There was error:' + e);
          });
	  
	      
		  var data = xml.template;
		  var entry = result[i]
		  var name = entry.name;
		  var gname = name.split(" ")[0];
	      var fname = name.split(" ")[1];
		  var email = entry.email;
		  data = data.replace(/%gname/g, gname);
	      data = data.replace(/%fname/g, fname);
	      data = data.replace(/%email/g, email);
		  console.log(name);
		  console.log(data);
		  req.write(data);
          req.end();
		}
	  });
	});
}