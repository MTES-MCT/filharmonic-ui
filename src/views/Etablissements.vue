<template lang="pug">
v-container
 v-flex.xs12.md6.pa-2
      v-card
        v-toolbar(flat)
          v-toolbar-title Recherche d'établissements
        v-card-text
          v-form(ref="form" lazy-validation)
            v-text-field(
              v-model="name"
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
          v-template(v-for="(etablissement,index) in etablissements", :key="etablissement.id")
            v-list-tile(@click="show", :key="etablissement.id")
              v-list-tile-action
                v-icon location_city
              v-list-tile-content
                v-list-tile-title {{ etablissement.nom }}
                v-list-tile-subtitle {{ etablissement.adresse }}
            v-divider
</template>

<script>
export default {
  data () {
    return {
      list: false,
      etablissements: [
        {
          id: '0999.00001',
          nom: 'Etablissement A',
          adresse: '123 rue de Paris'
        },
        {
          id: '0999.00002',
          nom: 'Etablissement B',
          adresse: '123 rue de Paris'
        },
        {
          id: '0999.00003',
          nom: 'Etablissement C',
          adresse: '123 rue de Paris'
        },
        {
          id: '0999.00004',
          nom: 'Etablissement D',
          adresse: '123 rue de Paris'
        },
        {
          id: '0999.00005',
          nom: 'Etablissement E',
          adresse: '123 rue de Paris'
        },
        {
          id: '0999.00006',
          nom: 'Etablissement F',
          adresse: '123 rue de Paris'
        }
      ]
    }
  },
  methods: {
    show () {
      this.$router.push('/etablissements/1')
    }
  }
}
</script>
