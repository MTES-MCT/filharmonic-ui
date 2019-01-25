<template lang="pug">
v-app
  v-content
    v-container.fluid.fill-height
      v-layout.align-center.justify-center.wrap
        v-flex.xs12.sm8.md4.text-xs-center
            v-card.elevation-12
              v-toolbar(dark color="primary")
                v-toolbar-title Fil'Harmonic
              v-card-text
                v-btn(:href="cerbereCallback" color="primary")
                  | Connexion via le portail Cerbère
                .red--text.my-3(v-if="error") {{ error }}

</template>

<script>
export default {
  data () {
    return {
      error: ''
    }
  },
  computed: {
    cerbereCallback () {
      return `https://authentification.din.developpement-durable.gouv.fr/cas/public/login?service=${location.origin}/login`
    }
  },
  async created () {
    const params = new URLSearchParams(window.location.search)
    const ticket = params.get('ticket')
    if (ticket) {
      await this.$api.authentication.login(ticket)
      this.$router.push('/')
    }
  }
}
</script>
