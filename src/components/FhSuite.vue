<template lang="pug">
div(v-if="openSuite")
  v-card.my-3.elevation-4
    v-toolbar(flat color="secondary" dense dark)
      v-toolbar-title {{ inspection.suite ? 'Modification de la suite' : 'Nouvelle suite' }}
      v-spacer
      v-toolbar-items
        v-btn(flat title="Annuler les modifications" @click="resetOpenSuite()")
          v-icon(medium) close

    v-card-text
      v-form(ref="openSuiteForm" v-model="validEditionForm")
        v-layout
          v-radio-group.mt-0(hide-details
                              v-model="openSuite.type"
                              required
                              :rules="notEmpty"
                            )
            v-radio(v-for="(typeSuite, key) in typesSuite" :key="key"
                    :label="typeSuite.label" :value="key"
                    )
          v-checkbox(v-model="openSuite.penalEngage" label="Suites pénales engagées")
        v-textarea.mt-3(box label="Synthèse" auto-grow hideDetails rows="3" clearable
                        v-model="openSuite.synthese"
                        required
                        :rules="notEmpty"
                        )

    v-card-actions.justify-center.pb-3
      v-btn(color="primary" @click="saveOpenSuite()" :disabled="!validEditionForm")
        v-icon(left) gavel
        | {{ inspection.suite ? 'Modifier' : 'Ajouter' }}

.fh-inspection__suite.elevation-2.pa-3(v-else-if="inspection.suite")
  v-layout.align-center
    span.subheading.mr-2 Type de suite&nbsp;:
    v-chip(small :color="typeSuiteInspection.color" dark text-color="white")
      v-avatar
        v-icon() {{ typeSuiteInspection.icon }}
      | {{ typeSuiteInspection.label }}
    v-spacer
    v-btn(v-if="modifiable"
          icon large title="Modifier la suite"
          @click="editSuite()"
          )
      v-icon edit
    v-btn(v-if="modifiable"
          icon large title="Supprimer la suite"
          @click="supprimerSuite()"
          )
      v-icon(color="red") delete
  v-layout.align-center.mb-2(v-if="inspection.suite.penalEngage")
    v-icon.mr-2 report_problem
    strong Suites pénales engagées
  v-layout.align-center
    span.subheading.mr-2 Synthèse&nbsp;:
    v-flex
      div {{ inspection.suite.synthese }}

div(v-else)
  div(v-if="!$permissions.isExploitant")
      p Les suites sont décidées lorsque tous les points de contrôle sont soldés par des constats.
      p(v-if="inspection.points_de_controle.length === 0") Il faut ajouter au moins un point de contrôle avant de définir une suite.
      p(v-if="nombreConstatsRestants > 0") Il reste {{ nombreConstatsRestants }} {{ nombreConstatsRestants | pluralize('constat') }} à établir avant de pouvoir ajouter une suite.

  v-btn(color="secondary" v-if="modifiable" :disabled="inspection.points_de_controle.length === 0 || nombreConstatsRestants > 0" @click="prepareAndShowEditionForm()")
    v-icon(left) gavel
    | Ajouter une suite
</template>

<script>
import { typesSuite } from '@/api/inspections'
import * as _ from '@/util'

export default {
  name: 'FhSuite',
  props: {
    inspection: {
      type: Object,
      required: true
    },
    modifiable: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      validEditionForm: false,
      openSuite: null,

      typesSuite,

      notEmpty: [
        v => !!v || 'Il faut renseigner une valeur'
      ]
    }
  },
  computed: {
    typeSuiteInspection () {
      return this.inspection.suite ? typesSuite[this.inspection.suite.type] : {}
    },
    nombreConstatsRestants () {
      return this.inspection.points_de_controle.filter(p => !p.constat).length
    }
  },
  methods: {
    prepareAndShowEditionForm () {
      this.openSuite = {
        type: 'observation',
        synthese: 'Cette visite à permis de relever des points faisant l’objet d’observations. L’exploitant devra fournir selon les délais mentionnés dans le présent rapport, les éléments permettant de justifier de la mise en œuvre des actions correctives nécessaires pour les lever.',
        penalEngage: false
      }
    },
    resetOpenSuite () {
      this.openSuite = null
    },
    editSuite () {
      this.openSuite = _.cloneDeep(this.inspection.suite)
    },
    async saveOpenSuite () {
      if (this.$refs.openSuiteForm.validate()) {
        if (this.inspection.suite) {
          await this.$api.inspections.modifierSuite(this.inspection.id, this.openSuite)
        } else {
          await this.$api.inspections.creerSuite(this.inspection.id, this.openSuite)
        }
        this.resetOpenSuite()
      }
    },
    async supprimerSuite () {
      await this.$api.inspections.supprimerSuite(this.inspection.id)
    }
  }
}
</script>

<style lang="stylus">
.fh-inspection
  &__suite
    margin-top 1em
    padding-left 1em
    border-left 5px solid darken(#f0f0f0, 50%)
</style>
