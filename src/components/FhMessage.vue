<template lang="pug">
  v-timeline-item(v-if="author" fill-dot :color="color" :icon="icon" :left="author.type !== 'exploitant'" :right="author.type === 'exploitant'")
    span(v-if="author" slot="opposite" v-text="`${author.name} le ${message.date.toLocaleString()}`" :class="`${color}--text`")
    v-card(dark :color="color" class="white--text")
      v-container.fluid.grid-list(class="pa-0 ma-0 text-xs-left")
        v-layout.row.wrap
          v-flex.xs-12
            v-card-actions
              v-spacer
              v-btn(v-if="author && user.type !== author.type && !$permissions.isApprobateur" @click="lire(!message.lu)" :label="label" icon flat slot="activator" :title="label")
                v-icon(v-if="message.lu") drafts
                v-icon(v-else) markunread
            v-card-text(:color="color")
              p {{ message.text }}
            fh-attachment(flat
              v-for="attachment in message.attachments" :key="attachment.id" :attachment="attachment")
</template>

<script>
import FhAttachment from '@/components/FhAttachment.vue'
import { createNamespacedHelpers } from 'vuex'
const { mapState: mapAuthenticationState } = createNamespacedHelpers('authentication')

export default {
  name: 'FhMessage',
  components: {
    FhAttachment
  },
  props: {
    message: {
      type: Object,
      required: true
    },
    colorBrouillon: {
      type: String,
      required: true
    },
    index: {
      type: Number,
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
      return this.message.confidential ? 'grey' : (this.message.lu ? this.colorBrouillon : 'red')
    },
    icon () {
      return this.message.confidential ? 'message' : (this.message.lu ? 'drafts' : 'markunread')
    },
    label () {
      return this.message.lu ? 'Lu' : 'Non lu'
    },
    ...mapAuthenticationState({
      user: state => state.user
    })
  },
  async created () {
    this.author = await this.$api.users.get(this.message.authorId)
  },
  methods: {
    lire (value) {
      this.$store.commit('inspection/echange/message/updateField', { path: 'rows[' + this.index + '].message.lu', value })
    }
  }
}
</script>
