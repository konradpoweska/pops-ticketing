<!--Vue spéciale technicien avec les interventions en fonction de la date et l'heure-->
<!--La vue détaillée renvoie à un onglet correspondant à l'id du ticket correspondant-->
<template>
  <b-container fluid="lg">
    <b-row>
      <b-col><h2>Mes Interventions</h2></b-col>
    </b-row>

    <b-table
      sticky-header
      responsive="sm"
      sort-icon-left
      hover
      :filter="filter"
      :sort-by.sync="sortBy"
      :items="tickets"
      :fields="fieldsIntervention"
    >
      <template v-slot:cell(actions)="data">
        <b-button class="py-0" @click="$root.$emit('open-tab', { type: 'Ticket', data: { baseTicket: { _id: data.item._id } } });">
          Détails
        </b-button>
      </template>
    </b-table>

  </b-container>
</template>

<script>
  import store from '~/store';

  export default {
    data() {
      return {
        tickets: null,
        fieldsIntervention:[
          {key: "actions"},
          {key: 'title',label: 'Titre'},
          {key: 'status', label: 'Statut'},
          {key: 'type', label: 'Type'},
          {key: 'plannedIntervention', label: 'Prévue pour'},
          //TODO - Filtrer les tickets en fonction d'un technicien particulier
        ]
      }
    },
    created(){
      this.$root.$on('refresh-tickets', this.fetch);
      this.fetch();
    },
    computed: {
      tickets() {
        return store.tickets;
      }
    },
    methods:{
      fetch() {
        fetch('/api/tickets')
          .then(res => res.json())
          .then(arr => {
            this.tickets = arr;
          });
      },
    }

  }

</script>
