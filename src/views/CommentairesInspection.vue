<template lang="pug">
v-container
  p Ces commentaires ne sont visibles que par les inspecteurs.
  v-timeline
    fh-message(v-for="message in inspection.commentaires" :key="message.id" :message="message")
  .text-xs-center
    fh-new-message(v-if="peutAjouterCommentaire" @new-message="addCommentaire" commentaire)
</template>

<script>
import { isBeforeState } from '@/api/inspections'
import FhNewMessage from '@/components/FhNewMessage.vue'
import FhMessage from '@/components/FhMessage.vue'

export default {
  components: {
    FhNewMessage,
    FhMessage
  },
  props: {
    inspection: {
      type: Object,
      required: true
    }
  },
  computed: {
    peutAjouterCommentaire () {
      return isBeforeState(this.inspection.etat, 'close') && !this.$permissions.isExploitant
    }
  },
  methods: {
    async addCommentaire (message) {
      await this.$api.inspections.ajouterCommentaire(this.inspection.id, message)
    }
  }
}
</script>
