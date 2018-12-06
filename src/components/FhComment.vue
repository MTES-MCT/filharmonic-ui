<template lang="pug">
    v-card(raised)
      v-card-title(v-if="author" class="title")
        v-chip
          v-avatar
            img(:src="author.photoURL" :alt="author.name")
          | {{ author.name }}
      v-card-text
        p Le {{ comment.date.toLocaleString() }}
        p {{ comment.text }}
        fh-attachment(
          flat
          v-for="attachment in comment.attachments" :key="attachment.id" :attachment="attachment")
</template>

<script>
import FhAttachment from '@/components/FhAttachment.vue'
import { getUser } from '@/api/users'

export default {
  name: 'FhComment',
  components: {
    FhAttachment
  },
  props: {
    comment: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      author: null
    }
  },
  async created () {
    this.author = await getUser(this.comment.authorId)
  }
}
</script>
