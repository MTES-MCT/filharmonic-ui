<template lang="pug">
fh-page(:wait="wait")
  template(slot-scope="_")
    v-container
      fh-detail-etablissement(:etablissement="etablissement" expand)
      v-list(two-line subheader)
        v-subheader
          v-flex Inspections
          v-btn(:to="`/etablissements/${etablissementId}/inspections/new`" round color="primary" small title="Démarrer une inspection")
            v-icon(left) add
            | Nouvelle inspection
        v-list-tile(:to="`/inspections/${inspection.id}`" v-for="inspection in etablissement.inspections" :key="inspection.id")
          v-list-tile-action
            fh-etat-inspection(:etat="inspection.etat")
          v-list-tile-content
            v-list-tile-title Inspection n° {{ inspection.id }} du {{ inspection.date }}
        v-divider

</template>

<script>
import FhEtatInspection from '@/components/FhEtatInspection.vue'
import FhDetailEtablissement from '@/components/FhDetailEtablissement.vue'
import BasePage from '@/views/mixins/BasePage'

export default {
  components: {
    FhEtatInspection,
    FhDetailEtablissement
  },
  mixins: [BasePage],
  props: {
    etablissementId: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      etablissement: null
    }
  },
  async created () {
    this.wait = this.$api.etablissements.get(this.etablissementId, {
      inspections: true
    })
    this.etablissement = await this.wait
  }
}
</script>
