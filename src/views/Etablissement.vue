<template lang="pug">
  div
    p.display-1.mt-4.text-xs-center(v-if="error") Etablissement non existant. Mauvaise URL ?
    v-container
      fh-detail-etablissement(v-if="!error", :etablissement="etablissement", :expand="expandEtablissement")
      v-list(two-line subheader v-if="!error")
        v-subheader
          v-flex Inspections
          v-btn(:to="`/etablissements/${id}/inspections/new`" round color="primary" small title="Démarrer un inspection")
            v-icon(left) add
            | Nouvelle inspection
        v-list-tile(:to="`/inspections/${inspection.id}`" v-for="inspection in inspections" :key="inspection.id")
          v-list-tile-action
            fh-etat-inspection(:etat="inspection.etat")
          v-list-tile-content
            v-list-tile-title Inspection n° {{ inspection.id }} du {{ inspection.date }}
        v-divider

</template>

<script>
import { getEtablissement } from '@/api/etablissements'
import { getInspectionsByEtablissement } from '@/api/inspections'
import FhEtatInspection from '@/components/FhEtatInspection.vue'
import FhDetailEtablissement from '@/components/FhDetailEtablissement.vue'
export default {
  components: {
    FhEtatInspection,
    FhDetailEtablissement
  },
  data () {
    return {
      error: false,
      inspections: [],
      id: '',
      etablissement: null,
      expandEtablissement: [ true ]
    }
  },
  async created () {
    this.id = this.$route.params.id
    if (!this.id) {
      this.error = true
    }
    this.etablissement = await getEtablissement(this.id)
    if (!this.etablissement) {
      this.error = true
    }
    this.inspections = await getInspectionsByEtablissement(this.id)
    if (!this.inspections) {
      this.error = true
    }
  }
}
</script>
