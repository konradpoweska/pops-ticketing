const express = require('express');
const router = express.Router();
const e = require('./httpErrors');

var db;
require('./db').connection.then(connector => db = connector.db);


router.get('/', (req, res) => {
  db.collection('tickets')
  .find(
    {
      // TODO: custom filters supplied by client
      parentTicket: { $exists: false }
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
    { $lookup: {
      from: 'tickets',
      localField: 'subTickets._id',
      foreignField: '_id',
      as: 'joins.subTickets'
    } },
    { $lookup: {
      from: 'tickets',
      localField: 'parentTicket',
      foreignField: '_id',
      as: 'joins.parentTicket'
    } }
  ])
  .next()
  .then(doc => {
    if(doc === null) return null;
    const joins = doc.joins;
    delete doc.joins;
    joins.parentTicket = joins.parentTicket[0];
    return { doc, joins };
  })
  .then(obj => obj ? res.send(obj) : res.sendStatus(404))
  .catch(err => res.sendStatus(500));
});


async function updateParent(idToUpdate) {
  /* Function to recursively update progress and lastEdit of parent tickets. */
  // TODO: update status as well
  const updatedTickets = [];

  while(idToUpdate != null) {

    const toUpdate = await db.collection('tickets').aggregate([
      { $match: { _id: idToUpdate } },
      { $unwind: { path: "$subTickets" } },
      { $lookup: {
        from: 'tickets',
        localField: 'subTickets._id',
        foreignField: '_id',
        as: 'subTickets.doc'
      } },
      { $unwind: { path: '$subTickets.doc' } },
      { $project: {
        parentTicket: true,
        lastEdit: true,
        lastEditSub: "$subTickets.doc.lastEdit",
        totalWeight: "$subTickets.weight",
        totalProgress: { $multiply: ["$subTickets.weight", "$subTickets.doc.progress"] }
      } },
      { $group: {
        _id: "$_id",
        parentTicket: { $first: "$parentTicket" },
        lastEdit: { $first: "$lastEdit" },
        lastEditSub: { $max: "$lastEditSub" },
        totalWeight: { $sum: "$totalWeight" },
        totalProgress: { $sum: "$totalProgress" }
      } },
      { $project: {
        parentTicket: true,
        lastEdit: { $max: ["$lastEdit", "$lastEditSub"] },
        progress: { $divide: ["$totalProgress", "$totalWeight"] }
      } }
      // TODO: check if doable with $merge
    ]).next();

    await db.collection('tickets').updateOne(
      { _id: toUpdate._id },
      { $set: {
        progress: toUpdate.progress,
        lastEdit: toUpdate.lastEdit
      } }
    );

    updatedTickets.push({
      _id: toUpdate._id,
      progress: toUpdate.progress,
      lastEdit: toUpdate.lastEdit
    })

    idToUpdate = toUpdate.parentTicket;
  }

  return updatedTickets;
}


router.post('/new', async (req, res) => { // async for await and get the id
  try {
    const input = req.body.ticket;
    if(!input) throw new e.BadRequestError();

    if(input.subTickets) // type 1: ticket with sub-tickets
      input.progress = 0.0;

    else // type 2: need to parse supplied date fields
      for(let prop of ['estimatedDuration', 'plannedIntervention', 'actualDuration', 'counterStart'])
        if(input[prop])
          input[prop] = new Date(input[prop]);


    const hasParentTicket = input.hasOwnProperty('parentTicket');

    if(hasParentTicket) {
      let parentTicket = await db.collection('tickets').findOne({ _id: input.parentTicket }, { subTickets: true });
      if(!parentTicket) throw new e.BadRequestError("Parent ticket not found");
      if(!parentTicket.subTickets) throw new e.BadRequestError("Parent ticket cannot have sub-tickets");
    }

    const newId = (await db.collection('counters').findOneAndUpdate({ _id: 'ticketId' }, { $inc: { seq: 1 } })).value.seq;

    input._id = newId;
    input.created = new Date();
    input.lastEdit = new Date();
    input.status = "OPEN";
    input.creator = "Unknown (Yet)";

    const bulkOps = [ { insertOne: { document: input}} ];

    if(hasParentTicket) bulkOps.push({
      updateOne: {
        filter: { _id: input.parentTicket },
        update: { $push: { subTickets: { _id: newId, weight: 1 } } }
      }
    });

    await db.collection('tickets').bulkWrite(bulkOps);

    const updatedTickets = hasParentTicket ? await updateParent(input.parentTicket) : [];

    res.send({ ok: true, newTicket: input, updatedTickets });

  }
  catch(err) {
    if(err.code == 121) res.status(400); // Mongo Validation Error
    else if(err instanceof e.HttpError) res.status(err.httpCode);
    else { res.status(500); console.log(err); }

    res.json({ ok: false, reason: err.message });
  }
});
/*
_id=this.filters.idTicket;
status=this.filters.status;
created=this.filters.startDate OU {
  startDate=this.filters.startDate;
  endDate=this.filters.endDate;
}
clients=this.filters.client OU client=this.filters.client[0],
requester=this.filters.requester
*/
router.post("/search", async (req, res) => {
  let query = {};
  //console.log(req.body);
  if(!req.body.hasOwnProperty("subTickets")){
    query.parentTicket = {$exists: false};
  }
  if(req.body.hasOwnProperty("technician")){
    query.technician = req.body.technician;
  }
  if(req.body.hasOwnProperty("_id")){
    query._id = parseInt(req.body._id);
  }
  if(req.body.hasOwnProperty("status")){
    let int_status = parseInt(req.body.status);
    // 'OPEN', 'IN_PROGRESS', 'COMPLETED', 'CLOSED_SUCCESS', 'CLOSED_ABORTED', 'DELETED'
    if(int_status == 1){
      query.status = 'OPEN';
    } else if(int_status == 2){
      query.status = {$in: ['IN_PROGRESS', 'COMPLETED']};
    } else {
      query.status = {$in: ['CLOSED_SUCCESS', 'CLOSED_ABORTED', 'DELETED']};
    }
  }
  if(req.body.hasOwnProperty("created")){
    query.created = req.body.created;
  }
  else if(req.body.hasOwnProperty("startDate")){
    query.created = {$gte: req.body.startDate, $lte: req.body.endDate};
  }
  if(req.body.hasOwnProperty("clients")){
    query.client = {$in: req.body.clients};
  }
  if(req.body.hasOwnProperty("requester")){
    query.requester = req.body.requester;
  }
  //console.log(query);
  db.collection('tickets').find(
    query,
    {
      projection: {
        description: false,
        subTickets: false
      }
    }
  )
  .toArray()
  .then(arr => {
    res.send(arr);
    //console.log(arr);
  })
  .catch(err => res.sendStatus(500));
});



module.exports = router;
