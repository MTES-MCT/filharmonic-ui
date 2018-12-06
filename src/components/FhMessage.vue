<template lang="pug">
  v-timeline-item(fill-dot :icon="`${message.lu ? 'drafts' : 'markunread'}`" :color="`${message.lu ? 'grey' : 'blue'}`")
    v-card(dark :color="`${message.lu ? 'grey' : 'blue'}`")
      v-card-title(v-if="author" class="title") {{ message.date.toLocaleString() }} {{ author.name }}
      v-card-text
        p {{ message.text }}
        v-switch(v-if="inspecteur" v-model="message.lu" :label="`${message.lu ? 'Lu' : 'Non lu'}`")
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
