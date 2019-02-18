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
                @click="publier()"
                )
            v-icon(left) public
            | Publier
          v-btn.white--text(v-if="peutDemanderValidation"
                            color="green"
                            @click="demanderValidation()"
                            )
            v-icon(left) done
            | Demander une validation
          v-btn.white--text(v-if="peutValider"
                            color="red"
                            title="Rejeter la demande de validation"
                            @click="rejeter()"
                            )
            v-icon(left) cancel
            | Rejeter
          v-btn.white--text(v-if="peutValider"
                            color="green"
                            title="Accepter la demande de validation"
                            @click="valider()"
                            )
            v-icon(left) done
            | Valider

          v-btn(icon large @click="toggleFavoris()" :title="isFavorite ? 'Retirer des favoris' : 'Mettre en favoris'" v-if="!$permissions.isExploitant")
            v-icon {{ isFavorite ? 'star' : 'star_border' }}

          v-menu(bottom left offset-y v-if="peutGenererDocuments")
            v-btn(slot="activator" icon large title="Générer des documents")
              v-icon local_printshop
            //- un peu compliqué car les v-dialog ne s'intègrent pas facilement avec les v-list-tile
            v-list.py-0
              v-list-tile(@click.stop="showLettreAnnonce = true")
                v-list-tile-title Générer la lettre d'annonce
                fh-lettre-annonce(:inspection="inspection" :show-dialog="showLettreAnnonce" @close="showLettreAnnonce = false")
              v-list-tile(@click.stop="showLettreSuites = true")
                v-list-tile-title Générer la lettre de suites
                fh-lettre-suites(:inspection="inspection" :show-dialog="showLettreSuites" @close="showLettreSuites = false")

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
      showLettreAnnonce: false,
      showLettreSuites: false
    }
  },
  computed: {
    ...mapState({
      inspection: state => state.inspectionOuverte,
      favoris: state => state.authentication.user.favoris
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
    peutGenererDocuments () {
      return this.$permissions.isInspecteur
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
    async rejeter () {
      await this.$api.inspections.rejeter(this.inspection.id)
    },
    async valider () {
      await this.$api.inspections.valider(this.inspection.id)
    }
  }
}
</script>

<style lang="stylus">
</style>
