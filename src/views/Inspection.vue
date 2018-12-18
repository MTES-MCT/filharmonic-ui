<template lang="pug">
fh-page(:wait="wait")
  template(slot-scope="_")
    .grey.lighten-4.elevation-2(:style="toolbarStyles")
      v-container.pa-0
        v-toolbar(flat dense)
          v-breadcrumbs(:items="breadcrumbs" divider=">" large)
          fh-etat-inspection(:etat="inspection.etat" small)
          v-spacer

          v-btn(v-if="peutPublier"
                title="Publier"
                color="primary"
                @click="publierInspection()"
                )
            v-icon(left) public
            | Publier
          v-btn.white--text(v-if="peutValider"
                            :loading="workflowActionLoading"
                            :disabled="workflowActionLoading"
                            color="green"
                            @click="validerInspection()"
                            )
            v-icon(left) done
            | Valider

          v-btn(icon large @click="toggleFavoris()" :title="inspection.favoris ? 'Retirer des favoris' : 'Mettre en favoris'" v-if="!$permissions.isExploitant")
            v-icon {{ inspection.favoris ? 'star' : 'star_border' }}

          v-menu(offset-y v-if="peutGenererDocuments")
            v-btn(slot="activator" icon large title="Générer des documents")
              v-icon local_printshop
            //- un peu compliqué car les v-dialog ne s'intègrent pas facilement avec les v-list-tile
            v-list.py-0
              v-list-tile(@click="showLettreAnnonce = true")
                v-list-tile-title Générer la lettre d'annonce
                fh-lettre-annonce(:inspection="inspection" :show-dialog="showLettreAnnonce" @close="showLettreAnnonce = false")
              v-list-tile(@click="showLettreSuites = true")
                v-list-tile-title Générer la lettre de suites
                fh-lettre-suites(:inspection="inspection" :show-dialog="showLettreSuites" @close="showLettreSuites = false")

          v-toolbar-items(slot="extension")
            v-btn(flat :to="`/inspections/${inspection.id}`" exact)
              v-icon(left) check_circle
              | Points de contrôle
            v-btn(flat :to="`/inspections/${inspection.id}/details`")
              v-icon(left) info
              | Détails
            v-btn(flat :to="`/inspections/${inspection.id}/commentaires`")
              v-icon(left) message
              | Commentaires
            v-btn(flat :to="`/inspections/${inspection.id}/recapitulatif`")
              v-icon(left) wrap_text
              | Récapitulatif
            v-btn(flat :to="`/inspections/${inspection.id}/activite`")
              v-icon(left) event
              | Activité

    v-container.fluid.pa-0
      router-view(:inspection="inspection")
</template>

<script>
import { mapState } from 'vuex'
import FhEtatInspection from '@/components/FhEtatInspection.vue'
import FhLettreAnnonce from '@/components/FhLettreAnnonce.vue'
import FhLettreSuites from '@/components/FhLettreSuites.vue'
import BasePage from '@/views/mixins/BasePage.js'

export default {
  components: {
    FhEtatInspection,
    FhLettreAnnonce,
    FhLettreSuites
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
      workflowActionLoading: false,
      showLettreAnnonce: false,
      showLettreSuites: false
    }
  },
  computed: {
    ...mapState({
      inspection: state => state.inspectionOuverte
    }),
    breadcrumbs () {
      return this.inspection ? [
        {
          text: this.inspection.etablissement.nom,
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
      return !this.$permissions.isExploitant && this.inspection.etat === 'preparation'
    },
    peutValider () {
      return this.$permissions.isApprobateur && this.inspection.etat === 'attente_validation'
    },
    peutGenererDocuments () {
      return !this.$permissions.isExploitant
    }
  },
  watch: {
    inspectionId: {
      handler: 'loadInspection',
      immediate: true
    }
  },
  methods: {
    loadInspection () {
      this.wait = this.$store.dispatch('loadInspection', parseInt(this.inspectionId, 10))
    },
    async validerInspection () {
      this.workflowActionLoading = true
      try {
        await this.$api.inspections.valider(this.inspection.id)
      } finally {
        this.workflowActionLoading = false
      }
    },
    async toggleFavoris () {
      await this.$store.dispatch('toggleInspectionFavoris', {
        inspectionId: this.inspection.id,
        favoris: !this.inspection.favoris
      })
    },
    async publierInspection () {
      await this.$api.inspections.publier(this.inspection.id)
    }
  }
}
</script>

<style lang="stylus">
</style>
