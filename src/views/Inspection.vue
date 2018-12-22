<template lang="pug">
fh-page(:wait="wait")
  template(slot-scope="_")
    .grey.lighten-4.elevation-2(:style="toolbarStyles")
      v-container.pa-0
        v-toolbar(flat dense)
          v-breadcrumbs(:items="breadcrumbs" divider=">" large)
          fh-etat-inspection(small)
          v-spacer

          v-btn.white--text(v-if="$permissions.isApprobateur && etat == 'attente_validation'"
                            :loading="workflowActionLoading"
                            :disabled="workflowActionLoading"
                            color="green"
                            @click="validerInspection()"
                            )
            v-icon(left) done
            | Valider
          v-menu(offset-y v-if="!$permissions.isExploitant")
            v-btn(slot="activator" icon large title="Générer des documents")
              v-icon local_printshop
            //- un peu compliqué car les v-dialog ne s'intègrent pas facilement avec les v-list-tile
            v-list.py-0
              v-list-tile(@click="showLettreAnnonce = true")
                v-list-tile-title Générer la lettre d'annonce
                fh-lettre-annonce(:inspection="detail" :show-dialog="showLettreAnnonce" @close="showLettreAnnonce = false")
              v-list-tile(@click="showLettreSuites = true")
                v-list-tile-title Générer la lettre de suites
                fh-lettre-suites(:inspection="detail" :show-dialog="showLettreSuites" @close="showLettreSuites = false")

          v-toolbar-items(slot="extension")
            v-btn(flat :to="`/inspections/${detail.id}`" exact)
              v-icon(left) check_circle
              | Points de contrôle
            v-btn(flat :to="`/inspections/${detail.id}/details`")
              v-icon(left) info
              | Détails
            v-btn(flat :to="`/inspections/${detail.id}/commentaires`")
              v-icon(left) message
              | Commentaires
            v-btn(flat :to="`/inspections/${detail.id}/recapitulatif`")
              v-icon(left) wrap_text
              | Récapitulatif
            v-btn(flat :to="`/inspections/${detail.id}/activite`")
              v-icon(left) event
              | Activité

    v-container.fluid.pa-0
      router-view(:inspectionId="detail.id")
</template>

<script>
import { store } from '@/store'
import FhEtatInspection from '@/components/FhEtatInspection.vue'
import FhLettreAnnonce from '@/components/FhLettreAnnonce.vue'
import FhLettreSuites from '@/components/FhLettreSuites.vue'
import BasePage from '@/views/mixins/BasePage.js'
import { inspection } from '@/store/modules/inspection'
import { createNamespacedHelpers } from 'vuex'
import { GET, VALIDATE } from '@/store/action-types'

if (!store.state.inspection) store.registerModule('inspection', inspection)
const { mapActions: mapInspectionActions } = createNamespacedHelpers('inspection')
const { mapState: mapDetailState } = createNamespacedHelpers('inspection/detail')
const { mapState: mapEtablissementState } = createNamespacedHelpers('inspection/etablissement')
const { mapState: mapEtatState } = createNamespacedHelpers('inspection/etat')
const { mapState: mapAuthenticationState } = createNamespacedHelpers('authentication')

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
    ...mapEtablissementState({ etablissement: state => state.rows[0] }),
    ...mapDetailState({ detail: state => state.rows[0] }),
    ...mapEtatState({ etat: state => state.rows[0] }),
    ...mapAuthenticationState({ user: state => state.rows[0] }),
    breadcrumbs () {
      return this.detail ? [
        {
          text: this.etablissement.nom,
          to: `/etablissements/${this.etablissement.id}`
        },
        {
          text: `Inspection du ${this.detail.date.toLocaleString()}`,
          'active-class': null,
          to: `/inspections/${this.detail.id}`
        }
      ] : []
    },
    toolbarStyles () {
      return {
        position: 'sticky',
        top: `${this.$vuetify.application.top}px`,
        'z-index': 2
      }
    }
  },
  watch: {
    inspectionId: {
      handler: 'loadInspection',
      immediate: true
    }
  },
  methods: {
    ...mapInspectionActions({ load: GET, valider: VALIDATE }),
    async loadInspection () {
      const id = parseInt(this.inspectionId, 10)
      this.wait = this.load(id)
    },
    async validerInspection () {
      this.workflowActionLoading = true
      try {
        await this.valider({
          inspectionId: this.inspection.id,
          approbateurId: this.user.id
        })
      } finally {
        this.workflowActionLoading = false
      }
    }
  }
}
</script>
