<template lang="pug">
v-list-tile.fh-inspection-item(:to="`/inspections/${inspection.id}`")
  .fh-inspection-item__etat
    fh-etat-inspection(:etat="inspection.etat")

  v-list-tile-action.mr-1.fh-inspection-item__date
    v-list-tile-title
      v-icon.mr-2 event
      time {{ inspection.date }}

  v-list-tile-content
    v-list-tile-title
      strong.ml-2 {{ inspection.etablissement.nom }}
      span.ml-4 {{ inspection.etablissement.adresse }}
    v-list-tile-sub-title
      v-chip(v-for="(theme, index) in inspection.themes" :key="index" small) {{ theme }}

  v-layout.justify-end(v-if="inspection.nb_messages_non_lus")
    fh-icone-nouveaux-messages(:messages="inspection.nb_messages_non_lus" big)
  v-icon.ml-2(v-if="inspection.validation_rejetee && !$permissions.isExploitant"
          medium color="red" title="La demande de validation a été rejetée"
          ) warning

</template>

<script>
import FhEtatInspection from '@/components/FhEtatInspection.vue'
import FhIconeNouveauxMessages from '@/components/FhIconeNouveauxMessages.vue'
import FhMessage from '@/components/FhMessage.vue'

export default {
  name: 'FhInspectionItem',
  components: {
    FhEtatInspection,
    FhIconeNouveauxMessages,
    FhMessage
  },
  props: {
    inspection: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="stylus">
.fh-inspection-item
  &__date
    min-width 130px
    font-size 1.1em
  &__etat
    min-width 180px
    text-align center
</style>
