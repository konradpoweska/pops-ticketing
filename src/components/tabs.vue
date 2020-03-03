<template>
  <b-tabs v-model="tabId">

    <!-- Render tabs -->
    <b-tab v-for="tab in tabs" :key="tab.id">

      <!-- Tab header with close button -->
      <template v-slot:title>
        {{ tab.title }} <b-button-close class="ml-2" @click="closeTab(tab.id)"></b-button-close>
      </template>

      <component
        :is="tab.type"
        v-bind="tab.data"
        @title-update="tab.title = $event"
        class="mt-3"
      />

    </b-tab>

  </b-tabs>
</template>

<script>
import isEqual from 'lodash/isEqual';
import Tickets from '~/views/tickets';
import Ticket from '~/views/ticket';
import Clients from '~/views/clients';
import Client from '~/views/client';
import Interventions from '~/views/interventions';
import Users from '~/views/users';

export default {

  data() {
    return {
      tabId: -1,
      tabIt: 0,
      tabs: []
    }
  },

  methods: {

    openTab(tab) {
      for(let i=0; i < this.tabs.length; i++)
        if(tab.type === this.tabs[i].type && isEqual(tab.data, this.tabs[i].data))
          return this.tabId = i;

      this.tabs.splice(this.tabId+1, 0, {...tab, id: this.tabIt++, title: tab.type});
      setTimeout(()=>this.tabId++, 100); // TODO: find a better way to jump to freshly created tab...
    },

    closeTab(id) {
      for (let i = 0; i < this.tabs.length; i++)
        if (this.tabs[i].id === id) {
          this.tabs.splice(i, 1);
          return;
        }
    }

  },

  components: {
    Tickets,
    Ticket,
    Clients,
    Client,
    Interventions,
    Users,
  },

  mounted() {
    this.$root.$on('open-tab', tab => this.openTab(tab));
  }

}
</script>

<style scoped>
.nav-tabs {
  padding: 0 .4rem;
  min-height: 0.5rem; /* Adds space between horizontal line and navbar if no tabs */
}
.nav-tabs .nav-link {
  padding: 0.2rem 0.6rem;
}
.nav-link .close {
  line-height: 0.9;
}
</style>
