<template lang="pug">
fh-page(:wait="wait")
  template(slot-scope="_")
    v-container.grid-list-lg.inspection-form
      div(v-if="inspection.etablissement")
        h1.display-2 Nouvelle inspection
        fh-detail-etablissement(:etablissement="inspection.etablissement")

        h4.display-1.mt-4 Détails de l'inspection

        v-form(ref="form" v-model="validForm" lazy-validation)
          fh-detail-inspection(:inspection="inspection")
          v-btn(block @click="createInspection" :disabled="!validForm" color="primary") Créer l'inspection
</template>

<script>
import FhDetailEtablissement from '@/components/FhDetailEtablissement.vue'
import FhDetailInspection from '@/components/FhDetailInspection.vue'
import BasePage from '@/views/mixins/BasePage'
import { ForbiddenError } from '@/errors.js'

export default {
  components: {
    FhDetailInspection,
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
      inspection: {
        date: '',
        type: 'courant',
        annonce: true,
        origine: 'plan_de_controle',
        circonstances: '',
        detailCirconstances: '',
        inspecteurs: [
          this.$store.state.authentication.user.id
        ],
        themes: [],
        etablissementId: this.etablissementId,
        etablissement: null // fetched on init
      },
      validForm: false
    }
  },
  async created () {
    if (this.$permissions.isExploitant) {
      this.wait = Promise.reject(new ForbiddenError('Il faut être inspecteur'))
      return
    }
    this.wait = this.$api.etablissements.get(this.etablissementId, {
      inspections: true
    })
    this.inspection.etablissement = await this.wait
  },
  methods: {
    async createInspection () {
      if (this.$refs.form.validate()) {
        const inspectionId = await this.$api.inspections.create(this.inspection)
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
