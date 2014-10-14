var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
  var db = req.db;
  var json_result = "{}";
  db.collection('usercollection').find().toArray(function(err, result) {
    if (err) throw err;
    console.log(result);
	json_result = result;
	res.json(json_result);
  });
});

router.get('/:name', function(req, res) {
  var db = req.db;
  var json_result = "{}";
  console.log("name: " + req.params.name);
  db.collection('usercollection').findOne({username: req.params.name}, function(err, result) {
    console.log(result);
	json_result = result;
	res.json(json_result);
  });
});


module.exports = router;
