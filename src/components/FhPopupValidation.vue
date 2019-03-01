<template lang="pug">
v-dialog(v-model="showDialog" width="500")
  v-btn(slot="activator" title="Accepter la demande de validation" color="green")
    v-icon(left) done
    | Valider
  v-card
    v-toolbar(dark color="primary")
      v-toolbar-title(class="white--text") Validation
      v-spacer
      v-btn(icon @click="showDialog = false" title="Fermer")
        v-icon close
    v-divider
    v-card-text.text-xs-center
      p Veuillez téléverser le rapport signé au format PDF.
      p(v-if="rapport") Rapport : {{ this.rapport.name }}
      v-btn(large title="Téléverser le rapport" @click="openAttachmentPopup")
        v-icon(x-large) cloud_upload
      input(ref="file" type="file" @change="onFilesChange" hidden)
    v-divider
    v-card-actions
      v-spacer
      v-btn(@click="valider()" :disabled="!rapport" color="primary" title="Valider")
        v-icon(left) done
        | Valider
</template>

<script>

export default {
  name: 'FhPopupValidation',
  data () {
    return {
      showDialog: false,
      rapport: null
    }
  },
  methods: {
    openAttachmentPopup () {
      this.$refs.file.click()
    },
    onFilesChange (e) {
      const files = e.target.files || e.dataTransfer.files
      if (!files.length) {
        return
      }
      this.rapport = files[0]
      e.target.value = ''
    },
    valider () {
      this.$emit('validate', this.rapport)
    }
  }
}
</script>
