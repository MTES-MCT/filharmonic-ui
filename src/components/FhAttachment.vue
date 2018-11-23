<template lang="pug">
  v-dialog(v-model="show" scrollable width="800px" v-if="attachment")
    v-btn(flat slot="activator")
      v-icon(v-if="attachment.type == 'pdf'") picture_as_pdf
      v-icon(v-if="attachment.type == 'image'") photo
      span.ml-2 {{ attachment.filename }}
    v-card
        v-toolbar(color="primary" dark)
          v-toolbar-title.headline Visualisation : {{ attachment.filename }}
          v-spacer
          v-toolbar-items
            v-btn(flat dark @click="show = false")
              v-icon close
        v-card-text
          pdf(v-if="attachment.type == 'pdf'" src="/test/lorem-ipsum.pdf")
          v-img(v-if="attachment.type == 'image'" :src="`https://picsum.photos/800/600?image=${attachment.id}`")
</template>

<script>
import pdf from 'vue-pdf'
export default {
  name: 'FhAttachment',
  components: {
    pdf
  },
  props: {
    attachment: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      show: false
    }
  }
}
</script>
