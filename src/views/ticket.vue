<template>
  <EditForm v-if="ticket" @submit.prevent="save" @reset.prevent="initTicket">

    <h2 v-text="this.formattedTitle"></h2>

    <div class="mb-3">
      <div v-if="!isNew">
        Créé le {{ new Date(ticket.created).toLocaleString('fr') }} par {{ ticket.creator }}.<br/>
        Dernière modification le {{ new Date(ticket.lastEdit).toLocaleString('fr') }}.
      </div>
      <div v-if="ticket.parentTicket">
        Ticket parent&nbsp;:
        <a href="#" @click="$root.$emit('open-tab', { type: 'Ticket', data: { baseTicket: { _id: ticket.parentTicket._id } } })">
          #{{ ticket.parentTicket._id }} - {{ ticket.parentTicket.title }}
        </a>
      </div>
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
              <b-form-input v-model.trim="newRequester.name" required></b-form-input>
            </b-form-group>
            <b-form-group label="Email">
              <b-form-input v-model.trim="newRequester.email" type="email" required></b-form-input>
            </b-form-group>
            <b-form-group label="Tél.">
              <b-form-input v-model.trim="newRequester.phone" type="tel" required></b-form-input>
            </b-form-group>
            <b-form-group label="Adresse">
              <b-form-input v-model.trim="newRequester.address" required></b-form-input>
            </b-form-group>
          </b-card>

        </b-form-group>
      </b-col>

      <b-col md="6">
        <b-form-group label="Nom du ticket">
          <b-form-input v-model.trim="ticket.title" required></b-form-input>
        </b-form-group>

        <b-form-group label="Type" required>
          <b-form-radio-group v-model="ticket.type">
            <b-form-radio value="I">Intervention</b-form-radio>
            <b-form-radio value="Q">Question</b-form-radio>
          </b-form-radio-group>
        </b-form-group>

        <b-form-group label="Catégorie">
          <b-form-input v-model.trim="ticket.category"></b-form-input>
        </b-form-group>

        <b-form-group label="Description">
          <b-form-textarea v-model.lazy="ticket.description">
        </b-form-group>

        <!-- <b-form-group v-if="ticket.type == 'I'" label="Adresse de l'intervention">
          <b-form-select v-model="ticket.location">
            <option v-for="l in (currentClient ? currentClient.locations : null)" :key="l.name">{{l.name}}</option>
          </b-form-select>
        </b-form-group> -->

        <b-form-group label="Mode">
          <b-form-radio-group v-model="ticketWithSubTickets">
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
        :items="ticket.subTickets"
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

      </b-table>
      <!-- <TicketsTable v-if="!isNew" :items="ticket.subTickets"></TicketsTable> -->
      <div v-else class="text-center text-secondary">Pour ajouter des sous-tickets, enregistrez d'abord ce ticket.</div>
    </div>



    <div v-else-if="ticketWithSubTickets === false">

      <!-- Infos sur compétences requises, technicien -->
      <!-- durée prévue, compteur, progrès. -->

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

    </div>

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
    label: 'Dernière modification',
    sortable: true,
    formatter: v => new Date(v).toLocaleString('fr')
  },
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
    }
  },
  created() { this.initTicket(); },
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
          this.subTickets = res.joins.parentTicket;
          delete res.joins;
          this.ticketWithSubTickets = res.subTickets != null;
          this.ticket = res;
        });

    },
    updateTabTitle() { this.$emit('title-update', this.formattedTitle); },
    save() {
    }
  },
  watch: {
    "ticket.title": 'updateTabTitle',
    "ticket._id": 'updateTabTitle',
  },
  components: {
    EditForm,
  }
}
</script>
