<template lang="pug">
v-card
  v-toolbar(flat dense)
    v-toolbar-title.subheading Messages {{ echangeId > 0 ? 'visibles' : 'invisibles' }} pour l'exploitant
    v-btn(small icon v-if="echangeId > 0" @click="publier" :color="colorBrouillon" :title="`${brouillon ? 'Brouillon' : 'Publié'}`")
      v-icon {{ brouillon ? 'visibility_off' : 'visibility' }}
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
          v-btn(icon @click="addMessage(newMessage, confidential)" :disabled="!newMessage" color="primary" title="Envoyer")
            v-icon send

  v-card-text
    v-timeline
      fh-message(v-for="message in messages" :key="message.id" :message="message" :colorBrouillon="colorBrouillon")
</template>

<script>
import FhMessage from '@/components/FhMessage.vue'
import { allowedStates } from '@/api/inspections'
import { createNamespacedHelpers } from 'vuex'
import { inspection, mapEchangeFields } from '@/store/modules/inspection'
import { store } from '@/store'
import { ADD_ROW } from '@/store/mutation-types'

if (!store.state.inspection) store.registerModule('inspection', inspection)

const { mapState: mapAuthenticationState } = createNamespacedHelpers('authentication')
const { mapMutations: mapEchangeMutations } = createNamespacedHelpers('inspection/echange')

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
    ...mapAuthenticationState({
      user: state => state.user
    }),
    ...mapEchangeFields({ brouillon: 'rows[0].brouillon' }),
    showNewMessageForm () {
      return allowedStates[this.etatInspection].order < 4
    },
    colorBrouillon () {
      return this.brouillon ? 'primary' : 'success'
    }
  },
  methods: {
    ...mapEchangeMutations({
      addEchangeMessage: ADD_ROW
    }),
    addMessage (messageText, confidential) {
      this.addEchangeMessage('addMessage', {
        echangeId: this.echangeId,
        message: {
          authorId: this.user.id,
          date: new Date(),
          text: messageText,
          lu: false,
          confidential: confidential,
          attachments: []
        }
      })
      this.newMessage = ''
      this.dialogNewMessage = false
    },
    publier () {
      if (this.$permissions.isInspecteur) this.brouillon = !this.brouillon
    }
  }
}
</script>
