const dbConnector = require('../api/db');

dbConnector.init().then(async () => {
  await dbConnector.db.collection('tickets').insertMany(require('./tickets'));
  await dbConnector.db.collection('clients').insertMany(require('./clients'));
  await dbConnector.db.collection('counters').insertMany(require('./counters'));
  dbConnector.close();
});
