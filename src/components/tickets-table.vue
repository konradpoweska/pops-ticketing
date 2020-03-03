<template>
  <b-table
    :fields="fields"
    :items="items"
    responsive="sm"
    primary-key="_id"
    :busy="items == null"
    sort-icon-left
    sticky-headers
    hover
    empty-text="Aucun élément."
  >

    <template v-slot:cell(actions)="data">
      <b-button class="py-0" @click="$root.$emit('open-tab', { type: 'Ticket', data: { baseTicket: { _id: data.item._id } } });">
        <b-icon-pencil />
      </b-button>
    </template>

    <template v-slot:cell(progress)="data">
      <b-progress :value="data.value" max=1 show-progress></b-progress>
    </template>

    <template v-slot:table-busy>
      <div class="text-center my-1">
        <b-spinner class="align-middle"></b-spinner>
        <strong>Loading...</strong>
      </div>
    </template>

  </b-table>
</template>


<script>
const fields = [
  { key: "actions" },
  { key: "_id", label: "Id", sortable: true },
  { key: "title", label: "Nom" },
  { key: 'progress', label: 'Progrès' },
  { key: "client", label: "Client", sortable: true },
  { key: "requester", label: 'Demandeur' },
  {
    key: "lastEdit",
    label: 'Dernière modification',
    sortable: true,
    formatter: v => new Date(v).toLocaleString('fr')
  },
];
Object.freeze(fields);

export default {
  props: ['items'],
  data: () => ({ fields }),
}
</script>


<style scoped>
td .progress {
  min-width: 100px;
  margin-top: .3rem;
}
</style>
