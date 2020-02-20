const express = require('express');
const router = express.Router();

var db;
require('./db').connection.then(connector => db = connector.db);


router.get('/', (req, res) => {
  db.collection('tickets')
  .find(
    {
      parentTicket: null
    },
    {
      projection: {
        description: false,
        subTickets: false
      }
    }
  )
  .toArray()
  .then(arr => res.send(arr))
  .catch(err => res.sendStatus(500));
});


router.get('/:id', (req, res) => {
  db.collection('tickets').aggregate([
    {$match: { _id: parseInt(req.params.id) }},
    {$lookup: {
      from:"tickets",
      localField:"subTickets",
      foreignField:"_id",
      as:"subTickets"
    }}
  ])
  .next()
  .then(obj => obj ? res.send(obj) : res.sendStatus(404))
  .catch(err => res.sendStatus(500));
});


module.exports = router;
