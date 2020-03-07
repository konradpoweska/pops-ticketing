const express = require('express');
const router = express.Router();
const e = require('./httpErrors');
const isEqual = require('lodash.isequal');
const statusValues = require('./schemas/tickets').statusValues;

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
    } },
    { $unwind: {
      path: "$joins.parentTicket",
      preserveNullAndEmptyArrays: true
    } }
  ])
  .next()
  .then(obj => obj ? res.send(obj) : res.sendStatus(404))
  .catch(err => {
    res.sendStatus(500);
    console.error(err);
  });
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
        statusSub: "$subTickets.doc.status",
        lastEdit: true,
        lastEditSub: "$subTickets.doc.lastEdit",
        totalWeight: "$subTickets.weight",
        totalProgress: { $multiply: ["$subTickets.weight", "$subTickets.doc.progress"] }
      } },
      { $group: {
        _id: "$_id",
        parentTicket: { $first: "$parentTicket" },
        status: { $min: "$statusSub" },
        lastEdit: { $first: "$lastEdit" },
        lastEditSub: { $max: "$lastEditSub" },
        totalWeight: { $sum: "$totalWeight" },
        totalProgress: { $sum: "$totalProgress" }
      } },
      { $project: {
        parentTicket: true,
        status: true,
        lastEdit: { $max: ["$lastEdit", "$lastEditSub"] },
        progress: { $divide: ["$totalProgress", "$totalWeight"] }
      } }
      // TODO: check if doable with $merge
    ]).next();

    toUpdate.status = statusValues[toUpdate.status];

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

    const updatedTickets = await updateParent(input.parentTicket);
    if(hasParentTicket) updatedTickets[0].subTickets = [ { _id: newId, weight: 1 } ];

    res.send({ ok: true, newTicket: input, updatedTickets });

  }
  catch(err) {
    if(err.code == 121) res.status(400); // Mongo Validation Error
    else if(err instanceof e.HttpError) res.status(err.httpCode);
    else { res.status(500); console.error(err); }

    res.json({ ok: false, reason: err.message });
  }
});



const leafTicketSpecificFields = ['skills', 'estimatedDuration', 'plannedIntervention', 'technician', 'actualDuration', 'counterStart'];
const leafTicketOnlyInputFields = [...leafTicketSpecificFields, 'progress'];


router.put('/:id', async (req, res) => {
  try {
    const input = req.body.ticket;
    if(!input) throw new e.BadRequestError("No object provided");

    const _id = parseInt(req.params.id);
    if(input.hasOwnProperty('_id') && input._id !== _id)
      throw new e.BadRequestError("Id in URL doesn't match the one in the body.");

    const $set = {};
    const $unset = {};

    for(let prop of ['title', 'type', 'client', 'requester', 'category', 'description', 'status'])
      if(input.hasOwnProperty(prop))
        $set[prop] = input[prop];

    const ticketBeforeUpdate = await db.collection('tickets').findOne({ _id });
    if(ticketBeforeUpdate == null) throw new e.NotFoundError("Ticket doesn't exist.");


    if(leafTicketOnlyInputFields.some(prop => prop in input)) {
      if('subTickets' in input) throw new e.BadRequestError("Your request contains contradictory fields.");

      if(ticketBeforeUpdate.subTickets) {
        if(ticketBeforeUpdate.subTickets.length)
          throw new e.BadRequestError("Ticket has sub-tickets, cannot convert to assigned type.");
        else
          $unset.subTickets = "";
      }

      for(let prop of leafTicketOnlyInputFields)
        if(input.hasOwnProperty(prop)) {
          if(['estimatedDuration', 'plannedIntervention', 'actualDuration', 'counterStart'].includes(prop))
            $set[prop] = input[prop] ? new Date(input[prop]) : null;
          else
            $set[prop] = input[prop];
        }
    }
    else if('subTickets' in ticketBeforeUpdate && 'status' in input) {
      var overwriteStatusOnSubTickets = true;
    }

    if(input.subTickets != null) {
      if(ticketBeforeUpdate.subTickets) {
        if(!isEqual(ticketBeforeUpdate.subTickets.map(t => t._id).sort(), input.subTickets.map(t => t._id).sort()))
          throw new e.BadRequestError("Only reordering and weight changes are allowed on sub-tickets.");
      }
      else leafTicketSpecificFields.forEach(p => $unset[p] = "");

      $set.subTickets = input.subTickets;
    }

    const updateOps = {};
    if(Object.keys($set).length > 0) updateOps.$set = $set;
    if(Object.keys($unset).length > 0) updateOps.$unset = $unset;

    if(Object.keys(updateOps).lenght == 0)
      throw new e.BadRequestError("Nothing to update.");

    updateOps.$currentDate = { lastEdit: true };

    const updateQuery = await db.collection('tickets').findOneAndUpdate(
      { _id },
      updateOps,
      { returnOriginal: false }
    );

    if(!updateQuery.lastErrorObject.updatedExisting)
      throw new Error("Couldn't update");

    const updatedTicket = updateQuery.value;

    let updatedTickets;

    if(input.subTickets != null) {
      // current ticket progress needs to be updated because the weight of sub-tickets could have changed
      updatedTickets = await updateParent(_id);
      const t = updatedTickets.shift(); // returns changes on current ticket
      if(t) updatedTicket.progress = t.progress;
    }
    else updatedTickets = await updateParent(updatedTicket.parentTicket);

    if(overwriteStatusOnSubTickets) {
      await db.collection('tickets').updateMany(
        { _id: { $in: updatedTicket.subTickets.map(i => i._id) } },
        { $set: { status: input.status } }
      );

      updatedTickets.push(...updatedTicket.subTickets.map(i => ({_id: i._id, status: input.status})));
    }

    res.send({ ok: true, updatedTicket, updatedTickets });
  }
  catch(err) {
    console.error(err);
    if(err.code == 121) res.status(400); // Mongo Validation Error
    else if(err instanceof e.HttpError) res.status(err.httpCode);
    else { res.status(500); /* console.error(err); */ }

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
    let selectedStatuses = [];
    // 'OPEN', 'IN_PROGRESS', 'COMPLETED', 'CLOSED_SUCCESS', 'CLOSED_ABORTED', 'DELETED'
    for(let v of req.body.status)
      if(v == 1) selectedStatuses.push('OPEN');
      else if(v == 2) selectedStatuses.push('IN_PROGRESS', 'COMPLETED');
      else if(v == 3) selectedStatuses.push('CLOSED_SUCCESS', 'CLOSED_ABORTED');

    query.status = {$in: selectedStatuses};
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
