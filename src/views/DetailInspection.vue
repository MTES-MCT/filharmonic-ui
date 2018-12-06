<template lang="pug">
v-container.grid-list-lg.inspection-form
  v-alert.text-xs-center(type="error" :value="error") L'inspection '#[strong {{ inspectionId }}]' ne semble pas exister. Mauvaise URL ?
  div(v-if="inspection")
    h1.display-1
      v-btn(icon large :to="`/inspections/${inspection.id}`" title="Revenir au inspection")
        v-icon(x-large) chevron_left
      | Inspection de {{ inspection.etablissement.nom }} du {{ inspection.date.toLocaleString() }}

    fh-detail-etablissement(v-if="!error", :etablissement="inspection.etablissement")

    h4.display-1.mt-4 Détails

    fh-detail-inspection(:inspection="inspection")
</template>

<script>
import FhDetailInspection from '@/components/FhDetailInspection.vue'
import FhDetailEtablissement from '@/components/FhDetailEtablissement.vue'
import { getInspection } from '@/api/inspections'

export default {
  components: {
    FhDetailInspection,
    FhDetailEtablissement
  },
  props: {
    inspectionId: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      error: false,
      inspection: null // fetched on init
    }
  },
  async created () {
    this.inspection = await getInspection(this.inspectionId, { etablissement: true })
    if (!this.inspection) {
      this.error = true
    }
  }
}
</script>

<style lang="stylus">
.inspection-form
  max-width 600px
</style>
