var express = require('express'),
  path = require('path'),
  logger = require('morgan'),
  cookieParser = require('cookie-parser'),
  mongoskin = require('mongoskin'),
  bodyParser = require('body-parser'),
  db = mongoskin.db('mongodb://@localhost:27017/mcc_data', {safe:true}),
  contacts = require('./routes/contacts'),
  groups = require('./routes/groups'),
  gapi = require('./lib/gapi'),
  exp = require('./lib/export'),
  app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Make our db accessible to our router
app.use(function(req,res,next){
  req.db = db;
  next();
});

app.use('/api/contacts', contacts);
app.use('/api/groups', groups);
app.use(express.static(__dirname + '/client/public'));

app.post('/export', function(req, res) {
  var code = req.body.token;
  exp.exp(code);
  var locals = {
        title: 'This is my sample app',
		url: gapi.url
      };
  res.render('import.jade', locals);
});

/* POST import page. */
app.post('/import', function(req, res) {
  console.log("Imported!");
  console.log(req.body.token);
  var code = req.body.token;
  gapi.client.getToken(code, function(err, tokens){
    console.log(tokens);
    var client = require('gdata-js')(gapi.client_id, gapi.client_secret);
	client.setToken({ access_token: tokens["access_token"], refresh_token: tokens["refresh_token"] });
	client.getFeed('https://www.google.com/m8/feeds/contacts/default/full', function (err, result) {
      for(var i in result.feed.entry) {
	    var entry_name = JSON.stringify(result.feed.entry[i].title.$t);
		entry_name = (entry_name === "\"\"") ? "" : entry_name.replace(/"/g, "");
		var entry_email = (result.feed.entry[i].gd$email === undefined) ? "" : JSON.stringify(result.feed.entry[i].gd$email[0].address).replace(/"/g, "");
		var entry_phone = (result.feed.entry[i].gd$phoneNumber === undefined) ? "GOOGLE" : JSON.stringify(result.feed.entry[i].gd$phoneNumber[0].uri).replace(/"/g, "");
		if (entry_name.length > 0 && entry_email.length > 0) {
	      var data = {};
		  data.name = entry_name;
		  data.email = entry_email;
		  data.phone = entry_phone;
		  console.log(data);
		  req.db.collection('contactcollection').insert(data, function(err, result) {
		    if (err) throw err;
			if (result) console.log('Added!');
		  });
		}
      }
	  });
  });
  var locals = {
        title: 'This is my sample app',
		url: gapi.url
      };
  res.render('import.jade', locals);
});


app.get('*', function(req, res){
  var locals = {
		url: gapi.url
      };
  console.log(locals);
  res.render('index', locals);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res) {
    res.status(err.status || 500);
    res.render('error', {
    message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
