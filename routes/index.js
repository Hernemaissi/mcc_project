var express = require('express');
var gapi = require('../lib/gapi');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  var locals = {
        title: 'This is my sample app',
		url: gapi.url
      };
  res.render('index.jade', locals);
});

/* GET import page. */
router.post('/import', function(req, res) {
  console.log("Imported!");
  console.log(req.body.token);
  var code = req.body.token;
  gapi.client.getToken(code, function(err, tokens){
    console.log(tokens);
    
  });
  var locals = {
        title: 'This is my sample app',
		url: gapi.url
      };
  res.render('index.jade', locals);
});

module.exports = router;
