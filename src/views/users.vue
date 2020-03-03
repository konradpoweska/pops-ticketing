<!--Vue gestion des utilisateurs-->
<template>
  <EditForm @submit.prevent="save">
    <b-row>
      <b-col><h2>Gestion des utilisateurs</h2></b-col>
    </b-row>
    <b-table
      sticky-header
      responsive="sm"
      sort-icon-left
      hover
      :items="users"
      :fields="fieldsUser"
      :busy="users == null"
    >
      <template v-slot:cell(actions)="row">
        <b-button @click="row.toggleDetails" class="py-0">
          <b-icon-pencil />
        </b-button>
      </template>

      <template v-slot:row-details="row">
        <b-card>
          <b-row>
            <b-col >
              <b-row>
                <b-form-group label="Nom">
                  <b-form-input v-model="row.item.name"></b-form-input>
                </b-form-group>
              </b-row>

              <b-row>
                <b-form-group label="Email">
                  <b-form-input v-model="row.item.email"></b-form-input>
                </b-form-group>
              </b-row>
            </b-col>

            <b-col>
              <b-row>
                <b-form-group label="Identifiant">
                  <b-form-input v-model="row.item.username"></b-form-input>
                </b-form-group>
              </b-row>

              <b-row>
                <b-form-group label="Mot de passe">
                  <b-form-input v-model="row.item.password"></b-form-input>
                </b-form-group>
              </b-row>
            </b-col>

            <!--Ajouter les droits?-->
            <!--Pose des problèmes au niveau de la console-->
            <b-col>
              <b-row>
                <b-form-group label="Droits">
                  <b-form-input v-model="row.item.rights"></b-form-input>
                </b-form-group>
              </b-row>
            </b-col>
            <!--Ajouter les compétences si user.rights == technicien-->

          </b-row>
        </b-card>
      </template>
    </b-table>
  </EditForm>
</template>

<script>
  import store from '~/store';
  import cloneDeep from 'lodash/cloneDeep';
  import EditForm from '~/components/edit-form';

  export default {
    data() {
      return {
        users: null,
        fieldsUser:[
          {key: "actions"},
          {key: 'name',label: 'Nom'},
          {key: 'rights',label: 'Droits'},
          {key: 'email',label: 'email'},
          //TODO - Implémenter les skills pour les techniciens
          //{key: 'skills',label: 'Compétences'},
        ]
      }
    },
     created() {
      fetch('/api/users')
      .then(res => res.json())
      .then(arr => {
        this.users = arr;
      });
      //TODO - Faire une copie des elements pour eviter modifications en dur
    },
    methods: {
      save() {
        //TODO - Sauver les modifications
        console.log("Oké");
      }
    },
    components: {
      EditForm,
    }
  }

</script>
