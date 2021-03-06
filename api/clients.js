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
  .catch(err => { console.error(err.message); res.sendStatus(500) });
});



router.post('/new', (req, res) => {
  const newClient = req.body.client;

  db.collection('clients').insertOne(newClient)
  .then(o => res.send({ ok: true, newClient: o.ops[0]}))
  .catch(err =>
    res.status(err.code === 121 ? 400 : 500)
    .json({ok: false, reason: err.message })
  );
});



router.put('/:id', async (req, res) => {
  const updatedClient = req.body.client;
  if(!updatedClient) { res.sendStatus(400); return; }

  try{

    const oldClientName = await db.collection('clients').findOne({_id: ObjectId(req.params.id)}, {_id: 0, name:1});
    console.log("oldClient: " + oldClientName.name);

    let query = await db.collection('clients').findOneAndUpdate(
      { _id: ObjectId(req.params.id) },
      { $set: updatedClient },
      { returnOriginal: false }
    );
    
    if(query.lastErrorObject.updatedExisting)
    {
      res.send({ok: true, updatedClient: query.value});
    } else {
      res.status(404).json({ ok: false, reason: 'Not found' });
    }
    // .then(defaultUpdateHandler(res));
    // .catch(defaultWriteCatch(res));
  

  await db.collection('tickets')
  .updateMany(
    {client: oldClientName.name},
    {$set: {client: updatedClient.name} }
  );
  } catch{
    defaultWriteCatch(res);
  }
    // db.collection('tickets')
    // .aggregate([
    //   {$match: { client: oldClientName }}])
    //   .forEach( function(doc) {
    //   do {
    //     db.collection("tickets").update({_id: doc._id},
    //                         {$set:{"client":updatedClient.name}});
    //   } while (db.getPrevError().n != 0);
    // });
  
});



router.post('/:id/requesters/new', (req, res) => {
  // Used for adding requesters on-the-fly when creating a ticket
  const newRequester = req.body.requester;

  db.collection('clients').findOneAndUpdate(
    { _id: ObjectId(req.params.id) },
    { $push: { requesters: newRequester } },
    { returnOriginal: false }
  )
  .then(defaultUpdateHandler(res))
  .catch(defaultWriteCatch(res))
});



// Default handlers
let defaultUpdateHandler = res => o =>
  o.lastErrorObject.updatedExisting ?
    res.send({ok: true, updatedClient: o.value})
  : res.status(404).json({ ok: false, reason: 'Not found' });

const defaultWriteCatch = res => err =>
  res.status(err.code === 121 ? 400 : 500)
    .json({ok: false, reason: err.message });


module.exports = router;
