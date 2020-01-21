<template>
  <b-card no-body>
    <b-tabs card>

      <!-- Render tabs -->
      <b-tab v-for="tab in tabs" :key="tab.id">

        <!-- Tab header with close button -->
        <template v-slot:title>
          {{ tab.title }} <b-button-close class="ml-2" @click="closeTab(tab.id)"></b-button-close>
        </template>

        <component
          :is="tab.component"
          v-bind="tab.data"
        />

      </b-tab>


      <!-- Render this if no tabs -->
      <template v-slot:empty>
        <div class="text-center text-muted">
          No tabs open.
        </div>
      </template>

    </b-tabs>
  </b-card>
</template>

<script>
import Tickets from './tickets';
import Ticket from './ticket';

export default {
  data() {
    return {
      tabs: [
        {
          id: 'tab1',
          title: 'Tickets',
          component: 'Tickets'
        },
        {
          id: 'tab2',
          title: 'Ticket #10',
          component: 'Ticket',
          data: {
            id: 10
          }
        }
      ],
    }
  },
  methods: {
    closeTab(id) {
      for (let i = 0; i < this.tabs.length; i++)
        if (this.tabs[i].id === id)
          this.tabs.splice(i, 1);
    }
  },
  components: {
    Tickets,
    Ticket
  }
}
</script>
