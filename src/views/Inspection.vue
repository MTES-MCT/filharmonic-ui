<template lang="pug">
div
  p.display-1.mt-4.text-xs-center(v-if="error") {{ error }}
  .grey.lighten-4.elevation-2
    v-container.pa-0(v-if="inspection")
      v-toolbar(flat dense)
        v-breadcrumbs.mt-2(:items="breadcrumbs" divider=">" large)
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

  v-container.fluid.pa-0(v-if="inspection")
    router-view(:inspection="inspection")
</template>

<script>
import { getInspection } from '@/api/inspections'
import * as _ from '@/util'

export default {
  props: {
    inspectionId: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      error: '',
      inspection: null // fetched on init
    }
  },
  computed: {
    breadcrumbs () {
      return this.inspection ? [
        {
          text: this.inspection.etablissement.nom,
          href: `/etablissements/${this.inspection.etablissement.id}`
        },
        {
          text: `Inspection du ${this.inspection.date.toLocaleString()}`,
          href: `/inspections/${this.inspection.id}`
        }
      ] : []
    }
  },
  async created () {
    try {
      this.inspection = _.cloneDeep(await getInspection(this.inspectionId, {
        etablissement: true,
        activite: true
      }))
    } catch (err) {
      this.error = err.message
    }
  }
}
</script>

<style lang="stylus">
</style>
