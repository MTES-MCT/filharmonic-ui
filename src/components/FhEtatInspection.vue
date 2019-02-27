<template lang="pug">
v-stepper(v-if="stepper")
  v-stepper-header
    v-stepper-step(step="1" :complete="stateInfos.order >= 1") Préparation
    v-divider
    v-stepper-step(step="2" :complete="stateInfos.order >= 2") En cours
    v-divider
    v-stepper-step(step="3" :complete="stateInfos.order >= 3") En attente de validation
    v-divider
    v-stepper-step(step="4" :complete="stateInfos.order >= 4") Traitement des non-conformités
    v-divider
    v-stepper-step(step="5" :complete="stateInfos.order >= 5") Validé
v-chip(:color="stateInfos.color" text-color="white" :small="small" v-else) {{ stateInfos.label }}
</template>

<script>
import { allowedStates } from '@/api/inspections'

export default {
  name: 'FhEtatInspection',
  props: {
    etat: {
      type: String,
      default: null
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
    stateInfos () {
      return allowedStates[this.etat] || {
        label: '?',
        color: 'grey',
        order: 0
      }
    }
  }
}
</script>
