<template>
  <b-container fluid="lg" v-if="ticket">

    <h2>Ticket :
      <span v-if="!isNew">#{{ ticket._id }}</span>
      <span>{{ ticket.title }}</span>
    </h2>

    <div class="mb-4">
      <p v-if="!isNew">
        Créé le {{ new Date(ticket.created * 1000).toLocaleString('fr-FR') }} par {{ ticket.creator }}.
      </p>
      <b-progress v-if="ticket" :value="ticket.progress" max=1 show-progress></b-progress>
      <div v-if="hasSubTickets">{{ tasksDone }} taches réalisée(s) sur {{ ticket.subTickets.length }}.</div>
    </div>

    <b-row class="mb-4">

      <b-col md="6">
        <b-form-group label="Client">
          <b-form-select v-model="ticket.client">
            <option v-for="c in clients" :key="c.name">{{c.name}}</option>
          </b-form-select>
        </b-form-group>

        <b-form-group label="Demandeur">

          <b-form-select v-model="ticket.requester">
            <option :value="newRequester">--nouveau--</option>
            <option v-for="r in (currentClient ? currentClient.requesters : null)" :key="r.name" :value="r.name">{{r.name}}</option>
          </b-form-select>

          <b-card v-if="currentRequester" class="mt-1">
            <b>Email :   </b> {{ currentRequester.email }}<br/>
            <b>Tél :     </b> {{ currentRequester.phone }}<br/>
            <b>Adresse : </b> {{ currentRequester.address }}<br/>
          </b-card>

          <b-card v-else-if="ticket.requester == newRequester" class="mt-1">
            <b-form-group label="Nom">
              <b-form-input v-model="newRequester.name"></b-form-input>
            </b-form-group>
            <b-form-group label="Email">
              <b-form-input v-model="newRequester.email" type="email"></b-form-input>
            </b-form-group>
            <b-form-group label="Tél.">
              <b-form-input v-model="newRequester.phone" type="tel"></b-form-input>
            </b-form-group>
            <b-form-group label="Adresse">
              <b-form-input v-model="newRequester.address"></b-form-input>
            </b-form-group>
          </b-card>

        </b-form-group>
      </b-col>

      <b-col md="6">
        <b-form-group label="Nom du ticket">
          <b-form-input v-model="ticket.title"></b-form-input>
        </b-form-group>

        <b-form-group label="Type">
          <b-form-radio-group v-model="ticket.type">
            <b-form-radio value="I">Intervention</b-form-radio>
            <b-form-radio value="Q">Question</b-form-radio>
          </b-form-radio-group>
        </b-form-group>

        <b-form-group label="Catégorie">
          <b-form-input v-model="ticket.category"></b-form-input>
        </b-form-group>

        <b-form-group label="Description">
          <b-form-textarea v-model="ticket.description">
        </b-form-group>

        <b-form-group label="Adresse de l'intervention">
          <b-form-select>
            <option v-for="l in (currentClient ? currentClient.locations : null)" :key="l.name">{{l.name}}</option>
          </b-form-select>
        </b-form-group>

        <b-row>
          <b-col>
            <b-form-group label="Compétences">
              <b-form-select></b-form-select>
            </b-form-group>
          </b-col>
          <b-col>
            <b-form-group label="Technicien">
              <b-form-select></b-form-select>
            </b-form-group>
          </b-col>
        </b-row>

        <b-row>
          <b-col>
            <b-form-group label="Durée prévue">
              <b-form-input></b-form-input>
            </b-form-group>
          </b-col>
          <b-col>
            <b-form-group label="Durée réelle">
              <b-form-input></b-form-input>
            </b-form-group>
          </b-col>
          <b-col>
            <b-form-group label="Commencer">
              <b-button>Commencer</b-button>
            </b-form-group>
          </b-col>
        </b-row>
      </b-col>

    </b-row>

    <div>

      <b-form-group label="Ticket parent" v-if="ticket.parentTicket != null">
        <a href="#" @onclick="$root.$emit('open-tab', {
          type: 'Ticket',
          data: { baseTicket: { _id: s._id } }
        })">
          #{{ ticket.parentTicket }}
        </a>
      </b-form-group>

      <!-- TODO: use table from tickets.vue -->
      <div v-if="hasSubTickets">
        <label>Sous-tickets</label>
        <ul>
          <li v-for="s in ticket.subTickets" :key="s._id">
            <a @click="$root.$emit('open-tab', {type: 'Ticket', data: {baseTicket: {_id: s._id}}})" href="#">
              #{{s._id}} - {{s.title}}
            </a>
          </li>
        </ul>
      </div>

    </div>

  </b-container>
  <b-container v-else class="text-center">
    <b-spinner></b-spinner>
  </b-container>
</template>


<script>
import store from '~/store';

export default {
  props: ['baseTicket'],
  data() {
    return {
      isNew: undefined,
      ticket: undefined,
      newRequester: {}
    }
  },
  created() {
    if(this.isNew = !this.baseTicket.hasOwnProperty('_id')) {
      this.ticket = this.baseTicket;
    }
    else
      fetch('/api/tickets/'+this.baseTicket._id)
        .then(res => res.json())
        .then(ticket => this.ticket = ticket);
  },
  computed: {
    hasSubTickets() {
      return this.ticket.subTickets && this.ticket.subTickets.length > 0;
    },
    tasksDone() {
      let counter = 0;
      for(let item of this.ticket.subTickets)
        if(!item.active) counter++;
      return counter;
    },
    clients() {
      return store.clients;
    },
    currentClient() {
      for(let c of store.clients) if(c.name == this.ticket.client) return c;
    },
    currentRequester() {
      if(this.currentClient) for(let r of this.currentClient.requesters) if(r.name == this.ticket.requester) return r;
    }
  },
  methods: {
    updateTitle() {
      this.$emit('title-update', (this.isNew ? 'Ticket' : '#'+this.ticket._id) + ' - ' + this.ticket.title);
    }
  },
  watch: {
    "ticket.title": 'updateTitle',
    "ticket._id": 'updateTitle',
    "ticket.client"() {
      if(this.currentClient)
        for(let r of this.currentClient.requesters)
          if(r.name == this.ticket.requester)
            return;
      this.ticket.requester = undefined;
    }
  }
}
</script>
