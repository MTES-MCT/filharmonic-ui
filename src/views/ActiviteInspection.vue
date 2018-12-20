<template lang="pug">
v-container
  p Voici l'activité survenue pour cette inspection.
  v-btn(icon @click="toggleSort()" :class="{'fh-toggle--active': sortAscending}" title="Inverser le tri")
    v-icon sort
  fh-evenement(v-for="evenement in activiteSorted" :key="evenement.id" :evenement="evenement")
</template>

<script>
import FhEvenement from '@/components/FhEvenement.vue'

export default {
  components: {
    FhEvenement
  },
  props: {
    inspection: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      sortAscending: false
    }
  },
  computed: {
    activiteSorted () {
      const sortDirection = this.sortAscending ? 1 : -1
      return this.inspection.activite.slice().sort((a, b) => (a.created_at < b.created_at ? -1 : 1) * sortDirection)
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
