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
              @click="listEtablissements()"
              color="primary") Rechercher
            v-btn(@click="resetForm") Effacer

      v-list(two-line)
        .fh-loadingbar
          v-progress-linear.my-0(v-if="loading" indeterminate height="4")
        template(v-if="results")
          v-list-tile(v-if="results.etablissements.length === 0") Aucun résultat
          template(v-else)
            v-subheader
              | {{ results.total }} résultat
              span(v-if="results.etablissements.length > 1") s
            v-pagination.fh-pagination(:value="filter.page" @input="changePage" :length="totalPages")
            template(v-for="etablissement in results.etablissements")
              v-divider
              v-list-tile(:to="`/etablissements/${etablissement.id}`" :key="etablissement.id")
                v-list-tile-action
                  v-icon location_city
                v-list-tile-content
                  v-list-tile-title {{ etablissement.raison }}
                  v-list-tile-sub-title {{ etablissement.adresse }}

</template>

<script>
import * as _ from '@/util'

export default {
  data () {
    return {
      results: null,
      filter: {
        s3ic: '',
        nom: '',
        adresse: '',
        page: 1
      },
      loading: false
    }
  },
  computed: {
    totalPages () {
      return this.results ? Math.ceil(this.results.total / 50) : 1
    }
  },
  created () {
    const previousSearch = this.$store.state.rechercheEtablissements
    if (previousSearch) {
      this.filter = _.cloneDeep(previousSearch.filter)
      this.results = previousSearch.results
    }
  },
  methods: {
    resetForm () {
      this.results = null
      this.$store.commit('saveRechercheEtablissements', null)
      this.filter = {
        page: 1
      }
    },
    async listEtablissements (keepPage = false) {
      if (!keepPage) {
        this.filter.page = 1
      }
      // delay the loader to prevent flashing if the server is fast
      const loader = setTimeout(() => {
        this.loading = true
      }, 300)
      try {
        this.results = await this.$api.etablissements.list(this.filter)
        this.$store.commit('saveRechercheEtablissements', _.cloneDeep({
          filter: this.filter,
          results: this.results
        }))
      } finally {
        this.loading = false
        clearTimeout(loader)
      }
    },
    changePage (newPage) {
      this.filter.page = newPage
      this.listEtablissements(true)
    }
  }
}
</script>

<style lang="stylus">
.fh-pagination
  position sticky
  background-color rgb(250, 250, 250)
  top 64px
  padding-top 10px
  padding-bottom 10px
  z-index 1
  width 100%

  @media (max-width: 960px) // breakpoint vuetify
    top 48px

.fh-loadingbar
  height 32px
  padding-top 16px
</style>
