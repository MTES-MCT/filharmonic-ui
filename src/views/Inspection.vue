<template lang="pug">
fh-page(:wait="wait")
  template(slot-scope="_")
    .grey.lighten-4.elevation-2(:style="toolbarStyles")
      v-container.pa-0
        v-toolbar(flat dense)
          v-breadcrumbs(:items="breadcrumbs" divider=">" large)
          fh-etat-inspection(:etat="inspection.etat" small)
          v-spacer

          fh-btn(v-if="peutPublier"
                title="Publier"
                color="primary"
                :action="publier"
                )
            v-icon(left) public
            | Publier
          fh-btn.white--text(v-if="peutDemanderValidation"
                            color="green"
                            :action="demanderValidation"
                            )
            v-icon(left) done
            | Demander une validation

          template(v-if="peutValider")
            v-btn(title="Rejeter la demande de validation" color="red" @click="showRejetValidationDialog = true")
              v-icon(left) close
              | Rejeter
            fh-rejet-validation-dialog(:show-dialog="showRejetValidationDialog" @close="showRejetValidationDialog = false" :action="rejeter")

            v-btn(title="Accepter la demande de validation" color="green" @click="showValidationDialog = true")
              v-icon(left) done
              | Valider
            fh-validation-dialog(:show-dialog="showValidationDialog" @close="showValidationDialog = false" :action="valider")

          fh-btn.white--text(v-if="peutClore"
                            color="green"
                            title="Clore l'inspection"
                            :action="clore"
                            )
            v-icon(left) done
            | Clore

          fh-btn(icon large :action="toggleFavoris" :title="isFavorite ? 'Retirer des favoris' : 'Mettre en favoris'" v-if="!$permissions.isExploitant")
            v-icon {{ isFavorite ? 'star' : 'star_border' }}

          v-menu(bottom left offset-y v-if="$permissions.isInspecteur")
            v-btn(slot="activator" icon large title="Afficher le menu")
              v-icon more_vert
            v-list.py-0
              v-list-tile(@click="showCreationCanevasDialog = true" v-if="peutEnregistrerEnCanevas")
                v-list-tile-avatar
                  v-icon save
                v-list-tile-title Enregistrer en canevas
          //- fh-popup-creation-canevas(v-if="peutEnregistrerEnCanevas" :show-dialog="showPopupCreationCanevas"
                                    @close="showPopupCreationCanevas = false" @submit="enregistrerEnCanevas")

          fh-creation-canevas-dialog(:show-dialog="showCreationCanevasDialog" @close="showCreationCanevasDialog = false" :action="enregistrerEnCanevas")

          v-toolbar-items(slot="extension")
            v-btn(flat :to="`/inspections/${inspection.id}`" exact)
              v-icon(left) check_circle
              | Points de contrôle
            v-btn(flat :to="`/inspections/${inspection.id}/details`")
              v-icon(left) info
              | Détails
            v-btn(flat :to="`/inspections/${inspection.id}/commentaires`" v-if="!$permissions.isExploitant")
              v-icon(left) message
              | Commentaires
            v-btn(flat :to="`/inspections/${inspection.id}/recapitulatif`")
              v-icon(left) wrap_text
              | Récapitulatif
            v-btn(flat :to="`/inspections/${inspection.id}/activite`" v-if="!$permissions.isExploitant")
              v-icon(left) event
              | Activité

    v-container.fluid.pa-0
      router-view(:inspection="inspection")
</template>

<script>
import { mapState } from 'vuex'
import FhBtn from '@/components/FhBtn.vue'
import FhEtatInspection from '@/components/FhEtatInspection.vue'
import FhRejetValidationDialog from '@/components/FhRejetValidationDialog.vue'
import FhCreationCanevasDialog from '@/components/FhCreationCanevasDialog.vue'
import FhValidationDialog from '@/components/FhValidationDialog.vue'
import events from '@/events'
import BasePage from '@/views/mixins/BasePage.js'

export default {
  components: {
    FhBtn,
    FhEtatInspection,
    FhCreationCanevasDialog,
    FhRejetValidationDialog,
    FhValidationDialog
  },
  mixins: [BasePage],
  props: {
    inspectionId: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      showCreationCanevasDialog: false,
      showRejetValidationDialog: false,
      showValidationDialog: false
    }
  },
  computed: {
    ...mapState({
      inspection: state => state.inspectionOuverte,
      favoris: state => state.inspectionsFavorites
    }),
    isFavorite () {
      return this.favoris.filter(favori => favori.id === this.inspection.id).length > 0
    },
    breadcrumbs () {
      return this.inspection ? [
        {
          text: this.inspection.etablissement.raison,
          to: `/etablissements/${this.inspection.etablissement.id}`
        },
        {
          text: `Inspection du ${this.inspection.date.toLocaleString()}`,
          'active-class': null,
          to: `/inspections/${this.inspection.id}`
        }
      ] : []
    },
    toolbarStyles () {
      return {
        position: 'sticky',
        top: `${this.$vuetify.application.top}px`,
        'z-index': 2
      }
    },
    peutPublier () {
      return this.$permissions.isInspecteur && this.inspection.etat === 'preparation'
    },
    peutDemanderValidation () {
      return this.$permissions.isInspecteur && this.inspection.etat === 'en_cours' && this.inspection.suite
    },
    peutValider () {
      return this.$permissions.isApprobateur && this.inspection.etat === 'attente_validation'
    },
    hasConstatsNonResolus () {
      return this.inspection.points_de_controle.some(p => p.constat.type !== 'conforme' && !p.constat.date_resolution)
    },
    peutClore () {
      return this.$permissions.isInspecteur && this.inspection.etat === 'traitement_non_conformites' && !this.hasConstatsNonResolus
    },
    peutGenererDocuments () {
      return this.$permissions.isInspecteur && (this.peutGenererLettreAnnonce || this.peutGenererLettreSuite)
    },
    peutEnregistrerEnCanevas () {
      return this.$permissions.isInspecteur
    }
  },
  watch: {
    inspectionId: {
      handler: 'loadInspection',
      immediate: true
    }
  },
  created () {
    this.$api.events.subscribe('inspection', parseInt(this.inspectionId, 10))
    this.$api.events.bus.$on('resource_updated', this.resourceUpdatedCallback)
  },
  beforeDestroy () {
    this.$api.events.unsubscribe('inspection', parseInt(this.inspectionId, 10))
    this.$api.events.bus.$off('resource_updated', this.resourceUpdatedCallback)
  },
  methods: {
    async resourceUpdatedCallback ({ resource, resource_id: resourceId }) {
      if (resource === 'inspection' && resourceId === parseInt(this.inspectionId, 10)) {
        await this.loadInspection()
        this.$api.events.bus.$emit(events.Alert, 'info', `Les données de l'inspection ont été mises à jour par quelqu'un d'autre.`)
      }
    },
    loadInspection () {
      this.wait = this.$api.inspections.loadInspection(parseInt(this.inspectionId, 10))
    },
    async toggleFavoris () {
      if (!this.isFavorite) {
        await this.$api.inspections.addFavori(this.inspection.id)
      } else {
        await this.$api.inspections.removeFavori(this.inspection.id)
      }
    },
    async publier () {
      await this.$api.inspections.publier(this.inspection.id)
    },
    async demanderValidation () {
      await this.$api.inspections.demanderValidation(this.inspection.id)
    },
    async rejeter (motifRejet) {
      await this.$api.inspections.rejeter(this.inspection.id, motifRejet)
    },
    async valider (rapport) {
      await this.$api.inspections.valider(this.inspection.id, rapport)
    },
    async clore () {
      await this.$api.inspections.clore(this.inspection.id)
    },
    async enregistrerEnCanevas (canevas) {
      await this.$api.inspections.enregistrerEnCanevas(this.inspection.id, canevas)
    }
  }
}
</script>

<style lang="stylus">
</style>
