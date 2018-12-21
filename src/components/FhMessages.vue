<template lang="pug">
v-card
  v-toolbar(flat dense)
    v-toolbar-title.subheading Messages
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

        fh-attachment(v-for="(attachment, index) in attachments" :key="index" :attachment="attachment")

        v-divider
        v-card-actions
          v-spacer
          v-btn(icon title="Ajouter une pièce jointe" @click="openAttachmentPopup")
            v-icon attach_file
          input(ref="file" type="file" @change="onFilesChange" multiple hidden)
          v-btn(icon @click="addMessage(newMessage, confidential)" :disabled="!newMessage" color="primary" title="Envoyer")
            v-icon send

  v-card-text
    v-timeline
      fh-message(v-for="message in messages" :key="message.id" :message="message" :colorBrouillon="colorBrouillon")
</template>

<script>
import FhAttachment from '@/components/FhAttachment.vue'
import FhMessage from '@/components/FhMessage.vue'
import { allowedStates } from '@/api/inspections'
import { mapGetters, mapState } from 'vuex'

export default {
  name: 'FhMessages',
  components: {
    FhAttachment,
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
      attachments: [],
      dialogNewMessage: false
    }
  },
  computed: {
    ...mapGetters([
      'user'
    ]),
    ...mapState({
      inspection: 'inspectionOuverte'
    }),
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
    openAttachmentPopup () {
      this.$refs.file.click()
    },
    async addMessage (messageText, confidential) {
      if (this.echangeId === -1) {
        // si onglet commentaires
        await this.$api.inspections.ajouterCommentaireGeneral(this.inspection.id, {
          text: messageText,
          attachments: this.attachments
        })
      } else {
        // si dans un échange
        await this.$api.inspections.ajouterMessage(this.echangeId, {
          text: messageText,
          attachments: this.attachments,
          confidential: confidential
        })
      }
      this.newMessage = ''
      this.attachments = []
      this.dialogNewMessage = false
    },
    publier () {
      if (this.$permissions.isInspecteur) this.brouillon = !this.brouillon
    },
    /*
    Exemple attachment = {
      lastModified: 1544625348298
      lastModifiedDate: Wed Dec 12 2018 15:35:48 GMT+0100 (heure normale d’Europe centrale) {}
      name: "20180921-LettreAnnonceAMFQSE.odt"
      size: 66194
      type: "application/vnd.oasis.opendocument.text"
      webkitRelativePath: ""
    }
    */
    addAttachment (...files) {
      files.forEach((file, index) => {
        this.attachments.push({
          id: new Date().getTime() + index,
          filename: file.name,
          type: file.type,
          url: URL.createObjectURL(file)
        })
      })
    },
    onFilesChange (e) {
      const files = e.target.files || e.dataTransfer.files
      if (!files.length) {
        return
      }
      this.addAttachment(...files)
      e.target.value = ''
    }
  }
}
</script>
