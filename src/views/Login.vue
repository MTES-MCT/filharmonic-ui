<template lang="pug">
v-app
  v-content
    v-container.fluid.fill-height
      v-layout.align-center.justify-center.wrap
        v-flex.xs12.sm11.md8.lg6.text-xs-center
            v-card.elevation-12
              v-toolbar(dark color="primary")
                v-toolbar-title.flex.display-1 Fil'Harmonic
              v-card-text
                .subheading Utilisez votre compte Cerbère pour vous connecter à Fil'Harmonic.

                v-btn.mt-3(:href="cerbereCallback" color="primary") Connexion via le portail Cerbère
                .red--text.mt-3(v-if="error") {{ error }}

                .mt-3
                  | Si vous ne disposez pas de compte Cerbère, vous pouvez&nbsp;
                  a(:href="lienCreationCompteCerbere") créer un compte Cerbère
                    v-icon.ml-1(small color="blue") open_in_new
                  | .

</template>

<script>
export default {
  data () {
    return {
      lienCreationCompteCerbere: 'https://authentification.din.developpement-durable.gouv.fr/authSAML/moncompte/creation/demande.do',
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
      try {
        await this.$api.authentication.login(ticket)
        this.$router.push('/')
      } catch (e) {
        this.error = `L'authentification a échoué. ${e.message}`
      }
    }
  }
}
</script>
