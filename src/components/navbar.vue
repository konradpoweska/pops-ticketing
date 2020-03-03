<template>
  <b-navbar toggleable="md">

      <b-navbar-brand class="logo">
        POPS<span>1920</span>
      </b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>

        <b-navbar-nav>
          <b-nav-item @click="$root.$emit('open-tab', {type: 'Tickets'})">Tickets</b-nav-item>
          <b-nav-item @click="$root.$emit('open-tab', {type: 'Clients'})">Clients</b-nav-item>
          <b-nav-item @click="$root.$emit('open-tab', {type: 'Interventions'})">Interventions</b-nav-item>
          <b-nav-item @click="$root.$emit('open-tab', {type: 'Users'})">Utilisateurs</b-nav-item>

        </b-navbar-nav>

        <!-- Right -->
        <b-navbar-nav class="ml-auto">
          <b-nav-item-dropdown right :text="store.user.name">
            <b-dropdown-item href="#" @click="store.user = undefined">Déconnexion</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>

      </b-collapse>

    </b-navbar>
</template>


<script>
import store from '~/store';

export default {
  data: () => ({
    store,
  }),
}
</script>


<style scoped>
.navbar {
  padding-bottom: 0.1rem; /* Brings tabs closer */
}
.logo {
  font-size: 2rem;
  font-family: 'Courier New', Courier, monospace;
  font-weight: bold;
  line-height: 1.0;
  padding: 0;
}
.logo span {
  font-size: 1.4rem;
}
</style>
