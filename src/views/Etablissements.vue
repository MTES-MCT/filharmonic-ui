<template lang="pug">
v-container
  h1.display-1.font-weight-bold.mb-4 Liste des établissements
  v-list.transparent(two-line)
    v-list-tile(v-for="etablissement in etablissements" :key="etablissement.id")
      v-list-tile-content
        v-list-tile-title
          span.body-2 {{ etablissement.nom }}
          span.ml-2.caption
            router-link(to="/etablissements/1") ({{ etablissement.id }})
        v-list-tile-sub-title {{ etablissement.adresse }}
</template>

<script>
export default {
  data () {
    return {
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
  }
}
</script>
