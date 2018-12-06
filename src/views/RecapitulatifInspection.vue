<template lang="pug">
v-container
  fh-etat-inspection(:etat="inspection.etat" stepper)
</template>

<script>
import FhEtatInspection from '@/components/FhEtatInspection.vue'

export default {
  components: {
    FhEtatInspection
  },
  props: {
    inspection: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="stylus">
</style>
