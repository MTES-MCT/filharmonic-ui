<template lang="pug">
fh-page(:wait="wait")
  template(slot-scope="_")
    v-container
      h1.display-1.font-weight-bold.mb-4 Établissement {{ etablissement.raison }} n°{{ etablissement.s3ic }}

      v-card.mb-4
        v-toolbar(flat)
          v-toolbar-title
            | Détails
        v-card-text
          fh-detail-etablissement(:etablissement="etablissement" expand)

      v-card
        v-list(two-line subheader)
          v-subheader
            v-flex.title Inspections
            v-btn(:to="`/etablissements/${etablissementId}/inspections/new`" round color="primary" small title="Démarrer une inspection" v-if="$permissions.isInspecteur")
              v-icon(left) add
              | Nouvelle inspection
          template(v-for="(inspection, index) in etablissement.inspections")
            v-list-tile(:to="`/inspections/${inspection.id}`" :key="inspection.id")
              v-list-tile-action
                fh-etat-inspection(:etat="inspection.etat")
              v-list-tile-content
                v-list-tile-title Inspection n° {{ inspection.id }} du {{ inspection.date }}
            v-divider(v-if="index + 1 < etablissement.inspections.length")

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
    this.wait = this.$api.etablissements.get(this.etablissementId)
    this.etablissement = await this.wait
  }
}
</script>
