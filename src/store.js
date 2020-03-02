const CLIENTS_UPDATE_PERIOD = 2*60*1000; // 2 minutes

class Store {
  constructor() {
    this.timestamps = {};
    this.fetchClients();
    this.user = undefined;
    //this.user= {"username":"arnaud.lauperateur","email":"arnaud.lauperateur@pops1920.fr","name":"Aurnaud LAUPERATEUR","rights":["OPERATOR"]};
    //this.token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyaWdodHMiOlsiT1BFUkFUT1IiXSwidXNlcm5hbWUiOiJhcm5hdWQubGF1cGVyYXRldXIiLCJpYXQiOjE1ODMxNTc2Njh9.pKkUhP-xd_KNLcrX7HYyKVZ0XrwvGHrP2QsTaYViEP0";
  };

  get clients() {
    if(Date.now() - this.timestamps.clientsUpdate >= CLIENTS_UPDATE_PERIOD)
      this.fetchClients();
    return this._clients;
  };

  fetchClients() {
    this.timestamps.clientsUpdate = Date.now();
    fetch('/api/clients')
      .then(res => res.json())
      .then(clients => {
        this._clients = clients;
      });
  };
}

export default new Store();
