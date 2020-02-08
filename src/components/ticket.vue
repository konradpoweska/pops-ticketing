<template>
  <div>
    *vue détaillée du ticket #{{ id }}*
    <div class="code" v-html="content"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      content: null
    }
  },
  props: ['id'],
  mounted() {
    fetch('/api/tickets/'+this.id)
      .then(res => res.json())
      .then(obj => {
        this.content = obj;
        this.$emit('title-update', `#${this.id} - ${obj.title}`);
      });
  }
}
</script>

<style>
.code {
  font-family: Consolas, monospace;
  font-size: 9pt;
  padding: .5rem;
  background: #eee;
  white-space: pre-wrap;
}
</style>
