<template>
  <b-container fluid="lg">
    <b-row>
      <b-col><h2>Clients</h2></b-col>
      <b-col cols="auto"><b-button href="#">Ajouter client</b-button></b-col>
    </b-row>

    <b-form-input
      v-model="filter"
      type="search"
      placeholder="Rechercher un client"
    ></b-form-input>

    <b-table
      sticky-header
      responsive="sm"
      sort-icon-left
      hover
      @row-dblclicked="dblclicked"
      :filter="filter"
      :sort-by.sync="sortBy"
      :items="clients"
      :fields="fields"
    >

      <template v-slot:cell(priority)="data">
        <span v-if="data.item.priority" class="ml-2">★</span>
      </template>

    </b-table>

  </b-container>
</template>

<script>
  import store from '~/store';

  export default {
    data() {
      return {
        sortBy: 'name',
        fields: [
          {key: 'name', label: 'Nom', sortable: true},
          {key: 'priority', label: 'Prioritaire', sortable: true},
          {key: 'email', label: 'Adresse email'},
          {
            key: 'phone',
            label: 'Téléphone',
            formatter(v,k,i) { return i.locations[i.mainLocation].phone; }
          },
          {
            key: 'address',
            label: 'Adresse',
            formatter(v,k,i) { return i.locations[i.mainLocation].address; }
          },
          {
            key: 'locations',
            label:'Sites',
            formatter(v) { return v.length; }
          },
          {
            key: 'requesters',
            label:'Demandeurs',
            formatter(v) { return v.map(r => r.name).join(', '); }
          }
        ],
        filter: null
      }
    },
    computed: {
      clients() {
        return store.clients;
      }
    },
    methods:{
      dblclicked(item, index, event) {
        this.$root.$emit('open-tab', {type: 'Client', data: {id: item._id}});
      },
    }

  }

</script>
