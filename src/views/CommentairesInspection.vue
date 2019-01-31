<template lang="pug">
v-container
  p Ces commentaires ne sont visibles que par les inspecteurs.
  fh-messages(:etatInspection="inspection.etat" :messages="inspection.commentaires")
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
