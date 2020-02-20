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


function getNextSequence(name) {
  return db.collection('counters').findOneAndUpdate(
    { _id: name },
    { $inc: { seq: 1 } }
  )
  .then(res => res.value.seq);
}


router.post('/new', async (req, res) => { // async for await and get the id
  console.log(req.body);
  db.collection('tickets').insertOne({
    _id: await getNextSequence("ticketId"), // await for promise to get the id 
    status: 1,
    title: req.body.title,
    type: req.body.type,
    client: req.body.client,
    requester: req.body.requester,
    category: req.body.category,
    description: req.body.description,
    parentTicket: req.body.parentTicket,
    weight: req.body.weight,
    subTickets: [],
    progress: 0,
    created: Math.floor(Date.now() / 1000),
    last_edited: Math.floor(Date.now() / 1000),
    creator: "hardcode" // TODO recup token et nom de l'utilisateur
  })
  .then(result => {
    if(result.insertedCount == 1){
      res.send(result.ops[0]);
    } else{
      res.sendStatus(500);
    }
  })
  
});

module.exports = router;
