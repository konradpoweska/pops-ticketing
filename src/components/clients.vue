<head>
  <link type="text/css" rel="stylesheet" href="//unpkg.com/bootstrap/dist/css/bootstrap.min.css" />
  <link type="text/css" rel="stylesheet" href="//unpkg.com/bootstrap-vue@latest/dist/bootstrap-vue-icons.min.css" />
  <!-- Load Vue followed by BootstrapVueIcons -->
  <script src="//unpkg.com/vue@latest/dist/vue.min.js"></script>
  <script src="//unpkg.com/bootstrap-vue@latest/dist/bootstrap-vue-icons.min.js"></script>
</head>

<template>
  <b-container fluid="lg">
    <b-row>
      <b-col><h2>Clients</h2></b-col>
      <b-col cols="auto"><b-button href="#">Ajouter client</b-button></b-col>
    </b-row>

    <b-form-input
              v-model="filter"
              type="search"
              id="filterInput"
              placeholder="Rechercher un client"
            ></b-form-input>

    <b-table
      striped
      sticky-header
      responsive="sm"
      sort-icon-left
      hover
      :filter="filter"
      :sort-by.sync="sortBy"
      :items="content"
      :fields="fields"
      :tbody-tr-class="rowColor"
      :busy="content == null">

      <template v-slot:cell(priority)="data">
        <b-icon-star></b-icon-star>
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
        sortBy: 'name',
        fields: [
          {key: '_id', label: 'id'},
          {key: 'priority', label: 'VIP', sortable: true},
          {key: 'name', label:'Nom', sortable: true},
          {key: 'email', label: 'Adresse email'},
          {key: 'phone', label: 'Téléphone'},
          {key: 'address', label: 'Adresse'},
          {key: 'locations[0].name', label:'Sites'},
          {key: 'requesters[0].name', label:'Demandeurs'}
          ],
        content: null,
        filter: null
      }
    },
    created() {
      fetch('/api/clients/')
        .then(res => res.json())
        .then(obj => {
          this.content = obj;
        });
    },
    methods: {
      rowColor(item, type) {
        if (!item || type !== 'row') return;
        if (item.priority == true){
          return 'table-success';
        }
      }
    }
  }

</script>

<style>

</style>
