var express = require('express'),
  router = express.Router(),
  _ = require('lodash-node/underscore');

var respondResult = function(status, res, err, result){
    if(err) { throw err; }
    console.log("Responding with: ", result);
    res.json(result).status(status);
  },
  respondResultOk = _.partial(respondResult, 200),
  respondResultCreated = function(res, err, result){
    respondResult(201, res, err, result[0]);
  };

/* GET users listing. */
router.get('/', function(req, res) {
  req.db.collection('contactcollection').find().toArray(_.partial(respondResultOk, res));
});

router.get('/search', function(req, res) {
  console.log("Search: " + req.query.q);
  var q = new RegExp(".*" + req.query.q + ".*", 'i');
  req.db.collection('contactcollection').find({name: q}).toArray(_.partial(respondResultOk, res));
});


router.get('/:id', function(req, res) {
  console.log("Fetch: " + req.params.id);
  req.db.collection('contactcollection').findById(req.params.id, _.partial(respondResultOk, res));
});

router.post('/', function(req, res) {
  var data = _.pick(req.body, 'name', 'phone', 'email');
  console.log("Create: ", data);
  req.db.collection('contactcollection').insert(data, _.partial(respondResultCreated, res));
});

router.delete('/:id', function(req, res) {
  console.log("Delete: " + req.params.id);
  req.db.collection('contactcollection').removeById(req.params.id, _.partial(respondResultOk, res));
});




module.exports = router;