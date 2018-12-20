<template lang="pug">
  v-stepper(v-if="stepper")
    v-stepper-header
      v-stepper-step(step="1" :complete="stateInfos.order >= 1") Avant visite
      v-divider
      v-stepper-step(step="2" :complete="stateInfos.order >= 2") Visite sur site
      v-divider
      v-stepper-step(step="3" :complete="stateInfos.order >= 3") Rédaction du rapport sur les suites
      v-divider
      v-stepper-step(step="4" :complete="stateInfos.order >= 4") En attente de validation
      v-divider
      v-stepper-step(step="5" :complete="stateInfos.order >= 5") Validé
      v-divider
      v-stepper-step(step="6" :complete="stateInfos.order >= 6") Clos
  v-chip(:color="stateInfos.color" text-color="white" :small="small" v-else) {{ stateInfos.label }}

</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import { createEtat } from '@/models/etat'
const { mapState: mapEtatState } = createNamespacedHelpers('inspection/etat')
export default {
  name: 'FhEtatInspection',
  props: {
    etatId: {
      type: String,
      required: false,
      default: ''
    },
    stepper: {
      type: Boolean,
      default: false
    },
    small: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    etat () {
      return this.etats.length < 1 ? createEtat(this.etatId) : this.etats[0]
    },
    ...mapEtatState({
      etats: state => state.rows
    }),
    stateInfos () {
      return this.etat || {
        label: '?',
        color: 'grey',
        order: 0
      }
    }
  }
}
</script>
