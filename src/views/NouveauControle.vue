<template lang="pug">
v-container.grid-list-lg.controle-form
  v-alert.text-xs-center(type="error" :value="error") L'établissement '#[strong {{ this.$route.params.id }}]' ne semble pas exister. Mauvaise URL ?
  div(v-if="etablissement")
    h1.display-2 Nouveau contrôle

    v-card.mt-4
      v-toolbar(flat)
        v-toolbar-title Etablissement {{ etablissement.nom }} n°{{ etablissement.id }}
      v-card-text
        v-container.pa-0.grid-list-sm
          v-layout
            v-flex S3IC
            v-flex.text-xs-right {{ etablissement.id }}
          v-layout
            v-flex Nom usuel
            v-flex.text-xs-right {{ etablissement.nom }}
          v-layout
            v-flex Raison sociale
            v-flex.text-xs-right {{ etablissement.raison }}
          v-layout
            v-flex Adresse
            v-flex.text-xs-right {{ etablissement.adresse }}
          v-layout
            v-flex Activité principale
            v-flex.text-xs-right {{ etablissement.activite }}
          v-layout
            v-flex Régime Seveso
            v-flex.text-xs-right Haut

    h4.display-1.mt-4 Détails du contrôle

    v-form(ref="form" v-model="validForm" lazy-validation)
      fh-detail-controle(:controle="controle")
      v-btn(block @click="createControle" :disabled="!validForm" color="primary") Créer le contrôle
</template>

<script>
import FhDetailControle from '@/components/FhDetailControle.vue'
import { createControle } from '@/api/controles'
import { getEtablissement } from '@/api/etablissements'

export default {
  components: {
    FhDetailControle
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
        themes: []
      },
      etablissement: null, // fetched on init
      validForm: false
    }
  },
  async created () {
    this.etablissement = await getEtablissement(this.$route.params.id)
    if (!this.etablissement) {
      this.error = true
    }
  },
  methods: {
    async createControle () {
      if (this.$refs.form.validate()) {
        const controleId = await createControle({
          ...this.controle,
          etablissement: this.etablissement
        })
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
