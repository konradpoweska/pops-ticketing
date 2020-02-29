<template>
  <b-container fluid="lg">
    <b-row class="mb-2">
      <b-col><h2>Tickets</h2></b-col>
      <b-col class="text-right">
        <b-button v-b-toggle.collapse-1 variant="secondary">Filtrer</b-button>
        <b-button variant="secondary" @click="fetch"><b-icon-arrow-clockwise /></b-button>
        <b-button variant="primary" @click="newTicket"><b>+</b> Nouveau</b-button>
      </b-col>
    </b-row>

    <div>
      <b-collapse id="collapse-1" class="mt-2">
        <b-card class="mb-2" title="Filtres">
          <b-row>
            <b-col>
              <b-form-group id="input-group-1" label="Par numéro d'Id" label-for="input-1" class="mb-4">
                <b-form-input id="input-1" required placeholder="Entrer l'Id du ticket"></b-form-input>
              </b-form-group>

              <b-form-group label="Par statut des tickets" label-for="checkbox-group-2" class="mb-4">
                <b-form-checkbox-group id="checkbox-group-2" v-model="selected" name="status">
                  <b-form-checkbox value="open">Ouverts</b-form-checkbox>
                  <b-form-checkbox value="running">En cours</b-form-checkbox>
                  <b-form-checkbox value="closed">Fermés</b-form-checkbox>
                </b-form-checkbox-group>
              </b-form-group>
              <b-form-group label="Par date de création" class="mb-4">
                <b-form inline>
                  <label for="start-date" class="mr-sm-2">De </label>
                  <b-form-datepicker v-model="value" id="start-date" size="sm"></b-form-datepicker>
                  <!--<b-form-input id="start-date" type="date"></b-form-input>-->
                  <label for="end-date" class="ml-sm-2 mr-sm-2"> à </label>
                  <b-form-datepicker v-model="value" id="end-date" size="sm"></b-form-datepicker>
                  <!--<b-form-input id="end-date" type="date"></b-form-input>-->
                </b-form>
              </b-form-group>
            </b-col>
            <b-col>
              <b-form-group label="Par client" description="Pour sélectionner plusieurs clients, maintenir la touche Ctrl enfoncée">
                <b-form-select v-model="selected" :options="options" multiple :select-size="4"></b-form-select>
              </b-form-group>

              <b-form-group id="input-group-3" label="Par demandeur" label-for="input-3">
                <b-form-input id="input-3" required placeholder="Entrer le nom du demandeur"></b-form-input>
              </b-form-group>
            </b-col>
          </b-row>
        </b-card>
      </b-collapse>
    </div>

    <TicketsTable :items="tickets"></TicketsTable>

  </b-container>
</template>

<script>
import TicketsTable from "~/components/tickets-table"

export default {
  data: () => ({
    tickets: null,
    options: [
          { value: 'a', text: 'Corp' },
          { value: 'b', text: 'Society' }
        ]
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
