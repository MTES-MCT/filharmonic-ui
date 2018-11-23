<template lang="pug">
v-container.grid-list-lg.controle-form
  v-alert.text-xs-center(type="error" :value="error") Le contrôle '#[strong {{ controleId }}]' ne semble pas exister. Mauvaise URL ?
  div(v-if="controle")
    h1.display-2
      v-btn(icon large :to="`/controles/${controle.id}`" title="Revenir au contrôle")
        v-icon(x-large) chevron_left
      | Contrôle n°{{ controle.id }}

    v-card.mt-4
      v-toolbar(flat)
        v-toolbar-title Etablissement {{ controle.etablissement.nom }} n°{{ controle.etablissement.id }}
      v-card-text
        v-container.pa-0.grid-list-sm
          v-layout
            v-flex S3IC
            v-flex.text-xs-right {{ controle.etablissement.id }}
          v-layout
            v-flex Nom usuel
            v-flex.text-xs-right {{ controle.etablissement.nom }}
          v-layout
            v-flex Raison sociale
            v-flex.text-xs-right {{ controle.etablissement.raison }}
          v-layout
            v-flex Adresse
            v-flex.text-xs-right {{ controle.etablissement.adresse }}
          v-layout
            v-flex Activité principale
            v-flex.text-xs-right {{ controle.etablissement.activite }}
          v-layout
            v-flex Régime Seveso
            v-flex.text-xs-right Haut

    h4.display-1.mt-4 Détails du contrôle

    fh-detail-controle(:controle="controle")
</template>

<script>
import FhDetailControle from '@/components/FhDetailControle.vue'
import { getControle } from '@/api/controles'

export default {
  components: {
    FhDetailControle
  },
  props: {
    controleId: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      error: false,
      controle: null // fetched on init
    }
  },
  async created () {
    this.controle = await getControle(this.controleId, { etablissement: true })
    if (!this.controle) {
      this.error = true
    }
  }
}
</script>

<style lang="stylus">
.controle-form
  max-width 600px
</style>
