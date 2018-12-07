<template lang="pug">
v-container
  h1.display-1.font-weight-bold.mb-4 Tableau de bord

  h2 Inspections
  v-tabs.elevation-1.mt-4(grow)
    v-tab.fh-tab
      | En cours&nbsp;
      .fh-badge {{ inspectionsOuvertes.length }}
    v-tab.fh-tab
      | En attente de validation&nbsp;
      .fh-badge {{ inspectionsAttenteValidation.length }}
    v-tab.fh-tab
      | Clos&nbsp;
      .fh-badge {{ inspectionsTerminees.length }}
    v-tab-item
      v-list(v-if="inspectionsOuvertes.length == 0")
        v-list-tile Aucune inspection
      v-list.py-0(v-else two-line)
        fh-inspection-item(v-for="inspection in inspectionsOuvertes" :key="inspection.id" :inspection="inspection")
    v-tab-item
      v-list(v-if="inspectionsAttenteValidation.length == 0")
        v-list-tile Aucune inspection
      v-list.py-0(v-else two-line)
        fh-inspection-item(v-for="inspection in inspectionsAttenteValidation" :key="inspection.id" :inspection="inspection")
    v-tab-item
      v-list(v-if="inspectionsTerminees.length == 0")
        v-list-tile Aucune inspection
      v-list.py-0(v-else two-line)
        fh-inspection-item(v-for="inspection in inspectionsTerminees" :key="inspection.id" :inspection="inspection")

</template>

<script>
import InspectionsAPI, { nomsEtatsEnCours } from '@/api/inspections'
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
    inspectionsOuvertes () {
      return this.inspections.filter(inspection => nomsEtatsEnCours.includes(inspection.etat))
    },
    inspectionsAttenteValidation () {
      return this.inspections.filter(inspection => inspection.etat === 'attente_validation')
    },
    inspectionsTerminees () {
      return this.inspections.filter(inspection => inspection.etat === 'termine')
    }
  },
  async created () {
    this.inspections = await InspectionsAPI.listAssigned(this.$store.state.authentication.user.id, {
      etablissement: true,
      messagesNonLus: true
    })
  }
}
</script>

<style lang="stylus">
.fh-tab
  &:hover
    background-color #ededed

.fh-badge
  display inline
  background-color #ededed
  border-radius 50px
  padding 5px 8px
</style>
