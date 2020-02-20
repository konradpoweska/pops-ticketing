const CLIENTS_UPDATE_PERIOD = 2*60*1000; // 2 minutes

class Store {
  constructor() {
    this.timestamps = {};
    this.fetchClients();
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
