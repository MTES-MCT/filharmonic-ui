<template lang="pug">
v-container.grid-list-lg.controle-form
  v-alert.text-xs-center(type="error" :value="error") L'établissement '#[strong {{ this.$route.params.id }}]' ne semble pas exister. Mauvaise URL ?
  div(v-if="controle.etablissement")
    h1.display-2 Nouveau contrôle
    fh-detail-etablissement(v-if="!error", :etablissement="controle.etablissement")

    h4.display-1.mt-4 Détails du contrôle

    v-form(ref="form" v-model="validForm" lazy-validation)
      fh-detail-controle(:controle="controle")
      v-btn(block @click="createControle" :disabled="!validForm" color="primary") Créer le contrôle
</template>

<script>
import FhDetailControle from '@/components/FhDetailControle.vue'
import { createControle } from '@/api/controles'
import { getEtablissement } from '@/api/etablissements'
import FhDetailEtablissement from '@/components/FhDetailEtablissement.vue'

export default {
  components: {
    FhDetailControle,
    FhDetailEtablissement
  },
  data () {
    return {
      error: false,
      controle: {
        date: '',
        type: 'courant',
        annonce: true,
        origine: 'plan_de_controle',
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
    this.controle.etablissement = await getEtablissement(this.$route.params.id)
    if (!this.controle.etablissement) {
      this.error = true
    }
  },
  methods: {
    async createControle () {
      if (this.$refs.form.validate()) {
        const controleId = await createControle(this.controle)
        this.$router.push(`/controles/${controleId}`)
      }
    }
  }
}
</script>

<style lang="stylus">
.controle-form
  max-width 600px
</style>
