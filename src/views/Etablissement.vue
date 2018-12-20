<template lang="pug">
fh-page(:wait="wait")
  template(slot-scope="_")
    v-container
      fh-detail-etablissement(expand)
      v-list(two-line subheader)
        v-subheader
          v-flex Inspections
          v-btn(:to="`/etablissements/${etablissement.id}/inspections/new`" round color="primary" small title="Démarrer une inspection")
            v-icon(left) add
            | Nouvelle inspection
        v-list-tile(:to="`/inspections/${inspection.id}`" v-for="inspection in etablissement.inspections" :key="inspection.id")
          v-list-tile-action
            fh-etat-inspection
          v-list-tile-content
            v-list-tile-title Inspection n° {{ inspection.id }} du {{ inspection.date }}
        v-divider

</template>

<script>
import FhEtatInspection from '@/components/FhEtatInspection.vue'
import FhDetailEtablissement from '@/components/FhDetailEtablissement.vue'
import BasePage from '@/views/mixins/BasePage'
import { createNamespacedHelpers } from 'vuex'
const { mapState: mapEtablissementState } = createNamespacedHelpers('inspection/detail')

export default {
  components: {
    FhEtatInspection,
    FhDetailEtablissement
  },
  mixins: [BasePage],
  data () {
    return {
      etablissement: null
    }
  },
  computed: {
    ...mapEtablissementState({
      etablissement: state => state.rows[0]
    })
  }
}
</script>
