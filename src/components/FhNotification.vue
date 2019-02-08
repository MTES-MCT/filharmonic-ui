<template lang="pug">
v-layout.row.align-center
  fh-evenement.flex(:evenement="notification.evenement" compact)
  v-btn(icon title="Voir l'inspection"
        :to="`/inspections/${notification.evenement.inspection_id}`" active-class
        @click="$emit('open-inspection')"
        )
    v-icon(color="primary") input
  v-btn(icon title="Marquer comme lue" @click="$emit('marquer-comme-lue')")
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
