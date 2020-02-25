<template>
  <b-container fluid="lg">

    <b-row class="mb-2">
      <b-col><h2>Tickets</h2></b-col>
      <b-col class="text-right">
        <b-button variant="secondary" @click="fetch"><b-icon-arrow-clockwise /></b-button>
        <b-button variant="primary" @click="newTicket"><b>+</b> Nouveau</b-button>
      </b-col>
    </b-row>

    <TicketsTable :items="tickets"></TicketsTable>

  </b-container>
</template>

<script>
import TicketsTable from "~/components/tickets-table"

export default {
  data: () => ({
    tickets: null,
  }),
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
    newTicket() {
      this.$root.$emit('open-tab', { type: 'Ticket', data: { baseTicket: { _id: null } } });
    }
  },
  components: { TicketsTable }
}
</script>
