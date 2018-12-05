<template lang="pug">
v-container
  h1.display-1.font-weight-bold.mb-4 Tableau de bord

  v-card.mt-4
    v-toolbar(flat)
      v-toolbar-title Inspections ouvertes ({{ inspectionsOuvertes.length }})
    v-list(v-if="inspectionsOuvertes.length == 0")
      v-list-tile Aucune inspection
    v-list.py-0(v-else two-line)
      fh-inspection-item(v-for="inspection in inspectionsOuvertes" :key="inspection.id" :inspection="inspection")

  v-card.mt-4
    v-toolbar(flat)
      v-toolbar-title Inspections terminées
    v-list(v-if="inspectionsTerminees.length == 0")
      v-list-tile Aucune inspection
    v-list.py-0(v-else two-line)
      fh-inspection-item(v-for="inspection in inspectionsTerminees" :key="inspection.id" :inspection="inspection")
</template>

<script>
import { mapState } from 'vuex'
import { listAssignedInspections } from '@/api/inspections'
import FhInspectionItem from '@/components/FhInspectionItem.vue'

export default {
  components: {
    FhInspectionItem
  },
  data () {
    return {
      inspections: []
    }
  },
  computed: {
    ...mapState([
      'inspectionsOuvertes'
    ]),
    inspectionsTerminees () {
      return this.inspections.filter(c => c.state === 'termine')
    }
  },
  async created () {
    this.inspections = await listAssignedInspections(1)
  }
}
</script>
