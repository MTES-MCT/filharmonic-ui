<template lang="pug">
v-container.grid-list-lg.inspection-form
  v-alert.text-xs-center(type="error" :value="error") L'établissement '#[strong {{ this.$route.params.id }}]' ne semble pas exister. Mauvaise URL ?
  div(v-if="inspection.etablissement")
    h1.display-2 Nouvelle inspection
    fh-detail-etablissement(:etablissement="inspection.etablissement")

    h4.display-1.mt-4 Détails de l'inspection

    v-form(ref="form" v-model="validForm" lazy-validation)
      fh-detail-inspection(:inspection="inspection")
      v-btn(block @click="createInspection" :disabled="!validForm" color="primary") Créer l'inspection
</template>

<script>
import FhDetailInspection from '@/components/FhDetailInspection.vue'
import { createInspection } from '@/api/inspections'
import { getEtablissement } from '@/api/etablissements'
import FhDetailEtablissement from '@/components/FhDetailEtablissement.vue'

export default {
  components: {
    FhDetailInspection,
    FhDetailEtablissement
  },
  data () {
    return {
      error: false,
      inspection: {
        date: '',
        type: 'courant',
        annonce: true,
        origine: 'plan_de_inspection',
        circonstances: '',
        detailCirconstances: '',
        inspecteurs: [],
        themes: [],
        etablissementId: this.$route.params.id,
        etablissement: null // fetched on init
      },
      validForm: false
    }
  },
  async created () {
    this.inspection.etablissement = await getEtablissement(this.$route.params.id)
    if (!this.inspection.etablissement) {
      this.error = true
    }
  },
  methods: {
    async createInspection () {
      if (this.$refs.form.validate()) {
        const inspectionId = await createInspection(this.inspection)
        this.$router.push(`/inspections/${inspectionId}`)
      }
    }
  }
}
</script>

<style lang="stylus">
.inspection-form
  max-width 600px
</style>
