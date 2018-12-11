<template lang="pug">
  v-timeline-item(fill-dot :color="color" icon="message")
    span(v-if="author" slot="opposite" v-text="`${author.name} le ${message.date.toLocaleString()}`" :class="`${color}--text`")
    v-card(dark :color="color" class="white--text")
      v-container.fluid.grid-list(class="pa-0 ma-auto text-xs-left")
        v-layout.row.wrap
          v-flex.xs-12
            v-card-actions(class="pa-0 ma-auto")
              v-spacer
              v-tooltip.bottom
                v-btn(v-if="inspecteur" @click="lu =! lu" :label="label" icon flat slot="activator")
                  v-icon(v-if="lu") drafts
                  v-icon(v-else) markunread
                span {{ label }}
            v-card-text(:color="color")
              p {{ message.text }}
            fh-attachment(flat
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
    },
    colorBrouillon: {
      type: String,
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
      return this.message.lu ? this.colorBrouillon : 'red'
    },
    label () {
      return this.message.lu ? 'Lu' : 'Non lu'
    },
    inspecteur () {
      return this.author && this.author.type === 'exploitant' && this.$permissions.isInspecteur
    },
    lu: {
      get () {
        return this.$store.state.inspectionOuverte.echanges.find(echange => echange.reponses.filter(reponse => reponse.id === this.message.id).length > 0).reponses.find(reponse => reponse.id === this.message.id).lu
      },
      set (value) {
        this.$store.commit('updateMessageLu', { messageId: this.message.id, lu: value })
      }
    }
  },
  async created () {
    this.author = await getUser(this.message.authorId)
  }
}
</script>
