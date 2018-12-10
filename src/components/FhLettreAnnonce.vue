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
    v-card-text
      pre.text-xs-right.
        {{ inspection.etablissement.id }}
        {{ inspection.etablissement.raison }}
        {{ inspection.etablissement.adresse }}
      pre.
        Madame, Monsieur,

        Une visite d'inspection aura lieu le {{ inspection.date }} sur votre site de {{ inspection.etablissement.adresse }}.

        Cette visite permettra d'aborder les sujets suivants :
      br
      div(v-for="echange in inspection.echanges" :key="echange.id")
        pre.strong - {{ echange.sujet }}
        pre(v-for="referenceReglementaire in echange.referencesReglementaires")    - {{ referenceReglementaire }}
      br
      pre.
        Veuillez agréer, madame, monsieur, l'expression de ma considération distinguée.

        {{ $store.state.authentication.user.name }}

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
  }
}
</script>

<style lang="stylus">
</style>
