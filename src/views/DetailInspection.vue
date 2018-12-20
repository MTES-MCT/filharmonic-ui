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
            v-btn(flat :to="`/inspections/${detail.id}/details/edit`" title="Modifier l'inspection")
              v-icon(medium) edit
        v-card-text
          fh-detail-inspection(readonly)
    v-flex.xs12.md6.pa-2
      fh-detail-etablissement(expand)
</template>

<script>
import FhDetailInspection from '@/components/FhDetailInspection.vue'
import FhDetailEtablissement from '@/components/FhDetailEtablissement.vue'
import { createNamespacedHelpers } from 'vuex'
const { mapState: mapDetailState } = createNamespacedHelpers('inspection/detail')

export default {
  components: {
    FhDetailInspection,
    FhDetailEtablissement
  },
  computed: {
    ...mapDetailState({
      detail: state => state.rows[0]
    })
  }
}
</script>

<style lang="stylus">
</style>
