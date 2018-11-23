<template lang="pug">
v-container.grid-list-lg.controle-form
  v-alert.text-xs-center(type="error" :value="error") Le contrôle '#[strong {{ controleId }}]' ne semble pas exister. Mauvaise URL ?
  div(v-if="controle")
    h1.display-2
      v-btn(icon large :to="`/controles/${controle.id}`" title="Revenir au contrôle")
        v-icon(x-large) chevron_left
      | Contrôle n°{{ controle.id }}

    fh-detail-etablissement(v-if="!error", :etablissement="controle.etablissement")

    h4.display-1.mt-4 Détails du contrôle

    fh-detail-controle(:controle="controle")
</template>

<script>
import FhDetailControle from '@/components/FhDetailControle.vue'
import FhDetailEtablissement from '@/components/FhDetailEtablissement.vue'
import { getControle } from '@/api/controles'

export default {
  components: {
    FhDetailControle,
    FhDetailEtablissement
  },
  props: {
    controleId: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      error: false,
      controle: null // fetched on init
    }
  },
  async created () {
    this.controle = await getControle(this.controleId, { etablissement: true })
    if (!this.controle) {
      this.error = true
    }
  }
}
</script>

<style lang="stylus">
.controle-form
  max-width 600px
</style>
