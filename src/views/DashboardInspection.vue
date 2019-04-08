<template lang="pug">
v-container
  v-alert.ma-2.mb-4(v-if="!$permissions.isExploitant && inspection.validation_rejetee" :value="true" type="error")
    | La demande de validation a été rejetée.&nbsp;
    span.fh-multiline(v-if="inspection.motif_rejet_validation") Motif: {{ inspection.motif_rejet_validation }}

  v-layout.row
    v-flex
      fh-btn.mb-4(:action="genererLettreAnnonce" v-if="peutGenererLettreAnnonce")
        v-icon(left) library_books
        | Générer la lettre d'annonce

      fh-btn.mb-4(:action="genererLettreSuite" v-if="peutGenererLettreSuite")
        v-icon(left) library_books
        | Générer la lettre des suites

      p(v-if="showMessagePointsDeControleNonModifiables") Les points de contrôle ne sont pas modifiables tant qu'une suite est présente.

    v-btn(@click="enterReorderingMode" v-if="peutReordonner")
      v-icon(left) shuffle
      | Réordonner
    fh-btn(:action="quitReorderingMode" color="primary" v-if="reorderingMode")
      v-icon(left) done
      | Sauvegarder l'ordre

    v-btn(@click="compactMode = !compactMode")
      v-icon(left) {{ compactMode ? 'view_list' : 'list' }}
      | {{ compactMode ? 'Agrandir' : 'Réduire' }}

  draggable(v-model="pointsDeControle" v-bind="dragOptions")
    fh-point-de-controle.my-2(v-for="pointDeControle in pointsDeControle" :key="pointDeControle.id"
                              :pointDeControle="pointDeControle" :etatInspection="inspection.etat"
                              :readonly="!peutModifierPointsDeControle" :deplier="pointDeControle.id === pointDeControleDeplieId"
                              :draggable="reorderingMode" :compact="compactMode")

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
            fh-point-de-controle-form(:pointDeControle="newPointDeControle")

      v-card-actions.justify-center.pb-3
        fh-btn(color="primary" :action="saveNewPointDeControle" :disableif="!validNewPointDeControleForm")
          v-icon(left) done
          | Ajouter

    v-btn.mt-4(v-if="peutAjouterPointDeControle" @click="showNewPointDeControleForm = true" :disabled="reorderingMode")
      v-icon(left) add
      | Ajouter un point de contrôle

  section(v-if="peutVoirSuites")
    h4.display-1.my-4 Suites
    fh-suite(:inspection="inspection" :modifiable="peutModifierSuites")

    .text-xs-center
      fh-btn.mt-4(:action="genererRapport" v-if="peutGenererRapport")
        v-icon(left) library_books
        | Générer le rapport
</template>

<script>
import draggable from 'vuedraggable'
import { isAfterState, isBeforeState } from '@/api/inspections'
import FhBtn from '@/components/FhBtn.vue'
import FhEtatInspection from '@/components/FhEtatInspection.vue'
import FhMessage from '@/components/FhMessage.vue'
import FhPointDeControle from '@/components/FhPointDeControle.vue'
import FhPointDeControleForm from '@/components/FhPointDeControleForm.vue'
import FhSuite from '@/components/FhSuite.vue'
import * as util from '@/util'

export default {
  components: {
    FhBtn,
    FhEtatInspection,
    FhMessage,
    FhPointDeControle,
    FhPointDeControleForm,
    FhSuite,
    draggable
  },
  props: {
    inspection: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      compactMode: false,
      reorderingMode: false,
      sortablePointsDeControle: [],
      validNewPointDeControleForm: false,
      showNewPointDeControleForm: false,
      pointDeControleDeplieId: null,
      messageDeplieId: null,
      newPointDeControle: {
        sujet: '',
        references_reglementaires: [
          ''
        ],
        messages: []
      },

      notEmpty: [
        v => !!v || 'Il faut renseigner une valeur'
      ]
    }
  },
  computed: {
    dragOptions () {
      return {
        group: 'points_de_controle',
        ghostClass: 'fh-point-de-controle--ghost',
        disabled: !this.reorderingMode
      }
    },
    pointsDeControle: {
      get () {
        return this.reorderingMode ? this.sortablePointsDeControle : this.inspection.points_de_controle
      },
      set (value) {
        this.sortablePointsDeControle = value
      }
    },
    showMessagePointsDeControleNonModifiables () {
      return this.inspection.etat === 'en_cours' && this.$permissions.isInspecteur && !this.peutModifierPointsDeControle
    },
    inspectionModifiable () {
      return this.inspection.etat === 'preparation' || this.inspection.etat === 'en_cours'
    },
    peutReordonner () {
      return this.inspectionModifiable && this.$permissions.isInspecteur && this.inspection.points_de_controle.length > 1 && !this.reorderingMode
    },
    peutModifierPointsDeControle () {
      return this.inspectionModifiable && !this.inspection.suite
    },
    peutAjouterPointDeControle () {
      return this.peutModifierPointsDeControle && !this.showNewPointDeControleForm
    },
    peutGenererLettreAnnonce () {
      return this.$permissions.isInspecteur && isBeforeState(this.inspection.etat, 'attente_validation') && this.inspection.points_de_controle.length > 0 && !this.inspection.suite
    },
    peutGenererLettreSuite () {
      return this.$permissions.isInspecteur && isAfterState(this.inspection.etat, 'attente_validation')
    },
    peutGenererRapport () {
      return this.$permissions.isInspecteur && this.inspection.etat === 'en_cours' && this.inspection.suite
    },
    peutModifierSuites () {
      return this.$permissions.isInspecteur && this.inspectionModifiable
    },
    peutVoirSuites () {
      return this.inspection.etat !== 'preparation' && (!this.$permissions.isExploitant || isAfterState(this.inspection.etat, 'attente_validation'))
    }
  },
  created () {
    const matchMessage = /#pdc([0-9]+)-m([0-9]+)/.exec(this.$route.hash)
    if (matchMessage) {
      this.pointDeControleDeplieId = parseInt(matchMessage[1], 10)
      this.messageDepliedId = parseInt(matchMessage[2], 10)
    }
    const matchPointDeControle = /#pdc([0-9]+)/.exec(this.$route.hash)
    if (matchPointDeControle) {
      this.pointDeControleDeplieId = parseInt(matchPointDeControle[1], 10)
    }
  },
  mounted () {
    if (this.messageDepliedId) {
      try {
        // attente que la transition dépliage termine
        setTimeout(() => {
          this.$vuetify.goTo(`#m${this.messageDepliedId}`, {
            offset: 300
          })
        }, 300)
      } catch (e) {}
    } else if (this.pointDeControleDeplieId) {
      try {
        this.$vuetify.goTo(`#pdc${this.pointDeControleDeplieId}`, {
          offset: 300
        })
      } catch (e) {}
    }
  },
  methods: {
    enterReorderingMode () {
      this.sortablePointsDeControle = util.cloneDeep(this.inspection.points_de_controle)
      this.reorderingMode = true
    },
    async quitReorderingMode () {
      await this.$api.inspections.ordonnerPointsDeControle(this.inspection.id, this.sortablePointsDeControle.map(p => p.id))
      this.reorderingMode = false
      this.sortablePointsDeControle = []
    },
    resetNewPointDeControle () {
      this.newPointDeControle = {
        sujet: '',
        references_reglementaires: [
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
    async genererLettreAnnonce () {
      const url = await this.$api.inspections.genererLettreAnnonce(this.inspection.id)
      util.downloadFile(url, `lettre-annonce-${this.inspection.etablissement.nom}-${this.inspection.date}.odt`)
    },
    async genererLettreSuite () {
      const url = await this.$api.inspections.genererLettreSuite(this.inspection.id)
      util.downloadFile(url, `lettre-suite-${this.inspection.etablissement.nom}-${this.inspection.date}.odt`)
    },
    async genererRapport () {
      const url = await this.$api.inspections.genererRapport(this.inspection.id)
      util.downloadFile(url, `rapport-${this.inspection.etablissement.nom}-${this.inspection.date}.odt`)
    }
  }
}
</script>

<style lang="stylus">

</style>
