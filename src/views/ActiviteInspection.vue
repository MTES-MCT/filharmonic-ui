<template lang="pug">
v-container
  p Voici l'activité survenue pour cette inspection.
  v-btn(icon @click="toggleSort()" :class="{'fh-toggle--active': sortAscending}")
    v-icon sort
  div(v-for="evenement in activiteSorted" :key="evenement.id")
    | {{ evenement.created.toLocaleString() }} - {{ evenement.author.name }} : {{ evenement.type.name }}
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapState: mapEvenementsState } = createNamespacedHelpers('inspection/evenement')
export default {
  data () {
    return {
      sortAscending: false
    }
  },
  computed: {
    ...mapEvenementsState({ evenements: 'rows' }),
    activiteSorted () {
      const sortDirection = this.sortAscending ? 1 : -1
      return this.evenements.slice().sort((a, b) => (a.created < b.created ? -1 : 1) * sortDirection)
    }
  },
  methods: {
    toggleSort () {
      this.sortAscending = !this.sortAscending
    }
  }
}
</script>

<style lang="stylus">
.fh-toggle--active
  transform: scaleY(-1)
</style>
