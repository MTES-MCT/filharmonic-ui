<template lang="pug">
v-card
  v-toolbar(flat dense)
    v-toolbar-title.subheading Messages invisibles pour l'exploitant
  v-card-text
    fh-message(:etatInspection="inspection.etat" v-for="comment in inspection.comments" :message="comment" :key="comment.id")

</template>

<script>
import FhMessage from '@/components/FhMessage.vue'

export default {
  components: {
    FhMessage
  },
  props: {
    inspection: {
      type: Object,
      required: true
    }
  }
}
</script>
