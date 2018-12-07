<template lang="pug">
  v-container
    v-flex.xs12.md6.pa-2
      v-card
        v-toolbar(flat)
          v-toolbar-title Recherche d'établissements
        v-card-text
          v-form(ref="form" lazy-validation)
            v-text-field(
              v-model="nom"
              label="Nom usuel ou raison sociale")
            v-text-field(
              v-model="localisation"
              label="Localisation par commune ou code postal")
            v-text-field(
              v-model="s3ic"
              label="Code S3IC")
            v-btn(
              @click="list = true"
              color="primary") Rechercher
            v-btn(
              @click="list = false") Effacer
      v-list(two-line v-if="list")
        v-subheader Résultats
        v-list-tile(:to="`/etablissements/${etablissement.id}`" v-for="etablissement in etablissements" :key="etablissement.id")
          v-list-tile-action
            v-icon location_city
          v-list-tile-content
            v-list-tile-title {{ etablissement.nom }}
            v-list-tile-sub-title {{ etablissement.adresse }}
        v-divider
</template>

<script>
import { listAllEtablissements } from '@/api/etablissements'

export default {
  data () {
    return {
      list: false,
      etablissements: [],
      nom: '',
      localisation: '',
      s3ic: ''
    }
  },
  async created () {
    this.etablissements = await listAllEtablissements()
    if (!this.etablissement) {
      this.errorNotFound = true
    }
  }
}
</script>
