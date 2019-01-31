<template lang="pug">
v-dialog(v-if="previewer" v-model="showDialog" scrollable lazy width="800px")
  v-btn(flat slot="activator" @click="loadAttachment")
    v-icon(left) {{ fileIcon }}
    span {{ attachment.nom }}
  v-card
    v-toolbar(color="primary" dark)
      v-toolbar-title.headline Visualisation : {{ attachment.nom }}
      v-spacer
      v-toolbar-items
        v-btn(flat dark @click="showDialog = false")
          v-icon close
    v-card-text.pa-0(style="overflow: hidden" v-if="url")
      v-img(v-if="previewer == 'image'" :src="url")
      iframe(v-if="previewer == 'iframe'" :src="url" style="width: 100%; height: 80vh")
v-btn(v-else flat @click="triggerDownload")
  v-icon(left) {{ fileIcon }}
  span {{ attachment.nom }}
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
      showDialog: false,
      url: ''
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
  },
  methods: {
    async loadAttachment () {
      this.url = await this.$api.inspections.getPieceJointe(this.attachment.id)
    },
    async triggerDownload () {
      const url = await this.$api.inspections.getPieceJointe(this.attachment.id)
      const link = document.createElement('a')
      link.href = url
      link.download = this.attachment.nom
      link.click()
    }
  }
}
</script>
