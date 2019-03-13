<template lang="pug">
div
  v-snackbar(v-model="showSnackbar" bottom :color="snackbar.color" :timeout="4000")
    | {{ snackbar.message }}
    v-btn(icon @click="showSnackbar = false")
      v-icon close
  router-view
</template>

<script>
import events from '@/events'

const snackbarColor = {
  error: 'red',
  success: 'green',
  info: 'primary'
}

export default {
  name: 'App',
  data () {
    return {
      showSnackbar: false,
      snackbar: {
        message: '',
        color: ''
      }
    }
  },
  async created () {
    events.bus.$on(events.Alert, this.updateAlert)
  },
  destroyed () {
    events.bus.$off(events.Alert, this.updateAlert)
  },
  methods: {
    updateAlert (messageType, message) {
      this.snackbar.color = snackbarColor[messageType]
      this.snackbar.message = message
      this.showSnackbar = true
    }
  }
}
</script>
