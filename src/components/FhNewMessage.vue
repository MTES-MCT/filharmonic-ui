<template lang="pug">
v-dialog(v-model="dialogNewMessage" width="500")
  v-btn(slot="activator" title="Nouveau message" color="primary")
    v-icon(left) add
    | Nouveau {{ nomMessage }}
  v-card
    v-toolbar(dark color="primary")
      v-toolbar-title(class="white--text") Nouveau {{ nomMessage }}
      v-spacer
      v-btn(icon @click="dialogNewMessage = false" title="Fermer")
        v-icon close
    v-divider
    v-card-text
      v-textarea(box label="Message" v-model="newMessage" auto-grow hideDetails rows="1" clearable)
      v-checkbox(v-model="interne" label="Interne" v-if="!commentaire && !$permissions.isExploitant")
    fh-attachment(v-for="(attachment, index) in pieces_jointes" :key="index" :attachment="attachment")
    v-divider
    v-card-actions
      v-spacer
      v-btn(icon title="Ajouter une pièce jointe" @click="openAttachmentPopup")
        v-icon attach_file
      input(ref="file" type="file" @change="onFilesChange" multiple hidden)
      v-btn(icon @click="addMessage" :disabled="!newMessage" color="primary" title="Envoyer")
        v-icon send
</template>

<script>
import FhAttachment from '@/components/FhAttachment.vue'

export default {
  name: 'FhNewMessage',
  components: {
    FhAttachment
  },
  props: {
    commentaire: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      newMessage: '',
      interne: true,
      pieces_jointes: [],
      dialogNewMessage: false
    }
  },
  computed: {
    nomMessage () {
      return this.commentaire ? 'commentaire' : 'message'
    }
  },
  methods: {
    openAttachmentPopup () {
      this.$refs.file.click()
    },
    async addMessage () {
      this.$emit('new-message', {
        message: this.newMessage,
        pieces_jointes: this.pieces_jointes,
        interne: this.interne
      })
      this.newMessage = ''
      this.pieces_jointes = []
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
      files.forEach(async (file, index) => {
        const pieceJointeId = await this.$api.inspections.ajouterPieceJointe({
          file: file,
          filename: file.name,
          type: file.type,
          size: file.size
        })
        this.pieces_jointes.push({
          id: pieceJointeId,
          nom: file.name,
          type: file.type,
          taille: file.size
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
