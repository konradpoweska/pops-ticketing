<template>
  <div v-if="store.user">
    <Navbar></Navbar>
    <Tabs></Tabs>
  </div>
  <Authenticate v-else></Authenticate>
</template>

<script>
import Vue from "vue";
import Authenticate from "./views/authenticate.vue";
import store from '~/store';

import {BootstrapVue, BootstrapVueIcons} from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);

import Navbar from "./components/navbar";
import Tabs from "./components/tabs";

export default Vue.extend({
  components: {
    Navbar,
    Tabs,
    Authenticate,
  },
  data(){
    return{
      store,
    }
  }
});
</script>
