<template lang="pug">
  v-timeline-item(fill-dot :icon="icon" :color="color")
    v-card(dark :color="color")
      v-card-title(v-if="author" class="title")
        v-chip(:color="color")
          v-avatar
            img(:src="author.photoURL" :alt="author.name")
          | {{ author.name }}
      v-card-text
        p {{ message.text }}
        v-switch(v-if="inspecteur" v-model="message.lu" :label="label")
        p {{ message.date.toLocaleString() }}
        fh-attachment(
          flat
          v-for="attachment in message.attachments" :key="attachment.id" :attachment="attachment")
</template>

<script>
import FhAttachment from '@/components/FhAttachment.vue'
import { getUser } from '@/api/users'

export default {
  name: 'FhMessage',
  components: {
    FhAttachment
  },
  props: {
    message: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      author: null
    }
  },
  computed: {
    color () {
      return this.message.lu ? 'grey' : 'blue'
    },
    icon () {
      return this.message.lu ? 'drafts' : 'markunread'
    },
    label () {
      return this.message.lu ? 'Lu' : 'Non lu'
    }
  },
  async created () {
    this.author = await getUser(this.message.authorId)
  },
  methods: {
    inspecteur () {
      return this.author.type === 'inspecteur'
    }
  }
}
</script>
