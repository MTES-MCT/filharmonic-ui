<template lang="pug">
  v-timeline-item(fill-dot :color="color" :icon="icon" :left="message.author.type !== 'exploitant'" :right="message.author.type === 'exploitant'")
    span(slot="opposite" v-text="`${message.author.name} le ${message.date.toLocaleString()}`" :class="`${color}--text`")
    v-card(dark :color="color" class="white--text")
      v-container.fluid.grid-list(class="pa-0 ma-0 text-xs-left")
        v-layout.row.wrap
          v-flex.xs-12
            v-card-actions
              v-spacer
              v-btn(v-if="user.type !== message.author.type && !$permissions.isApprobateur" @click="lu =! lu" :label="label" icon flat slot="activator" :title="label")
                v-icon(v-if="lu") drafts
                v-icon(v-else) markunread
            v-card-text(:color="color")
              p {{ message.text }}
            fh-attachment(flat
              v-for="attachment in message.attachments" :key="attachment.id" :attachment="attachment")
</template>

<script>
import FhAttachment from '@/components/FhAttachment.vue'
import { mapGetters } from 'vuex'

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
    ...mapGetters([
      'user'
    ]),
    lu: {
      get () {
        return this.$store.state.inspectionOuverte.pointsDeControle.find(pointDeControle => pointDeControle.messages.filter(message => message.id === this.message.id).length > 0).messages.find(message => message.id === this.message.id).lu
      },
      set (value) {
        this.$store.commit('updateMessageLu', { messageId: this.message.id, lu: value })
      }
    }
  }
}
</script>
