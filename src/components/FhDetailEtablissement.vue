<template lang="pug">
  v-expansion-panel(expand v-model="panelExpansion")
    v-expansion-panel-content
      div(slot="header") Etablissement {{ etablissement.nom }} n°{{ etablissement.id }}
      v-card
        v-toolbar(flat)
          v-toolbar-title Détails
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
              v-flex IED-MTD
              v-flex.text-xs-right {{ etablissement.iedmtd ? 'Oui' : 'Non' }}
            v-layout
              v-flex Régime Seveso
              v-flex.text-xs-right {{ etablissement.seveso | capitalize }}
</template>

<script>
export default {
  name: 'FhDetailEtablissement',
  props: {
    etablissement: {
      type: Object,
      required: true
    },
    expand: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      panelExpansion: null
    }
  },
  created () {
    this.panelExpansion = [ this.expand ]
  }
}
</script>
