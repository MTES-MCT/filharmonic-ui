<template lang="pug">
fh-dialog(:show-dialog="showDialog" title="Rejet" @close="$emit('close')")
  v-card-text.text-xs-center
    p Veuillez saisir un motif de rejet.
    v-textarea(box v-model="motifRejet" label="Motif")
  v-divider
  v-card-actions
    v-spacer
    fh-btn(:action="submit" color="primary" title="Rejeter")
      v-icon(left) done
      | Rejeter
</template>

<script>
import FhBtn from '@/components/FhBtn.vue'
import FhDialog from '@/components/FhDialog.vue'

export default {
  name: 'FhRejetValidationDialog',
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
      motifRejet: ''
    }
  },
  watch: {
    async showDialog (value) {
      if (value) {
        this.motifRejet = ''
      }
    }
  },
  methods: {
    async submit () {
      try {
        await this.action(this.motifRejet)
        this.$emit('close')
      } finally {
      }
    }
  }
}
</script>
