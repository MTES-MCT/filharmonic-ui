<template lang="pug">
div
  p.display-1.mt-4.text-xs-center(v-if="error") {{ error }}
  v-container(v-if="inspection")
    h1.display-2.text-xs-center.mb-3 Inspection de l'établissement {{ inspection.etablissement.nom }} du {{ inspection.date.toLocaleString() }}

    h2.heading
      | Activité
      v-btn(icon @click="toggleSort()" :class="{'fh-toggle--active': sortAscending}")
        v-icon sort
    div(v-for="evenement in activiteSorted" :key="evenement.id")
      | {{ evenement.created_at.toLocaleString() }} - {{ evenement.auteur.name }} : {{ evenement.type }}
</template>

<script>
import { getInspection } from '@/api/inspections'
import * as _ from '@/util'

export default {
  props: {
    inspectionId: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      error: false,
      sortAscending: false,
      inspection: null
    }
  },
  computed: {
    activiteSorted () {
      const sortDirection = this.sortAscending ? 1 : -1
      return this.inspection.activite.slice().sort((a, b) => (a.created_at < b.created_at ? -1 : 1) * sortDirection)
    }
  },
  async created () {
    try {
      this.inspection = _.cloneDeep(await getInspection(this.inspectionId, {
        etablissement: true,
        activite: true
      }))
    } catch (err) {
      this.error = err.message
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
