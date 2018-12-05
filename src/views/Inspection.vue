<template lang="pug">
div
  p.display-1.mt-4.text-xs-center(v-if="error") {{ error }}
  v-container(v-if="inspection")
    h1.display-2.text-xs-center.mb-3 Inspection de l'établissement {{ inspection.etablissement.nom }} du {{ inspection.date.toLocaleString() }}
    fh-etat-inspection(:etat="inspection.etat" stepper)

    v-layout.row.wrap.mt-3.grid-list-lg
      v-flex.xs12.md6.pa-2
        v-card
          v-toolbar(flat)
            v-toolbar-title
              | Détails
            v-spacer
            v-toolbar-items
              v-btn(flat :to="`/inspections/${this.inspectionId}/details`" title="Modifier le inspection")
                v-icon(medium) edit
          v-card-text
            fh-detail-inspection(:inspection="inspection" readonly)

        fh-detail-etablissement(v-if="!error", :etablissement="inspection.etablissement")

    h4.display-1.my-4
      | Points de contrôle

    fh-echange(v-for="echange in inspection.echanges" :key="echange.id" :echange="echange" :etatInspection="inspection.etat")

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

    h4.display-1.my-4(v-if="inspecteur")
      | Commentaires
    p(v-if="inspecteur") Les commentaires sont internes et ne sont seulement visibles que par les inspecteurs.
    v-card(v-if="inspecteur")
      v-card-text
        fh-message(v-for="comment in inspection.comments" :key="comment.id" :message="comment")
        v-layout.pl-2.mt-2.align-end
          v-textarea(box label="Commentaire" v-model="newComment" auto-grow hideDetails rows="1" clearable)
          v-btn.mb-0
            v-icon attach_file
          v-btn.mb-0(@click="addComment();" :disabled="!newComment" color="primary" title="Envoyer")
            v-icon send

    section(v-if="inspecteur")
      h4.display-1.my-4(v-if="inspecteur") Suites
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
import { getInspection, typesSuite, allowedStates } from '@/api/inspections'
import FhEtatInspection from '@/components/FhEtatInspection.vue'
import FhDetailInspection from '@/components/FhDetailInspection.vue'
import FhDetailEtablissement from '@/components/FhDetailEtablissement.vue'
import FhMessage from '@/components/FhMessage.vue'
import FhEchange from '@/components/FhEchange.vue'
import * as _ from '@/util'
import { mapState } from 'vuex'

export default {
  components: {
    FhEtatInspection,
    FhDetailInspection,
    FhDetailEtablissement,
    FhMessage,
    FhEchange
  },
  props: {
    inspectionId: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      error: '',
      inspection: null, // fetched on init
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
    typeSuiteInspection () {
      return this.inspection.suite ? typesSuite[this.inspection.suite.type] : {}
    },
    ...mapState({
      inspecteur: state => state.authentication.user.type === 'inspecteur',
      inspectionsOuverts: 'inspectionsOuverts'
    }),
    showNewEchange () {
      return allowedStates[this.inspection.etat].order < 4
    }
  },
  async created () {
    try {
      this.inspection = _.cloneDeep(await getInspection(this.inspectionId, { etablissement: true }))
    } catch (err) {
      this.error = err.message
    }
  },
  methods: {
    removeTheme (theme) {
      const index = this.inspection.themes.indexOf(theme)
      if (index !== -1) {
        this.inspection.themes.splice(index, 1)
      }
    },
    removeInspecteur (inspecteur) {
      const index = this.inspection.inspecteurs.indexOf(inspecteur.id)
      if (index !== -1) {
        this.inspection.inspecteurs.splice(index, 1)
      }
    },
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
        this.inspection.echanges.push(_.cloneDeep(this.newEchange))
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
    },
    addDiscussion () {
      this.inspection.echanges.unshift({
        question: {
          author: 'Alain Champion',
          text: 'Nouvel échange...',
          date: new Date(),
          attachments: []
        },
        reponses: []
      })
    },
    addComment () {
      this.inspection.comments.push({
        author: 'Alain Champion',
        text: this.newComment,
        date: new Date(),
        attachments: []
      })
      this.newComment = ''
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
