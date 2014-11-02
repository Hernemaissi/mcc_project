
var _ = require('lodash-node/underscore');

function respondResult(status, res, err, result){
  if(err) { throw err; }
  console.log("Responding with: ", result);
  res.json(result).status(status);
}

function respondResultHead(status, res, err){
  if(err) { throw err; }
  console.log("Responding with status: " + status);
  res.status(status).end();
}

module.exports = {
  result: respondResult,
  ok: _.partial(respondResult, 200),
  created: function(res, err, result){
    respondResult(201, res, err, result[0]);
  },
  updated: _.partial(respondResultHead, 200),
  deleted: _.partial(respondResultHead, 200)
};