<template lang="pug">
v-container
  h1.display-1.font-weight-bold.mb-4 Liste des installations
  v-list.transparent(two-line)
    v-list-tile(v-for="installation in installations" :key="installation.id")
      v-list-tile-content
        v-list-tile-title
          span.body-2 {{ installation.nom }}
          span.ml-2.caption ({{ installation.id }})
        v-list-tile-sub-title {{ installation.adresse }}
</template>

<script>
export default {
  data () {
    return {
      installations: [
        {
          id: '0999.00001',
          nom: 'Installation A',
          adresse: '123 rue de Paris'
        },
        {
          id: '0999.00002',
          nom: 'Installation B',
          adresse: '123 rue de Paris'
        },
        {
          id: '0999.00003',
          nom: 'Installation C',
          adresse: '123 rue de Paris'
        },
        {
          id: '0999.00004',
          nom: 'Installation D',
          adresse: '123 rue de Paris'
        },
        {
          id: '0999.00005',
          nom: 'Installation E',
          adresse: '123 rue de Paris'
        },
        {
          id: '0999.00006',
          nom: 'Installation F',
          adresse: '123 rue de Paris'
        }
      ]
    }
  }
}
</script>
