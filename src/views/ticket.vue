<template>
  <EditForm v-if="ticket" @submit.prevent="save" @reset.prevent="initTicket">

    <h2 v-text="this.formattedTitle"></h2>

    <div class="mb-3">
      <b-row>
        <b-col>
          <div v-if="!isNew">
            Créé le {{ new Date(ticket.created).toLocaleString('fr') }} par {{ ticket.creator }}.<br/>
            Dernière modification le {{ new Date(ticket.lastEdit).toLocaleString('fr') }}.
          </div>

        <div v-if="ticket.parentTicket">
          Ticket parent&nbsp;:
          <a href="#" @click="$root.$emit('open-tab', { type: 'Ticket', data: { baseTicket: { _id: ticket.parentTicket } } })">
            #{{ parentTicket._id }} - {{ parentTicket.title }}
          </a>
        </div>
        <div v-if="ticket.status=='OPEN'">
          Statut du ticket : <b-badge variant="warning">OUVERT</b-badge>
        </div>
        <div v-if="ticket.status=='IN_PROGRESS'">
          Statut du ticket : <b-badge variant="primary">EN COURS</b-badge>
        </div>
        <div v-if="ticket.status=='COMPLETED'">
          Statut du ticket : <b-badge variant="success">TERMINÉ</b-badge>
        </div>
        <div v-if="ticket.status=='CLOSED_SUCCESS' || ticket.status=='CLOSED_ABORTED' || ticket.status=='DELETED'">
          Statut du ticket : <b-badge variant="secondary">FERMÉ</b-badge>
        </div>
      </b-col>
      <b-col class="text-right">
        <b-dropdown variant="danger" text="Fermer le ticket">
          <b-dropdown-item-button @click="ticket.status='CLOSED_SUCCESS'">Tâche effectuée</b-dropdown-item-button>
          <b-dropdown-item-button @click="ticket.status='CLOSED_ABORTED'">Tâche abandonnée</b-dropdown-item-button>
          <b-dropdown-item-button @click="ticket.status='DELETED'">Autre</b-dropdown-item-button>
        </b-dropdown>
      </b-col>
    </b-row>
    </div>

    <div class="mb-4">
      <b-progress v-if="ticket" :value="ticket.progress" max=1 show-progress></b-progress>
      <div v-if="hasSubTickets">{{ tasksDone }} taches réalisée(s) sur {{ ticket.subTickets.length }}.</div>
    </div>

    <b-row class="mb-4">

      <b-col md="6">
        <b-form-group label="Client">
          <b-form-select v-model="ticket.client" required>
            <option v-for="c in store.clients" :key="c.name">{{c.name}}</option>
          </b-form-select>
        </b-form-group>

        <b-form-group label="Demandeur">

          <b-form-select v-model="ticket.requester" required>
            <option :value="newRequester" v-if="isNew && currentClient">--nouveau--</option>
            <option v-for="r in (currentClient ? currentClient.requesters : null)" :key="r.name" :value="r.name">{{r.name}}</option>
          </b-form-select>

          <b-card v-if="currentRequester" class="mt-1">
            <b>Email :   </b> {{ currentRequester.email }}<br/>
            <b>Tél :     </b> {{ currentRequester.phone }}<br/>
            <b>Adresse : </b> {{ currentRequester.address }}<br/>
          </b-card>

          <b-card v-else-if="ticket.requester == newRequester" class="mt-1">
            <b-form-group label="Nom">
              <b-form-input v-model="newRequester.name" trim required></b-form-input>
            </b-form-group>
            <b-form-group label="Email">
              <b-form-input v-model="newRequester.email" trim type="email" required></b-form-input>
            </b-form-group>
            <b-form-group label="Tél.">
              <b-form-input v-model="newRequester.phone" trim type="tel" required></b-form-input>
            </b-form-group>
            <b-form-group label="Adresse">
              <b-form-input v-model="newRequester.address" trim required></b-form-input>
            </b-form-group>
          </b-card>

        </b-form-group>
      </b-col>

      <b-col md="6">
        <b-form-group label="Nom du ticket">
          <b-form-input v-model="ticket.title" trim required></b-form-input>
        </b-form-group>

        <b-form-group label="Type" required>
          <b-form-radio-group v-model="ticket.type">
            <b-form-radio value="I">Intervention</b-form-radio>
            <b-form-radio value="Q">Question</b-form-radio>
          </b-form-radio-group>
        </b-form-group>

        <b-form-group label="Catégorie">
          <b-form-input v-model="ticket.category" lazy trim required></b-form-input>
        </b-form-group>

        <b-form-group label="Description">
          <b-form-textarea v-model="ticket.description" lazy trim>
        </b-form-group>

        <!-- <b-form-group v-if="ticket.type == 'I'" label="Adresse de l'intervention">
          <b-form-select v-model="ticket.location">
            <option v-for="l in (currentClient ? currentClient.locations : null)" :key="l.name">{{l.name}}</option>
          </b-form-select>
        </b-form-group> -->

        <b-form-group label="Mode">
          <b-form-radio-group v-model="ticketWithSubTickets" required>
            <b-form-radio :value="true">Sous-tickets</b-form-radio>
            <b-form-radio :value="false" :disabled="hasSubTickets">Technicien affecté</b-form-radio>
          </b-form-radio-group>
        </b-form-group>

      </b-col>

    </b-row>


    <div v-if="ticketWithSubTickets === true">
      <b-row class="mb-1">
        <b-col>
          <h4>Sous-tickets</h4>
        </b-col>
        <b-col class="text-right">
          <b-button v-if="!isNew" variant="primary"
            @click="$root.$emit('open-tab', { type: 'Ticket', data: { baseTicket: {
              client: ticket.client,
              requester: ticket.requester,
              parentTicket: ticket
            }}});"
          >
            <b>+</b> Nouveau
          </b-button>
        </b-col>
      </b-row>

      <b-table
        v-if="!isNew"
        :fields="subTicketsTableFields"
        :items="subTickets"
        responsive="sm"
        primary-key="_id"
        hover
        empty-text="Aucun élément."
      >

        <template v-slot:cell(actions)="data">
          <b-button class="py-0" @click="$root.$emit('open-tab', { type: 'Ticket', data: { baseTicket: { _id: data.item._id } } });">
            <b-icon-pencil />
          </b-button>
        </template>

        <template v-slot:cell(progress)="data"><b-progress :value="data.value" max=1 show-progress></b-progress></template>

        <template v-slot:cell(weight)="data"><b-form-input v-model.number="data.item.item.weight" style="width: 60px;" min="0" /></template>
      </b-table>
      <div v-else class="text-center text-secondary">Pour ajouter des sous-tickets, enregistrez d'abord ce ticket.</div>
    </div>



    <b-row v-else-if="ticketWithSubTickets === false">

      <b-col md="4">
        <b-row>
          <b-col>Compétences</b-col>
          <b-col class="text-right"><b-button @click="addSkill" size="sm">Ajouter</b-col>
        </b-row>
        <b-table-simple><b-tbody>
          <b-tr v-for="s in ticket.skills">
            <b-td><b-input placeholder="Compétence" v-model="s.name" required></b-td>
            <b-td><b-input placeholder="Niveau" v-model.number="s.level" required></b-td>
            <b-td><b-button @click="ticket.skills.splice(ticket.skills.indexOf(s), 1)" size="sm">-</b-button></b-td>
          </b-tr>
        </b-tbody></b-table-simple>
      </b-col>

      <b-col md="4">
        <b-form-group label="Technicien">
          <b-form-select v-model="ticket.technician" :options="technicians.map(e => e.name)">
            <option :value="null" style="color: #aaa;">--Pas affecté--</option>
          </b-form-select>
        </b-form-group>
        <b-form-group label="Date de l'intervention">
          <b-form-input />
        </b-form-group>
        <b-form-group label="Durée prévue">
          <b-form-input></b-form-input>
        </b-form-group>
      </b-col>

      <b-col md="4">
        <b-form-group label="Durée réelle">
          <b-form-input></b-form-input>
        </b-form-group>
        <b-form-group label="Compteur">
          <b-button v-if="ticket.counterStart == null">Commencer</b-button>
          <b-button v-else>Arrêter</b-button>
        </b-form-group>
        <b-form-group label="Progrès">
          <b-form-input
            :value="Math.floor(ticket.progress*100)"
            @update="ticket.progress = $event/100.0"
            type="number" min="0" max="100">
          </b-form-input>
        </b-form-group>
      </b-col>

    </b-row>

  </EditForm>
  <div v-else class="text-center">
    <b-spinner></b-spinner>
  </div>
</template>


<script>
import store from '~/store';
import cloneDeep from 'lodash/cloneDeep';
import EditForm from '~/components/edit-form';

const subTicketsTableFields = [
  { key: "actions" },
  { key: "_id", label: "Id" },
  { key: "title", label: "Nom" },
  { key: 'progress', label: 'Progrès' },
  {
    key: "lastEdit",
    label: 'Modification',
    formatter: v => new Date(v).toLocaleString('fr')
  },
  { key: 'weight', label: 'Poids' }
];

export default {
  props: ['baseTicket'],
  data() {
    return {
      store,
      ticket: undefined,
      ticketWithSubTickets: undefined,
      newRequester: {},
      subTicketsTableFields,
      subTickets: undefined,
      technicians: []
    }
  },
  mounted() {
    this.initTicket();
    this.$root.$on('update-ticket', updated => {
      if(updated.$sourceTicket._id == this.baseTicket._id)
      debugger;
      if(this.parentTicket && this.parentTicket._id == updated.$sourceTicket._id) { this.parentTicket = updated.$sourceTicket; return; }

      let subTicketsIds = this.ticket.subTickets ? this.ticket.subTickets.map(e => e._id) : null;

      for(let t of updated)
        if(t._id == this.baseTicket._id) for(let prop in t) { console.log(`Setting ${prop} as ${t[prop]} for ticket #${this.baseTicket._id}`); this.ticket[prop] = t[prop]; }
        else if(this.hasSubTickets) {
          let subIndex = subTicketsIds.indexOf(t._id);
          if(subIndex !== -1) for(let prop in t) this.subTickets[subIndex][prop] = t[prop];
        }

      if(this.hasSubTickets)
        for(let i=0; i<subTicketsIds.length; i++)
          if(subTicketsIds[i] == updated.$sourceTicket._id)
            this.$set(this.subTickets, i, {...updated.$sourceTicket, item: this.ticket.subTickets[i]});
    });
    fetch('/api/users/technicians')
      .then(res => res.json())
      .then(arr => {
        this.technicians = arr;
      });
    this.initTicket();
  },
  computed: {
    isNew() {
      return this.baseTicket._id == null;
    },
    formattedTitle() {
      let title = this.isNew ? 'Nouveau ticket' : '#'+this.ticket._id;
      if(this.ticket.title) title += ' - ' + this.ticket.title;
      return title;
    },
    hasSubTickets() {
      return this.ticket.subTickets && this.ticket.subTickets.length > 0;
    },
    tasksDone() {
      let counter = 0;
      // for(let item of this.ticket.subTickets)
      //   if(item.status.startsWith("CLOSED")) counter++;
      return counter;
    },
    currentClient() {
      for(let c of store.clients) if(c.name == this.ticket.client) return c;
    },
    currentRequester() {
      if(this.currentClient) for(let r of this.currentClient.requesters) if(r.name == this.ticket.requester) return r;
    }
  },
  methods: {
    initTicket() {
      if(this.isNew)
        this.ticket = cloneDeep(this.baseTicket);
      else
        fetch('/api/tickets/'+this.baseTicket._id)
        .then(res => res.json())
        .then(res => {
          this.parentTicket = res.joins.parentTicket;
          this.ticketWithSubTickets = res.subTickets != null;
          this.ticket = res;

          if(this.ticketWithSubTickets)
            this.subTickets = res.subTickets.map(sr => {
              for(let sf of res.joins.subTickets) if(sr._id == sf._id) {
                sf.item = sr;
                return sf;
              }
            })

          delete res.joins;

        });
    },
    updateTabTitle() { this.$emit('title-update', this.formattedTitle); },
    addSkill() {
      let obj = { name: '', level: null }
      if(this.ticket.skills) this.ticket.skills.push(obj);
      else this.ticket.skills = [ obj ];
    },
    save() {
      if(this.isNew) return this.saveNew();

      const ticketFields = {};
      for(let prop of ['client', 'requester', 'title', 'type', 'category', 'description', 'status'])
        ticketFields[prop] = this.ticket[prop];

      if(this.ticketWithSubTickets)
        ticketFields.subTickets = this.ticket.subTickets;
      else
        for(let prop of ['progress', 'skills', 'estimatedDuration', 'plannedIntervention', 'technician', 'actualDuration', 'counterStart'])
          ticketFields[prop] = this.ticket[prop];

      fetch('/api/tickets/' + this.ticket._id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticket: ticketFields })
      })
      .then(res => { if(!res.ok) throw new Error(res.statusText); return res.json(); })
      .then(res => {
        this.ticket = res.updatedTicket;
        res.updatedTickets.$sourceTicket = res.updatedTicket;
        this.$root.$emit('update-ticket', res.updatedTickets);
      })
      .catch(err => console.error(err));
    },
    saveNew() {
      // add missing fields
      if(!this.ticket.hasOwnProperty('description')) this.ticket.description = "";
      if(this.ticketWithSubTickets)
        this.ticket.subTickets = [];
      else {
        for(let prop of ['estimatedDuration', 'plannedIntervention', 'technician', 'actualDuration', 'counterStart'])
          if(!this.ticket.hasOwnProperty(prop)) this.ticket[prop] = null;
        if(!this.ticket.hasOwnProperty('skills')) this.ticket.skills = [];
        if(!this.ticket.hasOwnProperty('progress')) this.ticket.progress = 0.0;
      }

      const tasks = Promise.resolve();

      // on-the-fly requester adding
      if(this.ticket.requester == this.newRequester)
        tasks.then(() => fetch('/api/clients/'+this.currentClient._id+'/requesters/new', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ requester: this.newRequester })
        }))
        .then(res => { if(!res.ok) throw new Error(res.statusText); return res.json(); })
        .then(res => {
          for(let i=0; i<store.clients.length; ++i)
            if(store.clients[i]._id == res.updatedClient._id) { store.clients[i] = res.updatedClient; break; }
          this.ticket.requester = this.newRequester.name;
        });

      tasks.then(() => fetch('/api/tickets/new', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticket: this.ticket })
      }))
      .then(res => { if(!res.ok) throw new Error(res.statusText); return res.json(); })
      .then(res => {
        this.ticket = res.newTicket;
        res.updatedTickets.$sourceTicket = res.newTicket;
        this.$root.$emit('update-ticket', res.updatedTickets);
        this.baseTicket._id = res.newTicket._id;
      });

      tasks.catch(err => console.error(err));
    },
    updateStatus() {
      if(this.ticket.technician) this.ticket.status='IN_PROGRESS';
      if(this.ticket.progress==1) this.ticket.status='COMPLETED';
    }
  },
  watch: {
    "ticket.title": 'updateTabTitle',
    "ticket._id": 'updateTabTitle',
    "ticket.progress": 'updateStatus',
    "ticket.technician": 'updateStatus',
  },
  components: {
    EditForm,
  }
}
</script>
