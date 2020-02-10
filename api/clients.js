const express = require('express');
const router = express.Router();
const ObjectId = require('mongodb').ObjectId;

var db;
require('./db').connection.then(connector => db = connector.db);


router.get('/', (req, res) => {
  db.collection('clients')
  .find()
  .toArray()
  .then(arr => res.send(arr))
  .catch(err => res.sendStatus(500));
});


router.get('/:id', (req, res) => {
  db.collection('clients').findOne({
    _id: ObjectId(req.params.id)
  })
  .then(obj => obj ? res.send(obj) : res.sendStatus(404))
  .catch(err => res.sendStatus(500));
});


module.exports = router;
