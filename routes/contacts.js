var express = require('express');
var router = express.Router();
var _ = require('lodash-node');

var respondResult = function(status, err, result){
    if(err) { throw err; }
    console.log(result);
    res.json(result).status(status);
  },
  respondResultOk = _.partial(respondResult, 200)
  respondResultCreated = _.partial(respondResult, 201);

/* GET users listing. */
router.get('/', function(req, res) {
  req.db.collection('contactcollection').find().toArray(respondResultOk);
});

router.get('/search', function(req, res) {
  console.log("Search: " + req.query.q);
  var q = new RegExp(".*" + req.query.q + ".*", 'i');
  req.db.collection('contactcollection').find({name: q}).toArray(respondResultOk);
});


router.get('/:id', function(req, res) {
  console.log("Fetch: " + req.params.id);
  req.db.collection('contactcollection').findById(req.params.id, respondResultOk);
});

router.post('/', function(req, res) {
  var data = _.pick(req.body, 'name', 'phone', 'email');
  req.db.collection('contactcollection').insert(data, respondResultCreated);
});

router.delete('/:id', function(req, res) {
  console.log("Delete: " + req.params.id);
  req.db.collection('contactcollection').removeById(req.params.id, respondResultOk);
});




module.exports = router;