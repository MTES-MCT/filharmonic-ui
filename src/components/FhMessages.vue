<template lang="pug">
v-card
  v-toolbar(flat dense)
    v-toolbar-title.subheading Messages
    v-dialog(v-model="dialogNewMessage" v-if="peutAjouterMessage" width="500")
      v-btn(small icon slot="activator" title="Nouveau message" color="primary")
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
          v-checkbox(v-model="interne" label="Interne" v-if="pointDeControleId > 0 && !$permissions.isExploitant")

        fh-attachment(v-for="(attachment, index) in attachments" :key="index" :attachment="attachment")

        v-divider
        v-card-actions
          v-spacer
          v-btn(icon title="Ajouter une pièce jointe" @click="openAttachmentPopup")
            v-icon attach_file
          input(ref="file" type="file" @change="onFilesChange" multiple hidden)
          v-btn(icon @click="addMessage" :disabled="!newMessage" color="primary" title="Envoyer")
            v-icon send

  v-card-text
    v-timeline
      fh-message(v-for="message in messages" :key="message.id" :message="message")
</template>

<script>
import FhAttachment from '@/components/FhAttachment.vue'
import FhMessage from '@/components/FhMessage.vue'
import { isBeforeState } from '@/api/inspections'
import { mapState } from 'vuex'

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
    pointDeControleId: {
      type: Number,
      required: false,
      default: -1
    }
  },
  data () {
    return {
      newMessage: '',
      interne: true,
      attachments: [],
      dialogNewMessage: false
    }
  },
  computed: {
    ...mapState({
      inspection: 'inspectionOuverte'
    }),
    commentairesGeneraux () {
      return this.pointDeControleId === -1
    },
    peutAjouterMessage () {
      return this.commentairesGeneraux || isBeforeState(this.etatInspection, 'attente_validation')
    }
  },
  methods: {
    openAttachmentPopup () {
      this.$refs.file.click()
    },
    async addMessage () {
      if (this.pointDeControleId === -1) {
        // si onglet commentaires
        await this.$api.inspections.ajouterCommentaireGeneral(this.inspection.id, {
          text: this.newMessage,
          attachments: this.attachments
        })
      } else {
        // si dans un point de contrôle
        await this.$api.inspections.ajouterMessage(this.pointDeControleId, {
          text: this.newMessage,
          attachments: this.attachments,
          interne: this.interne
        })
      }
      this.newMessage = ''
      this.attachments = []
      this.dialogNewMessage = false
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
