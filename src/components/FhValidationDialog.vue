<template lang="pug">
fh-dialog(:show-dialog="showDialog" title="Validation" @close="$emit('close')")
  v-card-text.text-xs-center
    p Veuillez téléverser le rapport signé au format PDF.
    p(v-if="rapport") Rapport : {{ this.rapport.name }}
    v-btn(large title="Téléverser le rapport" @click="openAttachmentPopup")
      v-icon(x-large) cloud_upload
    input(ref="file" type="file" @change="onFilesChange" hidden)
  v-divider
  v-card-actions
    v-spacer
    fh-btn(:action="submit" :disableif="!rapport" color="primary" title="Valider")
      v-icon(left) done
      | Valider
</template>

<script>
import FhBtn from '@/components/FhBtn.vue'
import FhDialog from '@/components/FhDialog.vue'

export default {
  name: 'FhValidationDialog',
  components: {
    FhBtn,
    FhDialog
  },
  props: {
    showDialog: {
      type: Boolean,
      required: true
    },
    action: {
      type: Function,
      required: true
    }
  },
  data () {
    return {
      rapport: null
    }
  },
  watch: {
    async showDialog (value) {
      if (value) {
        this.rapport = null
      }
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
    async submit () {
      try {
        await this.action(this.rapport)
        this.$emit('close')
      } finally {
      }
    }
  }
}
</script>
