<template lang="pug">
v-container
  h1.display-1.font-weight-bold.mb-4 Tableau de bord

  v-layout.row.align-center
    h2 Inspections
    v-flex.text-xs-right
      v-text-field.d-inline-flex(v-model="$filter" label="Filtre établissement" clearable) Filtre
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
import * as _ from '@/util'

export default {
  components: {
    FhInspectionItem
  },
  data () {
    return {
      inspections: [],
      filter: ''
    }
  },
  computed: {
    $filter: {
      get () {
        return this.filter
      },
      set: _.debounce(function (filter) {
        this.filter = filter
      }, 100)
    },
    inspectionsFiltrees () {
      const normalizedFilter = _.normalize(this.filter).trim()

      return this.inspections.filter(inspection => {
        if (this.filter === '') {
          return true
        }
        return _.normalize(inspection.etablissement.nom).includes(normalizedFilter) ||
          _.normalize(inspection.etablissement.raison).includes(normalizedFilter) ||
          _.normalize(inspection.etablissement.adresse).includes(normalizedFilter)
      })
    },
    inspectionsOuvertes () {
      return this.inspectionsFiltrees.filter(inspection => nomsEtatsEnCours.includes(inspection.etat))
    },
    inspectionsAttenteValidation () {
      return this.inspectionsFiltrees.filter(inspection => inspection.etat === 'attente_validation')
    },
    inspectionsTerminees () {
      return this.inspectionsFiltrees.filter(inspection => inspection.etat === 'termine')
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
