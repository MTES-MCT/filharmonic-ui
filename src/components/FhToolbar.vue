<template lang="pug">
.fh-toolbar
  slot
</template>

<script>
/*
Ce composant permet de créer une toolbar sans marges latérales et avec flex automatique pour les boutons.
*/
export default {
  name: 'FhToolbar'
}
</script>

<style lang="stylus">
.fh-toolbar
  display flex
  flex-direction row
  background-color #f0f0f0

  // surcharge vuetify pour étirer les boutons
  .v-btn
    display flex
    height inherit
    margin 0
</style>
