<template lang="pug">
v-container
  h1.display-1.font-weight-bold.mb-3 Inspection n°{{ inspection.id }} du {{ inspection.date.toLocaleString() }}
  p Établissement : {{ inspection.installation.nom }} ({{ inspection.installation.id }})
  p Adresse : {{ inspection.installation.adresse }}
  p TODO workflow, état, questions
</template>

<script>
export default {
  data () {
    return {
      inspection: {
        id: '1',
        date: new Date('2018-11-15'),
        installation: {
          id: '0999.00001',
          nom: 'Installation A',
          adresse: '123 rue de Paris'
        }
      }
    }
  }
}
</script>
