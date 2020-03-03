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
      :filter="filter"
      :sort-by.sync="sortBy"
      :items="clients"
      :fields="fields"
    >
    <template v-slot:cell(actions)="data">
      <b-button class="py-0" @click="$root.$emit('open-tab', { type: 'Client', data: { id: data.item._id }})">
        <b-icon-pencil />
      </b-button>
    </template>
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
          {key: 'actions', label:'Actions'},
          {key: 'name', label: 'Nom', sortable: true},
          {key: 'priority', label: 'VIP', sortable: true},
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
    }

  }

</script>
