<template lang="pug">
v-dialog(v-model="showDialog" attach max-width="350")
  v-card
    v-card-title.headline Confirmation
    v-divider
    v-card-text.subheading(v-html="message")
    v-card-actions
      v-spacer
      v-btn(color="primary" @click="confirm") Confirmer
      v-btn(@click="cancel") Annuler
</template>

<script>
export default {
  name: 'FhConfirmDialog',
  props: {
    message: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      showDialog: false
    }
  },
  created () {
    this.$on('confirm', message => {
      this.message = message
      this.showDialog = true
    })
  },
  methods: {
    confirm () {
      this.$emit('confirmed', true)
      this.showDialog = false
    },
    cancel () {
      this.$emit('confirmed', false)
      this.showDialog = false
    }
  }
}
</script>
