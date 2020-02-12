<template>
  <b-container fluid="lg">

    <h2>Tickets</h2>

    <b-table :items="tickets" :fields="fields" responsive="sm" :busy="tickets == null">

      <template v-slot:cell(id)="data">
        #{{ data.item._id }} - {{ data.item.title }}
      </template>

      <template v-slot:cell(progress)="data">
        <b-progress class="mt-1" :value="data.value" max=1 show-progress></b-progress>
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
        {
          key:'id',
          sortable: true
        },
        {
          key: 'progress',
          label: 'Progrès'
        },
        {
          key: "client",
          sortable: true
        },
        {
          key: "requester",
          label: 'Demandeur',
        }
      ]
    }
  },
  created() {
    fetch('/api/tickets')
    .then(res => res.json())
    .then(arr => {
      this.tickets = arr;
    });
  }
}
</script>
