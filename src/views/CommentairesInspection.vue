<template lang="pug">
v-card
  v-toolbar(flat dense)
    v-toolbar-title.subheading Messages invisibles pour l'exploitant
  v-card-text
    fh-message(v-for="(comment, index) in comments" :index="index" :key="comment.id")

</template>

<script>
import FhMessage from '@/components/FhMessage.vue'
import { createNamespacedHelpers } from 'vuex'
const { mapState: mapCommentState } = createNamespacedHelpers('inspection/comment')

export default {
  components: {
    FhMessage
  },
  computed: {
    ...mapCommentState({ comments: 'rows' })
  }
}
</script>
