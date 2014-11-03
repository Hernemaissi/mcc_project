var express = require('express'),
  router = express.Router(),
  respond = require('./responders'),
  _ = require('lodash-node');

function groups(req){
  return req.db.collection('groupcollection');
}
function contacts(req){
  return req.db.collection('contactcollection');
}

/* GET groups listing. */
router.get('/', function(req, res) {
  groups(req).find().toArray(_.partial(respond.ok, res));
});

router.get('/:id', function(req, res) {
  groups(req).findById(req.params.id, _.partial(respond.ok, res));
});

router.post('/', function(req, res) {
  var data = _.assign({ members: [] }, _.pick(req.body, 'name'));
  groups(req).insert(data, _.partial(respond.created, res));
});

router.post('/:id/contacts/:contactId', function(req, res) {
  groups(req).updateById(req.params.id, {'$push': { members: req.params.contactId } }, function(err) {
    //TODO either remove or update group to be array to stay consistent when setting different group
    contacts(req).updateById(req.params.contactId, { '$set' : { group: req.params.id }}, function(err2) {
      res.updated(res, err || err2);
    });
  });
});

router.delete('/:id/contacts/:contactId', function(req, res) {
  groups(req).updateById(req.params.id, {'$pull': { members: req.params.contactId} }, function(err) {
    //TODO either remove or update group to be array to stay consistent when setting different group
    contacts(req).updateById(req.params.contactId, { '$unset' : { group: ""}}, function(err2) {
      respond.deleted(res, err || err2);
    });
  });
});

router.delete('/:id', function(req, res) {
  console.log("Delete: " + req.params.id);
  contacts(req).update({ group: req.params.id }, {'$unset' : { group: "" }}, { multi: true }, function(err) {
    //TODO either remove or update group to be array to stay consistent when setting different group
    groups(req).removeById(req.params.id, function(err2) {
      respond.deleted(res, err || err2);
    });
  });
});


module.exports = router;