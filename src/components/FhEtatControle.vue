<template lang="pug">
  v-chip(:color="color" text-color="white") {{ label }}
</template>

<script>
import { allowedStates } from '@/api/controles'
export default {
  name: 'FhEtatControle',
  props: {
    state: {
      type: String,
      default: null
    }
  },
  computed: {
    stateInfos () {
      return allowedStates[this.state] || {
        label: '?',
        color: 'grey'
      }
    },
    label () {
      return this.stateInfos.label
    },
    color () {
      return this.stateInfos.color
    }
  }
}
</script>
