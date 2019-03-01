<template lang="pug">
v-container
  v-alert.ma-2(v-if="inspection.date_validation" :value="true" type="success")
    | Cette inspection a été validée le {{ new Date(inspection.date_validation).toLocaleDateString() }}.
    v-btn.ml-4(v-if="inspection.rapport" small @click="downloadRapport")
      v-icon(left) cloud_download
      | Télécharger le rapport
  v-layout.row.wrap.grid-list-lg
    v-flex.xs12.md6.pa-2
      v-card
        v-toolbar(flat)
          v-toolbar-title
            | Détails
          v-spacer
          v-toolbar-items
            v-btn(flat :to="`/inspections/${inspection.id}/details/edit`" title="Modifier l'inspection" v-if="peutEditer")
              v-icon(medium) edit
        v-card-text
          fh-detail-inspection(:inspection="inspection" readonly)
    v-flex.xs12.md6.pa-2
      fh-detail-etablissement(:etablissement="inspection.etablissement" expand)
</template>

<script>
import FhDetailInspection from '@/components/FhDetailInspection.vue'
import FhDetailEtablissement from '@/components/FhDetailEtablissement.vue'
import * as util from '@/util'

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
  },
  computed: {
    peutEditer () {
      return this.$permissions.isInspecteur && (this.inspection.etat === 'preparation' || this.inspection.etat === 'en_cours')
    }
  },
  methods: {
    async downloadRapport () {
      const url = await this.$api.inspections.getRapport(this.inspection.id)
      util.downloadFile(url, this.inspection.rapport.nom)
    }
  }
}
</script>

<style lang="stylus">
</style>
