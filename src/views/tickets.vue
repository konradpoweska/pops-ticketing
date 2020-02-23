<template>
  <b-container fluid="lg">

    <b-row class="mb-2">
      <b-col><h2>Tickets</h2></b-col>
      <b-col class="text-right">
        <b-button variant="secondary" @click="fetch"><b-icon-arrow-clockwise /></b-button>
        <b-button variant="primary" @click="newTicket"><b>+</b> Nouveau</b-button>
      </b-col>
    </b-row>

    <b-table
      :fields="fields"
      :items="tickets"
      responsive="sm"
      primary-key="_id"
      @row-dblclicked="dblclicked"
      :busy="tickets == null"
      sort-icon-left
      hover
      tbody-tr-class="clickable"
    >

      <template v-slot:cell(progress)="data">
        <b-progress :value="data.value" max=1 show-progress class="mt-1" style="min-width: 100px;"></b-progress>
      </template>

      <template v-slot:table-busy>
        <div class="text-center my-1">
          <b-spinner class="align-middle"></b-spinner>
          <strong>Loading...</strong>
        </div>
      </template>

    </b-table>

  </b-container>
</template>

<script>
export default {
  data() {
    return {
      tickets: null,
      fields: [
        { key: "_id", label: "Id", sortable: true },
        { key: "title", label: "Nom" },
        { key: 'progress', label: 'Progrès' },
        { key: "client", label: "Client", sortable: true },
        { key: "requester", label: 'Demandeur' }
      ]
    }
  },
  created() {
    this.$root.$on('refresh-tickets', this.fetch);
    this.fetch();
  },
  methods: {
    fetch() {
      fetch('/api/tickets')
        .then(res => res.json())
        .then(arr => {
          this.tickets = arr;
        });
    },
    dblclicked(item, index, event) {
      this.$root.$emit('open-tab', { type: 'Ticket', data: { baseTicket: { _id: item._id } } });
    },
    newTicket() {
      this.$root.$emit('open-tab', {type: 'Ticket', data: {baseTicket: {
        requester: undefined // required to make property reactive...
      }}});
    }
  }
}
</script>


<style>
.clickable {
  cursor: pointer;
}
</style>
