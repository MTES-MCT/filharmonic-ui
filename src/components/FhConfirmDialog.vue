<template lang="pug">
v-dialog(v-model="showDialog" attach max-width="350")
  v-card
    v-card-title.headline Confirmation
    v-divider
    v-card-text.subheading(v-html="message")
    v-card-actions
      v-spacer
      v-btn(color="primary" @click="confirm" :loading="loading" :disabled="loading") Confirmer
      v-btn(@click="cancel" :disabled="loading") Annuler
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
      loading: false,
      showDialog: false
    }
  },
  created () {
    this.$on('confirm', (message, actionFn) => {
      this.message = message
      this.actionFn = actionFn
      this.showDialog = true
    })
  },
  methods: {
    async confirm () {
      this.loading = true
      try {
        await this.actionFn()
        this.$emit('confirmed', true)
        this.showDialog = false
      } finally {
        this.loading = false
      }
    },
    cancel () {
      this.$emit('confirmed', false)
      this.showDialog = false
    }
  }
}
</script>
