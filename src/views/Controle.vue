<template lang="pug">
v-container
  h1.display-1.font-weight-bold.mb-3 Contrôle n°{{ controle.id }} du {{ controle.date.toLocaleString() }}
  p Établissement : {{ controle.installation.nom }} ({{ controle.installation.id }})
  p Adresse : {{ controle.installation.adresse }}
  p TODO workflow, état, questions
</template>

<script>
export default {
  data () {
    return {
      controle: {
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
