var express = require('express');
var router = express.Router();
_ = require('lodash-node/underscore');

/* GET groups listing. */
router.get('/', function(req, res) {
  var groups = req.db.collection('groupcollection');
  var json_result = "{}";
  groups.find().toArray(function(err, result) {
    if (err) { throw err; }
    console.log(result);
	json_result = result;
	res.json(json_result);
  });
});

router.get('/:id', function(req, res) {
  var groups = req.db.collection('groupcollection');
  var json_result = "{}";
  groups.findById(req.params.id, function(err, result) {
    console.log(result);
	json_result = result;
	res.json(json_result);
  });
});

router.post('/', function(req, res) {
  var groups = req.db.collection('groupcollection');
  var data = _.pick(req.body, 'name');
  data.members = [];
  console.log(data);
  groups.insert(data, function(err, result) {
    console.log(result);
	json_result = result;
	res.json(json_result);
  });
});

router.put('/:id', function(req, res) {
  var groups = req.db.collection('groupcollection');
  var data = _.pick(req.body, 'add', 'contact_id' );
  json_result = "";
  
  if (data.add) {
    groups.updateById(req.params.id, {'$push': { members: data.contact_id} }, function(err) {
	  req.db.collection('contactcollection').updateById(data.contact_id, { '$set' : {group: req.params.id}}, function(err) {});
      res.send("Added member");
    });
  } else {
    groups.updateById(req.params.id, {'$pull': { members: data.contact_id} }, function(err, result) {
	  req.db.collection('contactcollection').updateById(data.contact_id, { '$unset' : { group: ""}}, function(err) {});
      res.send("Removed member");
    });
  }
});

router.delete('/:id', function(req, res) {
  var groups = req.db.collection('groupcollection');
  var contacts = req.db.collection('contactcollection');
  console.log("Delete: " + req.params.id);
  contacts.update({ group: req.params.id }, {'$unset' : { group: "" }}, { multi: true }, function(err) {});
  groups.removeById(req.params.id, function(err, result) {
    if(err) { throw err; }
	res.json(result);
  });
});


module.exports = router;