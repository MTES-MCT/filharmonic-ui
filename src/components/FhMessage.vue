<template lang="pug">
  v-timeline-item(fill-dot :color="color" :icon="icon" :left="message.auteur.profile !== 'exploitant'" :right="message.auteur.profile === 'exploitant'")
    span(slot="opposite")
      | {{ message.auteur.prenom }} {{ message.auteur.nom }}&nbsp;
      timeago(:datetime="message.date" :title="message.date.toLocaleString()")

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
              p {{ message.message }}
            fh-attachment(v-for="pieceJointe in message.pieces_jointes" :key="pieceJointe.id" :attachment="pieceJointe")
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
    commentaire () {
      return typeof this.message.interne === 'undefined'
    },
    color () {
      return this.commentaire || this.message.interne ? 'grey' : (this.message.lu ? 'primary' : 'red')
    },
    icon () {
      return this.commentaire || this.message.interne ? 'message' : (this.message.lu ? 'drafts' : 'markunread')
    },
    peutLireMessage () {
      return !this.message.lu && this.user.profile !== this.message.auteur.profile && !this.$permissions.isApprobateur
    }
  },
  methods: {
    async lireMessage () {
      await this.$api.inspections.lireMessage(this.message.id)
    }
  }
}
</script>
