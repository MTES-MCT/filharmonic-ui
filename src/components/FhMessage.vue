<template lang="pug">
  v-timeline-item(fill-dot :color="color" :icon="icon" :left="message.author.type !== 'exploitant'" :right="message.author.type === 'exploitant'")
    span(slot="opposite" v-text="`${message.author.name} le ${message.date.toLocaleString()}`" :class="`${color}--text`")
    v-card.white--text(dark :color="color")
      v-container.fluid.grid-list.pa-0.ma-0.text-xs-left
        v-layout.row.wrap
          v-flex.xs-12
            v-card-actions
              v-spacer
              v-btn(v-if="peutLireMessage" slot="activator"
                    icon flat title="Marquer comme lu"
                    @click="lireMessage"
                    )
                v-icon drafts
            v-card-text(:color="color")
              p {{ message.text }}
            fh-attachment(v-for="attachment in message.attachments" :key="attachment.id" :attachment="attachment")
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
    }
  },
  computed: {
    ...mapGetters([
      'user'
    ]),
    color () {
      return this.message.confidential ? 'grey' : (this.message.lu ? 'primary' : 'red')
    },
    icon () {
      return this.message.confidential ? 'message' : (this.message.lu ? 'drafts' : 'markunread')
    },
    peutLireMessage () {
      return !this.message.lu && this.user.type !== this.message.author.type && !this.$permissions.isApprobateur
    }
  },
  methods: {
    async lireMessage () {
      await this.$api.inspections.lireMessage(this.message.id)
    }
  }
}
</script>
