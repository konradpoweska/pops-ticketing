const express = require('express');
const router = express.Router();
const ObjectId = require('mongodb').ObjectId;

var db;
require('./db').connection.then(connector => db = connector.db);


router.get('/', (req, res) => {
  db.collection('users')
  .find()
  .toArray()
  .then(arr => res.send(arr))
  .catch(err => res.sendStatus(500));
});


router.get('/technicians/', (req, res) => {
  db.collection('users').find({rights:"TECHNICIAN"}
  )
  .toArray()
  .then(arr => res.send(arr))
  .catch(err => res.sendStatus(500));
});



router.get('/:id', (req, res) => {
  db.collection('users').findOne({
    _id: ObjectId(req.params.id)
  })
  .then(obj => obj ? res.send(obj) : res.sendStatus(404))
  .catch(err => { console.error(err.message); res.sendStatus(500) });
});



router.post('/new', async(req, res) => {
  const newUser = req.body.user;
  
  db.collection('users').insertOne(newUser)
  .then(o => res.send({ ok: true, newUser: o.ops[0]}))
  .catch(err =>
    res.status(err.code === 121 ? 400 : 500)
    .json({ok: false, reason: err.message })
  );
});



router.put('/:id', async (req, res) => {
  const updatedUser = req.body.user;
  if(!updatedUser) { res.sendStatus(400); return; }

  try{

    const oldUserName = await db.collection('users').findOne({_id: ObjectId(req.params.id)}, {_id: 0, name:1});
    console.log("oldUser: " + oldUserName.name);

    let query = await db.collection('users').findOneAndUpdate(
      { _id: ObjectId(req.params.id) },
      { $set: updatedUser },
      { returnOriginal: false }
    );
    
    if(query.lastErrorObject.updatedExisting)
    {
      res.send({ok: true, updatedUser: query.value});
    } else {
      res.status(404).json({ ok: false, reason: 'Not found' });
    }
    // .then(defaultUpdateHandler(res));
    // .catch(defaultWriteCatch(res));
  

  await db.collection('tickets')
  .updateMany(
    {creator: oldUserName.name},
    {$set: {creator: updatedUser.name} }
  );
  } catch{
    defaultWriteCatch(res);
  }
    // db.collection('tickets')
    // .aggregate([
    //   {$match: { client: oldUserName }}])
    //   .forEach( function(doc) {
    //   do {
    //     db.collection("tickets").update({_id: doc._id},
    //                         {$set:{"client":updatedUser.name}});
    //   } while (db.getPrevError().n != 0);
    // });
  
});


// Default handlers
let defaultUpdateHandler = res => o =>
  o.lastErrorObject.updatedExisting ?
    res.send({ok: true, updatedUser: o.value})
  : res.status(404).json({ ok: false, reason: 'Not found' });

const defaultWriteCatch = res => err =>
  res.status(err.code === 121 ? 400 : 500)
    .json({ok: false, reason: err.message });


module.exports = router;
