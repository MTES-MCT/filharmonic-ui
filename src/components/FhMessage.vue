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
const { mapState: mapMessageState } = createNamespacedHelpers('inspection/echange/message')

export default {
  name: 'FhMessage',
  components: {
    FhAttachment
  },
  props: {
    colorBrouillon: {
      type: String,
      required: false,
      default: 'primary'
    },
    index: {
      type: Number,
      required: false,
      default: -1
    }
  },
  data () {
    return {
      author: null
    }
  },
  computed: {
    ...mapMessageState({ messages: 'rows' }),
    message () {
      return this.messages[this.index]
    },
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
      user: state => state.rows[0].user
    })
  },
  async created () {
    this.author = this.message ? await this.$api.users.get(this.message.authorId) : null
  },
  methods: {
    lire (value) {
      this.$store.commit('inspection/echange/message/updateField', { path: 'rows[' + this.index + '].lu', value })
    }
  }
}
</script>
