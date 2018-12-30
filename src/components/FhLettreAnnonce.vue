<template lang="pug">
v-dialog.d-block(:value="showDialog" @input="$emit('close')" scrollable width="800px")
  v-card
    v-toolbar(color="primary" dark)
      v-toolbar-title.headline Lettre d'annonce
      v-spacer
      v-toolbar-items
        v-btn(flat dark @click="$emit('close')")
          v-icon close
    v-card-text.pa-5(v-html="lettre")
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapState: mapDetailState } = createNamespacedHelpers('inspection/detail')
const { mapState: mapEtablissementState } = createNamespacedHelpers('inspection/etablissement')
const { mapState: mapEchangeState } = createNamespacedHelpers('inspection/echange')
const { mapState: mapAuthenticationState } = createNamespacedHelpers('authentication')
// quasiment à l'identique avec FhLettreSuites... pourrait probablement être amélioré
export default {
  name: 'FhLettreAnnonce',
  props: {
    showDialog: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    ...mapDetailState({ detail: state => state.rows[0] }),
    ...mapEtablissementState({ etablissement: state => state.rows[0] }),
    ...mapAuthenticationState({ user: state => state.rows[0].user }),
    ...mapEchangeState({ echanges: 'rows' }),
    lettre () {
      return this.showDialog && this.$api.lettres.genererLettreAnnonce(this.detail, this.etablissement, this.echanges, this.user)
    }
  }
}
</script>

<style lang="stylus">
</style>
