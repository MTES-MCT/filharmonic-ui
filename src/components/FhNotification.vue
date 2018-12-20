<template lang="pug">
v-layout.row.align-center
  fh-evenement.flex(:evenement="notification.evenement" compact)
  v-btn(icon title="Marquer comme lu" @click="$emit('marquerCommeLue')")
    v-icon(color="primary") remove_red_eye
</template>

<script>
import FhEvenement from '@/components/FhEvenement'

export default {
  name: 'FhNotification',
  components: {
    FhEvenement
  },
  props: {
    notification: {
      type: Object,
      required: true
    }
  }
}
</script>
