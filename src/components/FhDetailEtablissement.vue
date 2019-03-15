<template lang="pug">
v-container.pa-0.grid-list-sm
  v-layout
    v-flex S3IC
    v-flex.text-xs-right {{ etablissement.s3ic }}
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
    v-flex Régime
    v-flex.text-xs-right {{ regimeEtablissement }}
  v-layout
    v-flex IED-MTD
    v-flex.text-xs-right {{ etablissement.iedmtd ? 'Oui' : 'Non' }}
  v-layout
    v-flex Régime Seveso
    v-flex.text-xs-right {{ etablissement.seveso | capitalize }}
  v-layout.align-center(v-if="etablissement.exploitants")
    v-flex Responsables
    v-flex.text-xs-right
      v-chip(v-for="exploitant in etablissement.exploitants" :key="exploitant.id" small)
        | {{ exploitant.prenom }} {{ exploitant.nom }}
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
  computed: {
    regimeEtablissement () {
      switch (this.etablissement.regime) {
        case 'aucun': return 'Aucun'
        case 'autorisation': return 'Autorisation'
        case 'declaration': return 'Déclaration'
        case 'enregistrement': return 'Enregistrement'
        default: throw new Error(`Regime inconnu : '${this.etablissement.regime}'`)
      }
    }
  },
  created () {
    this.panelExpansion = [ this.expand ]
  }
}
</script>
