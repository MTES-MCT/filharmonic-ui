<template lang="pug">
v-container
  h1.display-1.font-weight-bold.mb-4 Tableau de bord

  v-card.mt-4
    v-toolbar(flat)
      v-toolbar-title Contrôles ouverts ({{ controlesEnCours.length }})
    v-list(v-if="controlesEnCours.length == 0")
      v-list-tile Aucun contrôle
    v-list.py-0(v-else two-line)
      fh-controle-item(v-for="controle in controlesEnCours" :key="controle.id" :controle="controle")

  v-card.mt-4
    v-toolbar(flat)
      v-toolbar-title Contrôles terminés
    v-list(v-if="controlesTermines.length == 0")
      v-list-tile Aucun contrôle
    v-list.py-0(v-else two-line)
      fh-controle-item(v-for="controle in controlesTermines" :key="controle.id" :controle="controle")
</template>

<script>
import { listAssignedControles } from '@/api/controles'
import FhControleItem from '@/components/FhControleItem.vue'

export default {
  components: {
    FhControleItem
  },
  data () {
    return {
      controles: []
    }
  },
  computed: {
    controlesEnCours () {
      return this.controles.filter(c => c.state === 'encours')
    },
    controlesTermines () {
      return this.controles.filter(c => c.state === 'termine')
    }
  },
  async created () {
    this.controles = await listAssignedControles(1)
  }
}
</script>
