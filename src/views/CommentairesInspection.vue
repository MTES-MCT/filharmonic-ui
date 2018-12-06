<template lang="pug">
v-container(v-if="inspecteur")
  h4.display-1.my-4
    | Commentaires
  p Les commentaires sont internes et ne sont seulement visibles que par les inspecteurs.
  v-card
    v-card-text
      fh-message(v-for="comment in inspection.comments" :key="comment.id" :message="comment")
      v-layout.pl-2.mt-2.align-end
        v-textarea(box label="Commentaire" v-model="newComment" auto-grow hideDetails rows="1" clearable)
        v-btn.mb-0
          v-icon attach_file
        v-btn.mb-0(@click="addComment();" :disabled="!newComment" color="primary" title="Envoyer")
          v-icon send

</template>

<script>
import FhMessage from '@/components/FhMessage.vue'
import { mapState } from 'vuex'

export default {
  components: {
    FhMessage
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
  computed: {
    ...mapState({
      inspecteur: state => state.authentication.user.type === 'inspecteur',
      inspectionsOuvertes: 'inspectionsOuvertes'
    })
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
