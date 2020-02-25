<template>
  <b-form v-on="$listeners" v-bind="$attrs">

    <b-container fluid="lg" style="margin-bottom: 5rem;">
      <slot></slot>
    </b-container>

    <div class="bg-dark text-white px-4 py-2 button-bar">
      <b-container>
        <slot name="button-bar">
          <b-button variant="danger"  type="reset">Annuler</b-button>
          <b-button variant="primary" type="submit" class="px-4">Enregistrer</b-button>
        </slot>
      </b-container>
    </div>

  </b-form>
</template>

<style scoped>
.button-bar {
  position: fixed;
  text-align: right;
  bottom: 0;
  width: 100vw;
}
</style>
