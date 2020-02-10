const MongoClient = require('mongodb').MongoClient;

const url = process.env.MONGO_URL || "mongodb://localhost:27017";
const dbName = process.env.MONGO_DB || "pops-ticketing";

module.exports = {
  connection: null,
  client: null,
  db: null,

  init() {
    return this.connection = MongoClient
      .connect(url, {useUnifiedTopology: true})
      .then(client => {
        this.client = client;
        this.db = client.db(dbName);
        return this;
      })
      .catch(err => {
        console.error("Couldn't reach database.", err.message);
      });
  },

  close() {
    this.client.close();
    this.connection = this.client = this.db = null;
  }

}
