<template lang="pug">
div
  p.display-1.mt-4.text-xs-center(v-if="error") {{ error }}
  v-container.pa-0(v-if="inspection")
    v-toolbar(dense)
      v-toolbar-title {{ inspection.date.toLocaleString() }} chez {{ inspection.etablissement.nom }}
      v-spacer
      v-toolbar-items
        v-btn(flat :to="`/inspections/${inspection.id}`" exact) Points de contrôle
        v-btn(flat :to="`/inspections/${inspection.id}/details`") Détails
        v-btn(flat :to="`/inspections/${inspection.id}/commentaires`") Commentaires
        v-btn(flat :to="`/inspections/${inspection.id}/recapitulatif`") Récapitulatif
        v-btn(flat :to="`/inspections/${inspection.id}/activite`") Activité
      v-spacer

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
