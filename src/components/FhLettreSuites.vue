<template lang="pug">
v-dialog.d-block(:value="showDialog" @input="$emit('close')" scrollable width="800px")
  v-card
    v-toolbar(color="primary" dark)
      v-toolbar-title.headline Lettre de suites
      v-spacer
      v-toolbar-items
        v-btn(flat dark @click="$emit('close')")
          v-icon close
    v-card-text.pa-5(v-html="lettre")
</template>

<script>
// quasiment à l'identique avec FhLettreAnnonce... pourrait probablement être amélioré
export default {
  name: 'FhLettreSuite',
  props: {
    inspection: {
      type: Object,
      required: true
    },
    showDialog: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    lettre () {
      return this.showDialog && this.$api.lettres.genererLettreSuites(this.inspection)
    }
  }
}
</script>

<style lang="stylus">
</style>
