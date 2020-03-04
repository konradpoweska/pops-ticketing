const validatorsFor = ['tickets', 'clients'];
const sampleDataFor = ['tickets', 'clients', 'users']

const drop = process.argv.includes('--drop');
const sampleData = process.argv.includes('--sample-data');

let mongoSession;


require('../db').init().then(m => mongoSession = m) // connect

.then(() =>  // drop db if flag, return list of existing collections
  drop ?
    mongoSession.db.dropDatabase().then(() => { console.log("Db dropped."); return []; })
  : mongoSession.db.command({ listCollections: true }).then(r => r.cursor.firstBatch.map(c => c.name))
)

.then(existingCollections => // add validators to existing collections or new ones
  Promise.all(validatorsFor.map(c =>
    existingCollections.includes(c) ?
      mongoSession.db.command({ collMod: c, validator: require('../schemas/'+c).validator })
    : mongoSession.db.createCollection(c, { validator: require('../schemas/'+c).validator })
  ))
)

.then(() => // insert sample data if flag
  sampleData ?
    Promise.all(sampleDataFor.map(s =>
      mongoSession.db.collection(s).insertMany(require('./sample-data/'+s))
    ))
    .then(() => console.log("Sample data inserted successfully."))
  : null
)

.then(() => // get max ticketId
  mongoSession.db.collection('tickets').aggregate([
    { $group: { _id: "ticketId", max: { $max: "$_id" } } }
  ]).next()
)

.then(o => // update ticketId sequence value
  mongoSession.db.collection('counters').findOneAndUpdate(
    { _id: "ticketId" },
    { $set: { _id: "ticketId", seq: o ? o.max + 1 : 0 } },
    { upsert: true }
  )
)

.then(() => console.error("Success!"))
.catch(err => console.error("Failure!", err))
.finally(() => mongoSession.close());
