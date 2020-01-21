<template>
    <Tabs></Tabs>
</template>

<script>
import Vue from "vue";

import BootstrapVue from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
Vue.use(BootstrapVue);

import Tabs from "./components/tabs.vue";

export default Vue.extend({
  components: {
    Tabs
  }
});
</script>
