<template lang="pug">
v-container(v-if="!$permission.isExploitant")
  p Les commentaires sont internes et ne sont seulement visibles que par les inspecteurs.
  v-card
    v-card-text
      fh-comment(v-for="comment in inspection.comments" :key="comment.id" :comment="comment")
      v-layout.pl-2.mt-2.align-end
        v-textarea(box label="Commentaire" v-model="newComment" auto-grow hideDetails rows="1" clearable)
        v-btn.mb-0
          v-icon attach_file
        v-btn.mb-0(@click="addComment();" :disabled="!newComment" color="primary" title="Envoyer")
          v-icon send

</template>

<script>
import FhComment from '@/components/FhComment.vue'

export default {
  components: {
    FhComment
  },
  props: {
    inspection: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      newComment: ''
    }
  },
  methods: {
    addComment () {
      this.inspection.comments.push({
        author: 'Alain Champion',
        text: this.newComment,
        date: new Date(),
        attachments: []
      })
      this.newComment = ''
    }
  }
}
</script>

<style lang="stylus">
</style>
