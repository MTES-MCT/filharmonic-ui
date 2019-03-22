<template lang="pug">
  v-timeline-item(v-observe-visibility="lireMessage" :id="`m${message.id}`" fill-dot :color="color" :icon="icon" :left="message.auteur.profile !== 'exploitant'" :right="message.auteur.profile === 'exploitant'")
    span(slot="opposite")
      | {{ message.auteur.prenom }} {{ message.auteur.nom }}&nbsp;
      timeago(:datetime="message.date" :title="message.date.toLocaleString()")

    v-card.white--text(dark :color="color")
      v-container.fluid.grid-list.pa-0.ma-0.text-xs-left
        v-layout.row.wrap
          v-flex.xs-12
            v-card-text(:color="color")
              p.fh-multiline {{ message.message }}
            fh-attachment(v-for="pieceJointe in message.pieces_jointes" :key="pieceJointe.id" :attachment="pieceJointe")
</template>

<script>
import Vue from 'vue'
import { ObserveVisibility } from 'vue-observe-visibility'
import FhAttachment from '@/components/FhAttachment.vue'
import { mapGetters } from 'vuex'

Vue.directive('observe-visibility', ObserveVisibility)

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
    async lireMessage (isVisible, entry) {
      if (isVisible && this.peutLireMessage) {
        await this.$api.inspections.lireMessage(this.message.id)
      }
    }
  }
}
</script>
