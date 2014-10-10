var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
  var db = req.db;
  var json_result = "{}";
  db.collection('contactcollection').find().toArray(function(err, result) {
    if (err) throw err;
    console.log(result);
	json_result = result;
	res.json(json_result);
  });
});

router.get('/search', function(req, res) {
  var db = req.db;
  var json_result = "{}";
  var q = new RegExp(".*" + req.query.q + ".*", 'i');
  db.collection('contactcollection').find({name: q}).toArray(function(err, result) {
    console.log(result);
	json_result = result;
	res.json(json_result);
  });
});


router.get('/:id', function(req, res) {
  var db = req.db;
  var json_result = "{}";
  console.log("name: " + req.params.id);
  db.collection('contactcollection').findById(req.params.id, function(err, result) {
    console.log(result);
	json_result = result;
	res.json(json_result);
  });
});

router.post('/', function(req, res) {
  var db = req.db;
  var name = req.body.name;
  var phone = req.body.phone;
  var email = req.body.email;
  db.collection('contactcollection').insert({name: name, email: email, phone: phone}, function(err, result) {
    if (err) throw err;
    if (result) console.log('Added!');
	res.json(result)
  });
});

router.delete('/:id', function(req, res) {
  var db = req.db;
  var json_result = "{}";
  console.log("name: " + req.params.id);
  db.collection('contactcollection').removeById(req.params.id, function(err, result) {
    console.log(result);
	res.send('Entry Deleted');
  });
});




module.exports = router;