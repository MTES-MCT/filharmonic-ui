<template lang="pug">
v-dialog(v-if="previewer" v-model="showDialog" scrollable width="800px")
  v-btn(flat slot="activator")
    v-icon(left) {{ fileIcon }}
    span {{ attachment.filename }}
  v-card
    v-toolbar(color="primary" dark)
      v-toolbar-title.headline Visualisation : {{ attachment.filename }}
      v-spacer
      v-toolbar-items
        v-btn(flat dark @click="showDialog = false")
          v-icon close
    v-card-text.pa-0(style="overflow: hidden")
      v-img(v-if="previewer == 'image'" :src="attachment.url")
      iframe(v-if="previewer == 'iframe'" :src="attachment.url" style="width: 100%; height: 80vh")
v-btn(v-else flat :href="attachment.url" :download="attachment.filename")
  v-icon(left) {{ fileIcon }}
  span {{ attachment.filename }}
</template>

<script>
export default {
  name: 'FhAttachment',
  props: {
    attachment: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      showDialog: false
    }
  },
  computed: {
    previewer () {
      switch (this.attachment.type) {
        case 'image/jpeg':
        case 'image/png':
          return 'image'
        case 'application/pdf':
          return 'iframe'
        default:
          return null
      }
    },
    fileIcon () {
      switch (this.attachment.type) {
        case 'image/jpeg':
        case 'image/png':
          return 'photo_library'
        case 'application/pdf':
          return 'picture_as_pdf'
        default:
          return 'library_books'
      }
    }
  }
}
</script>
