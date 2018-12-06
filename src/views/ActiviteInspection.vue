<template lang="pug">
v-container
  h2.heading
    | Activité
    v-btn(icon @click="toggleSort()" :class="{'fh-toggle--active': sortAscending}")
      v-icon sort
  div(v-for="evenement in activiteSorted" :key="evenement.id")
    | {{ evenement.created_at.toLocaleString() }} - {{ evenement.auteur.name }} : {{ evenement.type }}
</template>

<script>
export default {
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
