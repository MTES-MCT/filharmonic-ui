<template lang="pug">
fh-page(:wait="wait")
  template(slot-scope="_")
    v-container
      h1.display-1.font-weight-bold.mb-4 Tableau de bord

      v-layout.row.align-center
        h2 Inspections
        v-flex.text-xs-right
          v-text-field.d-inline-flex(v-model="$filter" label="Filtre établissement" clearable) Filtre

      v-tabs.elevation-1.mt-4(grow)

        v-tab.fh-tab(v-if="!$permissions.isApprobateur")
          | En cours&nbsp;
          .fh-badge {{ inspectionsEnCours.length }}
        v-tab.fh-tab(v-if="!$permissions.isExploitant")
          | En attente de validation&nbsp;
          .fh-badge {{ inspectionsAttenteValidation.length }}
        v-tab.fh-tab(v-if="$permissions.isApprobateur")
          | En cours&nbsp;
          .fh-badge {{ inspectionsEnCours.length }}
        v-tab.fh-tab(v-if="!$permissions.isApprobateur")
          | Traitement des non-conformités&nbsp;
          .fh-badge {{ inspectionsTraitementNonConformites.length }}
        v-tab.fh-tab(v-if="!$permissions.isApprobateur")
          | Clos&nbsp;
          .fh-badge {{ inspectionsCloses.length }}
        v-tab.fh-tab(v-if="$permissions.isApprobateur")
          | Validées&nbsp;
          .fh-badge {{ inspectionsValidees.length }}

        v-tab-item(v-if="!$permissions.isApprobateur")
          v-list(v-if="inspectionsEnCours.length == 0")
            v-list-tile Aucune inspection
          v-list.py-0(v-else two-line)
            fh-inspection-item(v-for="inspection in inspectionsEnCours" :key="inspection.id" :inspection="inspection")
        v-tab-item(v-if="!$permissions.isExploitant")
          v-list(v-if="inspectionsAttenteValidation.length == 0")
            v-list-tile Aucune inspection
          v-list.py-0(v-else two-line)
            fh-inspection-item(v-for="inspection in inspectionsAttenteValidation" :key="inspection.id" :inspection="inspection")
        v-tab-item(v-if="$permissions.isApprobateur")
          v-list(v-if="inspectionsEnCours.length == 0")
            v-list-tile Aucune inspection
          v-list.py-0(v-else two-line)
            fh-inspection-item(v-for="inspection in inspectionsEnCours" :key="inspection.id" :inspection="inspection")
        v-tab-item(v-if="!$permissions.isApprobateur")
          v-list(v-if="inspectionsTraitementNonConformites.length == 0")
            v-list-tile Aucune inspection
          v-list.py-0(v-else two-line)
            fh-inspection-item(v-for="inspection in inspectionsTraitementNonConformites" :key="inspection.id" :inspection="inspection")
        v-tab-item(v-if="!$permissions.isApprobateur")
          v-list(v-if="inspectionsCloses.length == 0")
            v-list-tile Aucune inspection
          v-list.py-0(v-else two-line)
            fh-inspection-item(v-for="inspection in inspectionsCloses" :key="inspection.id" :inspection="inspection")
        v-tab-item(v-if="$permissions.isApprobateur")
          v-list(v-if="inspectionsValidees.length == 0")
            v-list-tile Aucune inspection
          v-list.py-0(v-else two-line)
            fh-inspection-item(v-for="inspection in inspectionsValidees" :key="inspection.id" :inspection="inspection")

      v-layout.row.align-center.mt-4(v-if="$permissions.isExploitant")
        h2 Établissements
      v-list.py-0.mt-4
        v-list-tile(:to="`/etablissements/${etablissement.id}`" v-for="etablissement in etablissements" :key="etablissement.id")
          v-list-tile-action
            v-icon location_city
          v-list-tile-content
            v-list-tile-title {{ etablissement.nom }}
            v-list-tile-sub-title {{ etablissement.adresse }}
</template>

<script>
import { nomsEtatsEnCours } from '@/api/inspections'
import FhInspectionItem from '@/components/FhInspectionItem.vue'
import BasePage from '@/views/mixins/BasePage'
import * as _ from '@/util'

export default {
  components: {
    FhInspectionItem
  },
  mixins: [BasePage],
  data () {
    return {
      inspections: [],
      etablissements: [],
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
    inspectionsEnCours () {
      if (this.$permissions.isExploitant) {
        return this.inspectionsFiltrees.filter(inspection => inspection.etat === 'en_cours' || inspection.etat === 'attente_validation')
      } else {
        return this.inspectionsFiltrees.filter(inspection => nomsEtatsEnCours.includes(inspection.etat))
      }
    },
    inspectionsAttenteValidation () {
      return this.inspectionsFiltrees.filter(inspection => inspection.etat === 'attente_validation')
    },
    inspectionsTraitementNonConformites () {
      return this.inspectionsFiltrees.filter(inspection => inspection.etat === 'traitement_non_conformites')
    },
    inspectionsCloses () {
      return this.inspectionsFiltrees.filter(inspection => inspection.etat === 'close')
    },
    inspectionsValidees () {
      return this.inspectionsFiltrees.filter(inspection => inspection.etat === 'traitement_non_conformites' || inspection.etat === 'close')
    }
  },
  async created () {
    if (this.$permissions.isExploitant) {
      this.wait = Promise.all([
        this.$api.inspections.list(),
        this.$api.etablissements.list()
      ])
      const result = await this.wait
      this.inspections = result[0]
      this.etablissements = result[1].etablissements
    } else {
      if (this.$permissions.isInspecteur) {
        this.wait = this.$api.inspections.list({
          assigned: true
        })
      } else {
        this.wait = this.$api.inspections.list()
      }
      this.inspections = await this.wait
    }
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
