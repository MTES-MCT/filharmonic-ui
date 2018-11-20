<template lang="pug">
v-container
  h1.display-1.font-weight-bold.mb-4 Liste des contrôles
  p TODO formulaire de recherche
  v-list.transparent(two-line)
    v-list-tile(v-for="controle in controles" :key="controle.id")
      v-list-tile-content
        v-list-tile-title
          span.body-2 {{ controle.etablissement.nom }}
          span.ml-2.caption ({{ controle.etablissement.id }})
          span.body-1 , le {{ controle.date.toLocaleString() }}
        v-list-tile-sub-title {{ controle.etablissement.adresse }}
</template>

<script>
export default {
  data () {
    return {
      controles: [
        {
          id: '1',
          date: new Date('2018-11-15'),
          etablissement: {
            id: '0999.00001',
            nom: 'Contrôle A',
            adresse: '123 rue de Paris'
          }
        },
        {
          id: '2',
          date: new Date('2018-11-15'),
          etablissement: {
            id: '0999.00002',
            nom: 'Contrôle B',
            adresse: '123 rue de Paris'
          }
        },
        {
          id: '3',
          date: new Date('2018-11-15'),
          etablissement: {
            id: '0999.00003',
            nom: 'Contrôle C',
            adresse: '123 rue de Paris'
          }
        },
        {
          id: '4',
          date: new Date('2018-11-15'),
          etablissement: {
            id: '0999.00004',
            nom: 'Contrôle D',
            adresse: '123 rue de Paris'
          }
        },
        {
          id: '5',
          date: new Date('2018-11-15'),
          etablissement: {
            id: '0999.00005',
            nom: 'Contrôle E',
            adresse: '123 rue de Paris'
          }
        },
        {
          id: '6',
          date: new Date('2018-11-15'),
          etablissement: {
            id: '0999.00006',
            nom: 'Contrôle F',
            adresse: '123 rue de Paris'
          }
        }
      ]
    }
  }
}
</script>
