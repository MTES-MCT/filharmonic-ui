<template lang="pug">
v-container
  fh-echange(v-for="(echange, index) in echanges" :key="echange.id" :index="index")

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

    .fh-inspection__suite.elevation-2.pa-3(v-if="suite")
      v-layout.align-center
        span.subheading.mr-2 Type de suite :
        v-chip(small :color="typeSuiteInspection.color" dark text-color="white")
          v-avatar
            v-icon() {{ typeSuiteInspection.icon }}
          | {{ typeSuiteInspection.label }}
      v-layout.align-center
        span.subheading.mr-2 Synthèse :
        v-flex
          div {{ suite.synthese }}

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
                        :label="typeSuite.label" :value="typeSuite.id"
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

      v-btn(color="secondary" v-if="!suite && !showNewSuiteForm" @click="prepareAndShowNewSuiteForm()")
        v-icon(left) gavel
        | Ajouter une suite
</template>

<script>
import { typesSuite, Suite } from '@/models/suite'
import FhEtatInspection from '@/components/FhEtatInspection.vue'
import FhMessage from '@/components/FhMessage.vue'
import FhEchange from '@/components/FhEchange.vue'
import { mapEchangesMultiRowFields } from '@/store/modules/inspection'
import { createNamespacedHelpers } from 'vuex'
import { SAVE } from '@/store/action-types'
import { Echange } from '@/models/echange'

const { mapState: mapDetailState } = createNamespacedHelpers('inspection/detail')
const { mapState: mapEtatState } = createNamespacedHelpers('inspection/etat')
const { mapActions: mapEchangeActions } = createNamespacedHelpers('inspection/echange')
const { mapState: mapSuiteState, mapActions: mapSuiteActions } = createNamespacedHelpers('inspection/suite')

export default {
  components: {
    FhEtatInspection,
    FhMessage,
    FhEchange
  },
  data () {
    return {
      validNewEchangeForm: false,
      showNewEchangeForm: false,
      newEchange: new Echange(),
      showNewSuiteForm: false,
      validNewSuiteForm: false,
      newSuite: new Suite(),
      newComment: '',

      notEmpty: [
        v => !!v || 'Il faut renseigner une valeur'
      ]
    }
  },
  computed: {
    ...mapEchangesMultiRowFields({ echanges: 'rows' }),
    ...mapDetailState({ detail: state => state.rows[0] }),
    ...mapEtatState({ etat: state => state.rows[0] }),
    ...mapSuiteState({ suite: state => state.rows[0] }),
    typeSuiteInspection () {
      return this.suite ? this.suite.type : {}
    },
    showNewEchange () {
      return this.etat.order < 4
    },
    typesSuite () {
      return typesSuite
    }
  },
  methods: {
    ...mapSuiteActions({ saveSuite: SAVE }),
    ...mapEchangeActions({ saveEchange: SAVE }),
    resetNewEchange () {
      this.newEchange = new Echange({ inspectionId: this.detail.id })
      this.showNewEchangeForm = false
    },
    saveNewEchange () {
      if (this.$refs.newEchangeForm.validate()) {
        this.saveEchange(this.newEchange)
        this.resetNewEchange()
      }
    },
    prepareAndShowNewSuiteForm () {
      this.newSuite = new Suite({ inspectionId: this.detail.id })
      this.showNewSuiteForm = true
    },
    resetNewSuite () {
      this.newSuite = new Suite({ inspectionId: this.detail.id })
      this.showNewSuiteForm = false
    },
    saveNewSuite () {
      if (this.$refs.newSuiteForm.validate()) {
        this.saveSuite(this.newSuite)
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
