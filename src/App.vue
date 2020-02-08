<template>
  <div>
    <Navbar></Navbar>
    <Tabs></Tabs>
  </div>
</template>

<script>
import Vue from "vue";

import BootstrapVue from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
Vue.use(BootstrapVue);

import Navbar from "./components/navbar";
import Tabs from "./components/tabs";

export default Vue.extend({
  components: {
    Navbar,
    Tabs
  }
});
</script>
