<template lang="pug">
v-container
  h1.display-1.font-weight-bold.mb-4 Liste des inspections
  p TODO formulaire de recherche
  v-list.transparent(two-line)
    v-list-tile(v-for="inspection in inspections" :key="inspection.id")
      v-list-tile-content
        v-list-tile-title
          span.body-2 {{ inspection.installation.nom }}
          span.ml-2.caption ({{ inspection.installation.id }})
          span.body-1 , le {{ inspection.date.toLocaleString() }}
        v-list-tile-sub-title {{ inspection.installation.adresse }}
</template>

<script>
export default {
  data () {
    return {
      inspections: [
        {
          id: '1',
          date: new Date('2018-11-15'),
          installation: {
            id: '0999.00001',
            nom: 'Inspection A',
            adresse: '123 rue de Paris'
          }
        },
        {
          id: '2',
          date: new Date('2018-11-15'),
          installation: {
            id: '0999.00002',
            nom: 'Inspection B',
            adresse: '123 rue de Paris'
          }
        },
        {
          id: '3',
          date: new Date('2018-11-15'),
          installation: {
            id: '0999.00003',
            nom: 'Inspection C',
            adresse: '123 rue de Paris'
          }
        },
        {
          id: '4',
          date: new Date('2018-11-15'),
          installation: {
            id: '0999.00004',
            nom: 'Inspection D',
            adresse: '123 rue de Paris'
          }
        },
        {
          id: '5',
          date: new Date('2018-11-15'),
          installation: {
            id: '0999.00005',
            nom: 'Inspection E',
            adresse: '123 rue de Paris'
          }
        },
        {
          id: '6',
          date: new Date('2018-11-15'),
          installation: {
            id: '0999.00006',
            nom: 'Inspection F',
            adresse: '123 rue de Paris'
          }
        }
      ]
    }
  }
}
</script>
