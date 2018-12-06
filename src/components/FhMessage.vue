<template lang="pug">
  div
    v-layout.pl-2.my-3
      v-icon(v-if="message.lu") drafts
      v-icon(v-else) markunread
      div.mr-2 {{ message.date.toLocaleString() }}
      strong.mr-2 {{ message.author }} :
      div {{ message.text }}
      div.ml-4
        fh-attachment(
          flat
          v-for="attachment in message.attachments" :key="attachment.id" :attachment="attachment")
    v-divider
</template>

<script>
import FhAttachment from '@/components/FhAttachment.vue'
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
  }
}
</script>
