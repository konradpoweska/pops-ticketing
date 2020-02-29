<template>
  <EditForm @submit.prevent="save">
    <b-row>
      <b-col cols="3">
         <b-form-group label="Nom du client">
          <b-form-input v-model="client.name"></b-form-input>
         </b-form-group>

         <b-form-group label="Prioritaire">
           <b-form-checkbox 
              v-model="client.priority" 
              >
           </b-form-checkbox>
         </b-form-group>
         
         <b-form-group label="Email">
          <b-form-input v-model="client.email"></b-form-input>
         </b-form-group>

      </b-col>
      <b-col cols="9">
        <b-form-group
          label-row-lg="3"
          label="Sites"
          label-size="lg"
          label-class="font-weight-bold pt-0"
          class="mb-0"
        >
        <b-table
          sticky-header
          responsive="sm"
          sort-icon-left
          hover
          :filter="filter"
          :sort-by.sync="sortBy"
          :items="client.locations"
          :fields="fieldsClient"
        >
          <template v-slot:cell(actions)="row">
            <b-button @click="row.toggleDetails" class="py-0">
              <b-icon-pencil />
            </b-button>
          </template>

          <template v-slot:row-details="row">
            <b-card>
              <b-row >
                <b-col>
                  <b-form-group label="Nom">
                    <b-form-input v-model="row.item.name"></b-form-input>
                  </b-form-group>
                </b-col>
              
                <b-col>
                  <b-form-group label="Adresse">
                    <b-form-input v-model="row.item.address"></b-form-input>
                  </b-form-group>
                </b-col>

                <b-col>
                  <b-form-group label="Téléphone">
                    <b-form-input v-model="row.item.phone"></b-form-input>
                  </b-form-group>
                </b-col>
              </b-row>
            </b-card>
          </template>

        </b-table>

        <b-form-group
          label-row-lg="3"
          label="Demandeurs"
          label-size="lg"
          label-class="font-weight-bold pt-0"
          class="mb-0"
        >

        <b-table
          sticky-header
          responsive="sm"
          sort-icon-left
          hover
          :filter="filter"
          :sort-by.sync="sortBy"
          :items="client.requesters"
          :fields="fieldsRequester"
        >
          <template v-slot:cell(actions)="row">
            <b-button @click="row.toggleDetails" class="py-0">
              <b-icon-pencil />
            </b-button>
          </template>

          <template v-slot:row-details="row">
            <b-card>
              <b-row >
                <b-col>
                  <b-form-group label="Nom">
                    <b-form-input v-model="row.item.name"></b-form-input>
                  </b-form-group>
                </b-col>

                <b-col>
                  <b-form-group label="Adresse">
                    <b-form-input v-model="row.item.address"></b-form-input>
                  </b-form-group>
                </b-col>

                <b-col>
                  <b-form-group label="Email">
                    <b-form-input v-model="row.item.email"></b-form-input>
                  </b-form-group>
                </b-col>

                <b-col>
                  <b-form-group label="Téléphone">
                    <b-form-input v-model="row.item.phone"></b-form-input>
                  </b-form-group>
                </b-col>
              </b-row>
            </b-card>
          </template>

        </b-table>
      </b-col>
    </b-row>
  </EditForm>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import store from '~/store';
import EditForm from '~/components/edit-form';

export default {
  props:["id"],
  data(){
    return{
      client: undefined,
      sortBy: 'Nom du site',
      fieldsClient: [
        {key: "actions" },
        {key: 'name', label: 'Nom du site', sortable: true},
        {key: 'address', label: 'Adresse'},
        {key: 'phone', label: 'Téléphone'},
      ],
      fieldsRequester: [
        {key: "actions"},
        {key: 'name', label: 'Nom du demandeur', sortable: true},
        {key: 'address', label: 'Adresse'},
        {key: 'email', label: 'Email'},
        {key: 'phone', label: 'Téléphone'}
      ],
      filter: null
    }
  },
  created() {
    for(let c of store.clients) if(c._id == this.id) this.client = cloneDeep(c);
  },
  methods: {
    save() {
      for(let c of store.clients) if(c._id == this.id) c = this.client;
      console.log("Oké");
    }
  },
  components: {
    EditForm,
  }
}
</script>


