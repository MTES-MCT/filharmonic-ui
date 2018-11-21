<template lang="pug">
div
  p.display-1.mt-4.text-xs-center(v-if="errorNotFound") Etablissement non existant. Mauvaise URL ?
  v-container(v-if="etablissement")
    v-flex.xs12.md6.pa-2
      v-card
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
      v-list(two-line subheader)
        v-subheader Contrôles
        v-list-tile(@click="show(controle.id)", v-for="controle in controles", :key="controle.id")
          v-list-tile-action
            v-chip(:color="controle.state === 2 ? 'green' : 'grey'" text-color="white") {{ controle.state === 2 ? 'En cours' : 'Terminé' }}
          v-list-tile-content
            v-list-tile-title Contrôle n° {{ controle.id }} du {{ controle.date.toLocaleDateString() }}
        v-divider

</template>

<script>
import { getEtablissement } from '@/api/etablissements'
import { getControlesByEtablissement } from '@/api/controles'
export default {
  props: {
    id: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      errorNotFound: false,
      etablissement: null,
      controles: []
    }
  },
  async created () {
    this.etablissement = await getEtablissement(this.$route.params.id)
    if (!this.etablissement) {
      this.errorNotFound = true
    }
    this.controles = await getControlesByEtablissement(this.$route.params.id)
    if (!this.controles) {
      this.errorNotFound = true
    }
  },
  methods: {
    show (id) {
      this.$router.push('/controles/' + id)
    }
  }
}
</script>
