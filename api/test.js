const statusValues = require('./schemas/tickets').statusValues;


require('./db').init().then(async m=>{
  let items = await m.db.collection('tickets').aggregate([
    { $match: { _id: 1 } },
    { $project: {
      status: { $indexOfArray: [statusValues, "$status"] }
    } }
    // { $unwind: { path: "$subTickets" } },
    // { $lookup: {
    //   from: 'tickets',
    //   localField: 'subTickets._id',
    //   foreignField: '_id',
    //   as: 'subTickets.doc'
    // } },
    // { $unwind: { path: '$subTickets.doc' } },
    // { $project: {
    //   parentTicket: true,
    //   lastEdit: true,
    //   lastEditSub: "$subTickets.doc.lastEdit",
    //   totalWeight: "$subTickets.weight",
    //   totalProgress: { $multiply: ["$subTickets.weight", "$subTickets.doc.progress"] }
    // } }
  ]).toArray();

  console.log(items);
  m.close();
});
