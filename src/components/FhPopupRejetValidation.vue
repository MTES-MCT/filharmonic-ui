<template lang="pug">
v-dialog(v-model="showDialog" width="500")
  v-btn(slot="activator" title="Rejeter la demande de validation" color="red")
    v-icon(left) close
    | Rejeter
  v-card
    v-toolbar(dark color="primary")
      v-toolbar-title(class="white--text") Rejet
      v-spacer
      v-btn(icon @click="showDialog = false" title="Fermer")
        v-icon close
    v-divider
    v-card-text.text-xs-center
      p Veuillez saisir un motif de rejet.
      v-textarea(box v-model="motifRejet" label="Motif")
    v-divider
    v-card-actions
      v-spacer
      v-btn(@click="submit" color="primary" title="Rejeter" :loading="loading" :disabled="loading")
        v-icon(left) done
        | Rejeter
</template>

<script>
export default {
  name: 'FhPopupRejetValidation',
  data () {
    return {
      showDialog: false,
      loading: false,
      motifRejet: ''
    }
  },
  methods: {
    submit () {
      this.loading = true
      this.$emit('submit', {
        data: this.motifRejet,
        done: (closeDialog = false) => {
          this.loading = false
          if (closeDialog) {
            this.showDialog = false
          }
        }
      })
    }
  }
}
</script>
