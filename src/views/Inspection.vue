<template lang="pug">
div
  p.display-1.mt-4.text-xs-center(v-if="error") {{ error }}
  .app-loading(v-if="loading")
  div(v-if="!loading && inspection")
    .grey.lighten-4.elevation-2(:style="toolbarStyles")
      v-container.pa-0
        v-toolbar(flat dense)
          v-breadcrumbs(:items="breadcrumbs" divider=">" large)
          fh-etat-inspection(:etat="inspection.etat" small)
          v-spacer
          v-btn.white--text(v-if="$permissions.isApprobateur && inspection.etat == 'attente_validation'"
                            :loading="workflowActionLoading"
                            :disabled="workflowActionLoading"
                            color="green"
                            @click="validerInspection()"
                            )
            v-icon(left) done
            | Valider
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
import FhEtatInspection from '@/components/FhEtatInspection'
import { mapState } from 'vuex'

export default {
  components: {
    FhEtatInspection
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
      loading: false,
      workflowActionLoading: false
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
    }
  },
  watch: {
    inspectionId: {
      handler: 'loadInspection',
      immediate: true
    }
  },
  methods: {
    async loadInspection () {
      this.loading = true
      try {
        await this.$store.dispatch('loadInspection', parseInt(this.inspectionId, 10))
      } catch (err) {
        this.error = err.message
      }
      this.loading = false
    },
    async validerInspection () {
      this.workflowActionLoading = true
      try {
        await this.$store.dispatch('validerInspection', {
          inspectionId: this.inspection.id,
          approbateurId: this.$store.state.authentication.user.id
        })
      } catch (err) {
        this.error = err.message
      }
      this.workflowActionLoading = false
    }
  }
}
</script>

<style lang="stylus">
</style>
