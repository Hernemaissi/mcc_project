var express = require('express'),
  router = express.Router(),
  respond = require('./responders'),
  gapi = require('../lib/gapi'),
  _ = require('lodash-node/underscore');

/* GET users listing. */
router.get('/', function(req, res) {
  var locals = {
		url: gapi.url
      };
  req.db.collection('contactcollection').find().toArray(_.partial(respond.ok, res));
});

router.get('/search', function(req, res) {
  console.log("Search: " + req.query.q);
  var q = new RegExp(".*" + req.query.q + ".*", 'i');
  req.db.collection('contactcollection').find({name: q}).toArray(_.partial(respond.ok, res));
});


router.get('/:id', function(req, res) {
  console.log("Fetch: " + req.params.id);
  req.db.collection('contactcollection').findById(req.params.id, _.partial(respond.ok, res));
});

router.put('/:id', function(req, res) {
  console.log("Fetch: " + req.params.id);
  req.db.collection('contactcollection').updateById(req.params.id, _.partial(respond.updated, res));
});

router.post('/', function(req, res) {
  var data = _.pick(req.body, 'name', 'phone', 'email');
  console.log("Create: ", data);
  req.db.collection('contactcollection').insert(data, _.partial(respond.created, res));
});

router.delete('/:id', function(req, res) {
  console.log("Delete: " + req.params.id);
  req.db.collection('groupcollection').update({members: req.params.id}, {'$pull' : { members: req.params.id}}, { multi:true}, function(err) {
      if(err) { throw err; }
  });
  req.db.collection('contactcollection').removeById(req.params.id, _.partial(respond.deleted, res));
});




module.exports = router;