<template lang="pug">
v-container
  fh-echange(v-for="(echange, index) in echanges" :key="echange.id" :index="index" :echange="echange" :etatInspection="inspection.etat")

  v-slide-y-transition(hide-on-leave)
    v-card.my-3.elevation-4(v-if="showNewEchange && showNewEchangeForm")
      v-toolbar(flat color="secondary" dense dark)
        v-toolbar-title Nouvel échange
        v-spacer
        v-toolbar-items
          v-btn(flat title="Annuler l'échange" @click="resetNewEchange()")
            v-icon(medium) delete

      v-card-text
        v-container.pa-0(grid-list-md)
          v-form(ref="newEchangeForm" v-model="validNewEchangeForm")
            v-layout.column
              v-text-field(label="Sujet" hideDetails clearable
                            v-model="newEchange.sujet"
                            required
                            :rules="notEmpty"
                          )

              v-text-field(v-for="(referenceReglementaire, index) in newEchange.referencesReglementaires" :key="index"
                            label="Référence réglementaire" hideDetails clearable
                            v-model="newEchange.referencesReglementaires[index]"
                            :append-outer-icon="newEchange.referencesReglementaires.length > 1 ? 'delete' : null"
                            @click:append-outer="newEchange.referencesReglementaires.splice(index, 1)"
                            required
                            :rules="notEmpty"
                          )
              .d-block
                v-btn(flat title="Ajouter une référence réglementaire" @click="newEchange.referencesReglementaires.push('')")
                  v-icon(medium left) add
                  | Nouvelle référence réglementaire

      v-card-actions.justify-center.pb-3
        v-btn(color="primary" @click="saveNewEchange()" :disabled="!validNewEchangeForm")
          v-icon(left) done
          | Sauvegarder l'échange

    v-btn.mt-4(v-if="!showNewEchangeForm && showNewEchange" @click="showNewEchangeForm = true")
      v-icon(left) message
      | Démarrer un nouvel échange

  section(v-if="!$permissions.isExploitant")
    h4.display-1.my-4 Suites
    p Les suites sont décidées lorsque tous les échanges sont soldés par des constats.

    .fh-inspection__suite.elevation-2.pa-3(v-if="inspection.suite")
      v-layout.align-center
        span.subheading.mr-2 Type de suite :
        v-chip(small :color="typeSuiteInspection.color" dark text-color="white")
          v-avatar
            v-icon() {{ typeSuiteInspection.icon }}
          | {{ typeSuiteInspection.label }}
      v-layout.align-center
        span.subheading.mr-2 Synthèse :
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
              | Sauvegarder la suite

      v-btn(color="secondary" v-if="!inspection.suite && !showNewSuiteForm" @click="prepareAndShowNewSuiteForm()")
        v-icon(left) gavel
        | Ajouter une suite
</template>

<script>
import { store } from '@/store'
import { typesSuite, allowedStates } from '@/api/inspections'
import FhEtatInspection from '@/components/FhEtatInspection.vue'
import FhMessage from '@/components/FhMessage.vue'
import FhEchange from '@/components/FhEchange.vue'
import * as _ from '@/util'
import { inspection, mapEchangesMultiRowFields } from '@/store/modules/inspection'
import { ERROR, SUCCESS } from '@/store/mutation-types'
import { createNamespacedHelpers } from 'vuex'

if (!store.state.inspection) store.registerModule('inspection', inspection)

const { mapState: mapInspectionState } = createNamespacedHelpers('inspection')

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
      validNewEchangeForm: false,
      showNewEchangeForm: false,
      newEchange: {
        sujet: '',
        referencesReglementaires: [
          ''
        ],
        reponses: []
      },
      typesSuite,
      showNewSuiteForm: false,
      validNewSuiteForm: false,
      newSuite: {},
      newComment: '',

      notEmpty: [
        v => !!v || 'Il faut renseigner une valeur'
      ]
    }
  },
  computed: {
    ...mapEchangesMultiRowFields({ echanges: 'rows' }),
    ...mapInspectionState([ERROR, SUCCESS]),
    typeSuiteInspection () {
      return this.inspection.suite ? typesSuite[this.inspection.suite.type] : {}
    },
    showNewEchange () {
      return allowedStates[this.inspection.etat].order < 4
    }
  },
  methods: {
    resetNewEchange () {
      this.newEchange = {
        sujet: '',
        referencesReglementaires: [
          ''
        ],
        reponses: []
      }
      this.showNewEchangeForm = false
    },
    saveNewEchange () {
      if (this.$refs.newEchangeForm.validate()) {
        this.echanges.push(_.cloneDeep(this.newEchange))
        this.resetNewEchange()
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
      this.newSuite = {
        sujet: '',
        referencesReglementaires: [
          ''
        ],
        reponses: []
      }
      this.showNewSuiteForm = false
    },
    saveNewSuite () {
      if (this.$refs.newSuiteForm.validate()) {
        this.inspection.suite = this.newSuite
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
