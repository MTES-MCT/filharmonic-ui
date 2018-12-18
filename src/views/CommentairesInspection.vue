<template lang="pug">
v-container
  fh-messages(:etatInspection="inspection.etat" :messages="inspection.comments")
</template>

<script>
import FhMessages from '@/components/FhMessages.vue'

export default {
  components: {
    FhMessages
  },
  props: {
    inspection: {
      type: Object,
      required: true
    }
  }
}
</script>
