<template lang="pug">
  v-container
    v-flex.xs12.md6.pa-2
      v-card
        v-toolbar(flat)
          v-toolbar-title Recherche d'établissements
        v-card-text
          v-form(ref="form" lazy-validation)
            v-text-field(
              v-model="filter.nom"
              label="Nom usuel ou raison sociale")
            v-text-field(
              v-model="filter.adresse"
              label="Localisation par commune ou code postal")
            v-text-field(
              v-model="filter.s3ic"
              label="Code S3IC")
            v-btn(
              @click="listEtablissements"
              color="primary") Rechercher
            v-btn(@click="resetForm") Effacer

      v-list(two-line v-if="showResults")
        v-subheader Résultats
        v-list-tile(v-if="etablissements.length === 0") Aucun résultat
        template(v-else)
          template(v-for="etablissement in etablissements")
            v-list-tile(:to="`/etablissements/${etablissement.id}`" :key="etablissement.id")
              v-list-tile-action
                v-icon location_city
              v-list-tile-content
                v-list-tile-title {{ etablissement.raison }}
                v-list-tile-sub-title {{ etablissement.adresse }}
            v-divider

</template>

<script>
import * as _ from '@/util'

export default {
  data () {
    return {
      showResults: false,
      etablissements: [],
      filter: {
        s3ic: '',
        nom: '',
        adresse: ''
      }
    }
  },
  created () {
    this.filter = _.cloneDeep(this.$store.state.rechercheEtablissements.filter)
    this.etablissements = this.$store.state.rechercheEtablissements.results
    this.showResults = this.etablissements.length > 0
  },
  methods: {
    resetForm () {
      this.filter = {}
      this.showResults = false
      this.$store.commit('saveRechercheEtablissements', {
        filter: {},
        results: []
      })
    },
    async listEtablissements () {
      this.showResults = true
      this.etablissements = await this.$api.etablissements.list(this.filter)
      this.$store.commit('saveRechercheEtablissements', _.cloneDeep({
        filter: this.filter,
        results: this.etablissements
      }))
    }
  }
}
</script>
