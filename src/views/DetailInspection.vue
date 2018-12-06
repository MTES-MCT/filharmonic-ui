<template lang="pug">
v-container
  v-layout.row.wrap.grid-list-lg
    v-flex.xs12.md6.pa-2
      v-card
        v-toolbar(flat)
          v-toolbar-title
            | Détails
          v-spacer
          v-toolbar-items
            v-btn(flat :to="`/inspections/${inspection.id}/details/edit`" title="Modifier l'inspection")
              v-icon(medium) edit
        v-card-text
          fh-detail-inspection(:inspection="inspection" readonly)
    v-flex.xs12.md6.pa-2
      fh-detail-etablissement(:etablissement="inspection.etablissement" expand)
</template>

<script>
import FhDetailInspection from '@/components/FhDetailInspection.vue'
import FhDetailEtablissement from '@/components/FhDetailEtablissement.vue'

export default {
  components: {
    FhDetailInspection,
    FhDetailEtablissement
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
</style>
