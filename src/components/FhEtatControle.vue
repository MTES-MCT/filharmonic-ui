<template lang="pug">
  v-chip(:color="color" text-color="white") {{ nom }}
</template>

<script>
export default {
  name: 'FhEtatControle',
  props: {
    etat: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      nom: '',
      color: ''
    }
  },
  created () {
    switch (this.etat) {
      case 1:
        this.color = 'primary'
        this.nom = 'Créé'
        break
      case 2:
        this.color = 'green'
        this.nom = 'En cours'
        break
      case 3:
        this.color = 'red'
        this.nom = 'Validé'
        break
      case 4:
        this.color = 'grey'
        this.nom = 'Terminé'
        break
      default:
        this.color = 'grey'
        this.nom = '?'
        break
    }
  }
}
</script>
