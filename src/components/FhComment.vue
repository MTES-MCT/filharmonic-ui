<template lang="pug">
    v-card(raised)
      v-card-title(primary-title v-if="author" class="title")
        div
          div(class="headline")
            span {{ comment.text }}
            fh-attachment(flat
              v-for="attachment in comment.attachments" :key="attachment.id" :attachment="attachment")
      v-chip(small text-color="white" v-if="author")
        v-avatar
          img(:src="author.photoURL" :alt="author.name")
        | {{ author.name }}
      span Le {{ comment.date.toLocaleString() }}
</template>

<script>
import FhAttachment from '@/components/FhAttachment.vue'

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
    this.author = await this.$api.users.get(this.comment.authorId)
  }
}
</script>
