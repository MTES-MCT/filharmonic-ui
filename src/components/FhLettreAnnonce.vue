<template lang="pug">
v-dialog(v-model="showDialog" scrollable width="800px")
  v-btn(flat slot="activator")
    v-icon local_printshop
    span.ml-2 Générer la lettre d'annonce
  v-card
    v-toolbar(color="primary" dark)
      v-toolbar-title.headline Lettre d'annonce
      v-spacer
      v-toolbar-items
        v-btn(flat dark @click="showDialog = false")
          v-icon close
    v-card-text.pa-5(v-html="lettre")
</template>

<script>
export default {
  name: 'FhLettreAnnonce',
  props: {
    inspection: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      showDialog: false,
      text: ''
    }
  },
  computed: {
    lettre () {
      return this.showDialog && this.$api.lettres.genererLettreAnnonce(this.inspection)
    }
  }
}
</script>

<style lang="stylus">
</style>
