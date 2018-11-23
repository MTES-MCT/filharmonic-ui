<template lang="pug">
  v-dialog(v-model="show" scrollable width="800px")
      v-card(v-if="dialogAttachment")
        v-toolbar(color="primary" dark)
          v-toolbar-title.headline Visualisation : {{ dialogAttachment.filename }}
          v-spacer
          v-toolbar-items
            v-btn(flat dark @click="show = false")
              v-icon close
        v-card-text
          pdf(v-if="dialogAttachment.type == 'pdf'" src="/test/lorem-ipsum.pdf")
          v-img(v-if="dialogAttachment.type == 'image'" :src="`https://picsum.photos/800/600?image=${dialogAttachment.id}`")
</template>
<script>
export default {
  name: 'FhShowAttachment',
  props: {
    showAttachmentDialog: {
      type: Boolean,
      default: false
    },
    dialogAttachment: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      show: false
    }
  },
  created () {
    this.show = this.showAttachmentDialog
  }
}
</script>
