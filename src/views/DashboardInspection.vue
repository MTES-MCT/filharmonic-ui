<template lang="pug">
v-container
  fh-echange(v-for="echange in inspection.echanges" :key="echange.id" :echange="echange" :etatInspection="inspection.etat")

  v-slide-y-transition(hide-on-leave)
    v-card.my-3.elevation-4(v-if="showNewPointDeControleForm")
      v-toolbar(flat color="secondary" dense dark)
        v-toolbar-title Nouveau point de contrôle
        v-spacer
        v-toolbar-items
          v-btn(flat title="Supprimer le point de contrôle" @click="resetNewPointDeControle()")
            v-icon(medium) delete

      v-card-text
        v-container.pa-0(grid-list-md)
          v-form(ref="newPointDeControleForm" v-model="validNewPointDeControleForm")
            v-layout.column
              v-text-field(label="Sujet" hideDetails clearable
                            v-model="newPointDeControle.sujet"
                            required
                            :rules="notEmpty"
                          )

              v-text-field(v-for="(referenceReglementaire, index) in newPointDeControle.referencesReglementaires" :key="index"
                            label="Référence réglementaire" hideDetails clearable
                            v-model="newPointDeControle.referencesReglementaires[index]"
                            :append-outer-icon="newPointDeControle.referencesReglementaires.length > 1 ? 'delete' : null"
                            @click:append-outer="newPointDeControle.referencesReglementaires.splice(index, 1)"
                            required
                            :rules="notEmpty"
                          )
              .d-block
                v-btn(flat title="Ajouter une référence réglementaire" @click="newPointDeControle.referencesReglementaires.push('')")
                  v-icon(medium left) add
                  | Nouvelle référence réglementaire

      v-card-actions.justify-center.pb-3
        v-btn(color="primary" @click="saveNewPointDeControle()" :disabled="!validNewPointDeControleForm")
          v-icon(left) done
          | Ajouter

    v-btn.mt-4(v-if="peutAjouterPointDeControle" @click="showNewPointDeControleForm = true")
      v-icon(left) add
      | Ajouter un point de contrôle

  section(v-if="showSuites")
    h4.display-1.my-4 Suites
    div(v-if="!$permissions.isExploitant")
      p Les suites sont décidées lorsque tous les échanges sont soldés par des constats.
      p(v-if="inspection.echanges.length === 0") Il faut ajouter au moins un point de contrôle avant de définir une suite.
      p(v-if="nombreConstatsRestants > 0") Il reste {{ nombreConstatsRestants }} {{ nombreConstatsRestants | pluralize('constat') }} à établir avant de pouvoir ajouter une suite.
    .fh-inspection__suite.elevation-2.pa-3(v-if="inspection.suite")
      v-layout.align-center
        span.subheading.mr-2 Type de suite&nbsp;:
        v-chip(small :color="typeSuiteInspection.color" dark text-color="white")
          v-avatar
            v-icon() {{ typeSuiteInspection.icon }}
          | {{ typeSuiteInspection.label }}
      v-layout.align-center
        span.subheading.mr-2 Synthèse&nbsp;:
        v-flex
          div {{ inspection.suite.synthese }}

    div(v-else)
      v-slide-y-transition(hide-on-leave)
        v-card.my-3.elevation-4(v-if="showNewSuiteForm")
          v-toolbar(flat color="secondary" dense dark)
            v-toolbar-title Nouvelle suite
            v-spacer
            v-toolbar-items
              v-btn(flat title="Annuler la suite" @click="resetNewSuite()")
                v-icon(medium) delete

          v-card-text
            v-form(ref="newSuiteForm" v-model="validNewSuiteForm")
              v-radio-group.mt-0(hide-details
                                  v-model="newSuite.type"
                                  required
                                  :rules="notEmpty"
                                )
                v-radio(v-for="(typeSuite, key) in typesSuite" :key="key"
                        :label="typeSuite.label" :value="key"
                        )

              v-textarea.mt-3(box label="Synthèse" auto-grow hideDetails rows="3" clearable
                              v-model="newSuite.synthese"
                              required
                              :rules="notEmpty"
                              )

          v-card-actions.justify-center.pb-3
            v-btn(color="primary" @click="saveNewSuite()" :disabled="!validNewSuiteForm")
              v-icon(left) gavel
              | Ajouter

      v-btn(color="secondary" v-if="peutAjouterSuites" :disabled="nombreConstatsRestants > 0" @click="prepareAndShowNewSuiteForm()")
        v-icon(left) gavel
        | Ajouter une suite
</template>

<script>
import { typesSuite } from '@/api/inspections'
import FhEtatInspection from '@/components/FhEtatInspection.vue'
import FhMessage from '@/components/FhMessage.vue'
import FhEchange from '@/components/FhEchange.vue'

export default {
  components: {
    FhEtatInspection,
    FhMessage,
    FhEchange
  },
  props: {
    inspection: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      validNewPointDeControleForm: false,
      showNewPointDeControleForm: false,
      newPointDeControle: {
        sujet: '',
        referencesReglementaires: [
          ''
        ],
        messages: []
      },

      showNewSuiteForm: false,
      validNewSuiteForm: false,
      newSuite: {},

      typesSuite,

      notEmpty: [
        v => !!v || 'Il faut renseigner une valeur'
      ]
    }
  },
  computed: {
    inspectionModifiable () {
      return this.inspection.etat === 'preparation' || this.inspection.etat === 'en_cours'
    },
    typeSuiteInspection () {
      return this.inspection.suite ? typesSuite[this.inspection.suite.type] : {}
    },
    peutAjouterPointDeControle () {
      return !this.$permissions.isExploitant && this.inspectionModifiable && !this.showNewPointDeControleForm
    },
    peutAjouterSuites () {
      return !this.$permissions.isExploitant && this.inspectionModifiable && !this.inspection.suite && !this.showNewSuiteForm
    },
    showSuites () {
      return this.inspection.suite || !this.$permissions.isExploitant
    },
    nombreConstatsRestants () {
      return this.inspection.echanges.filter(e => e.constat !== null).length
    }
  },
  methods: {
    resetNewPointDeControle () {
      this.newPointDeControle = {
        sujet: '',
        referencesReglementaires: [
          ''
        ],
        messages: []
      }
      this.showNewPointDeControleForm = false
    },
    async saveNewPointDeControle () {
      if (this.$refs.newPointDeControleForm.validate()) {
        await this.$api.inspections.ajouterPointDeControle(this.inspection.id, this.newPointDeControle)
        this.resetNewPointDeControle()
      }
    },
    prepareAndShowNewSuiteForm () {
      this.newSuite = {
        type: 'observation',
        synthese: 'Cette visite à permis de relever des points faisant l’objet d’observations. L’exploitant devra fournir selon les délais mentionnés dans le présent rapport, les éléments permettant de justifier de la mise en œuvre des actions correctives nécessaires pour les lever.'
      }
      this.showNewSuiteForm = true
    },
    resetNewSuite () {
      this.newSuite = {}
      this.showNewSuiteForm = false
    },
    async saveNewSuite () {
      if (this.$refs.newSuiteForm.validate()) {
        await this.$api.inspections.ajouterSuite(this.inspection.id, this.newSuite)
        this.resetNewSuite()
      }
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
