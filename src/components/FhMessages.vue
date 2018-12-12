<template lang="pug">
v-card
  v-toolbar(flat dense)
    v-toolbar-title.subheading Messages {{ echangeId > 0 ? 'visibles' : 'invisibles' }} pour l'exploitant
    v-btn(small icon v-if="echangeId > 0 && showNewMessageForm" @click="brouillon = !brouillon" :color="colorBrouillon" :disabled="!$permissions.isInspecteur" :title="`${brouillon ? 'Brouillon' : 'Publié'}`")
      v-icon(v-if="brouillon") visibility_off
      v-icon(v-else) visibility_on
    v-dialog(v-model="dialogNewMessage" v-if="showNewMessageForm" width="500")
      v-btn(small icon slot="activator" title="Nouveau message" :color="colorBrouillon")
        v-icon add
      v-card
        v-toolbar(dark color="primary")
          v-toolbar-title(class="white--text") Nouveau message
          v-spacer
          v-btn(icon @click="dialogNewMessage = false" title="Fermer")
            v-icon close
        v-divider
        v-card-text
          v-textarea(box label="Message" v-model="newMessage" auto-grow hideDetails rows="1" clearable)
          v-checkbox(v-model="confidential" label="Confidentiel" :disabled="echangeId < 0")
        v-divider
        v-card-actions
          v-spacer
          v-btn(icon title="Pièce jointe")
            v-icon attach_file
          v-btn(icon @click="addMessage(newMessage, confidential); newMessage = ''" :disabled="!newMessage" color="primary" title="Envoyer")
            v-icon send

  v-card-text
    v-timeline
      fh-message(v-for="message in messages" :key="message.id" :message="message" :colorBrouillon="colorBrouillon")
</template>

<script>
import FhMessage from '@/components/FhMessage.vue'
import { allowedStates } from '@/api/inspections'
import { mapGetters } from 'vuex'

export default {
  name: 'FhMessages',
  components: {
    FhMessage
  },
  props: {
    messages: {
      type: Array,
      required: true
    },
    etatInspection: {
      type: String,
      required: true,
      default: 'en_cours'
    },
    echangeId: {
      type: Number,
      required: false,
      default: -1
    }
  },
  data () {
    return {
      newMessage: '',
      confidential: true,
      dialogNewMessage: false
    }
  },
  computed: {
    ...mapGetters([
      'user'
    ]),
    showNewMessageForm () {
      return allowedStates[this.etatInspection].order < 4
    },
    brouillon: {
      get () {
        const echange = this.$store.state.inspectionOuverte.echanges.find(echange => echange.id === this.echangeId)
        return echange === undefined ? true : echange.brouillon
      },
      set (value) {
        this.$store.commit('updateEchangeBrouillon', { echangeId: this.echangeId, brouillon: value })
      }
    },
    colorBrouillon () {
      return this.brouillon ? 'primary' : 'success'
    }
  },
  methods: {
    addMessage (message, confidential) {
      this.messages.push({
        authorId: this.user.id,
        date: new Date(),
        text: message,
        lu: false,
        confidential: confidential,
        attachments: []
      })
    }
  }
}
</script>
