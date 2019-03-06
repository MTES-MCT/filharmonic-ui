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
                | Si vous ne disposez pas de compte Cerbère, vous devez&nbsp;
                a(:href="lienCreationCompteCerbere") créer un compte
                  v-icon.ml-1(small color="blue") open_in_new
                | &nbsp;pour utiliser cette application.

          .mt-5(v-if="devMode")
            v-btn(href="/login?ticket=ticket-1" color="red") Michel Exploitant1 (1)
            v-btn(href="/login?ticket=ticket-2" color="red") Bernard Exploitant2 (2)
            v-btn(href="/login?ticket=ticket-3" color="blue") Alain Champion (3)
            v-btn(href="/login?ticket=ticket-4" color="blue") Corine Dupont (4)
            v-btn(href="/login?ticket=ticket-5" color="blue") Bernard Mars (5)
            v-btn(href="/login?ticket=ticket-6" color="green") Albert Approbe (6)
            v-btn(href="/login?ticket=ticket-7" color="green") Gilbert Approbe (7)
            v-btn(href="/login?ticket=ticket-8" color="blue") Hubert Inspecte (8)
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
    devMode () {
      return process.env.NODE_ENV === 'development'
    },
    redirectURL () {
      return new URLSearchParams(window.location.search).get('redirect')
    },
    cerbereCallback () {
      let callbackURL = `https://authentification.din.developpement-durable.gouv.fr/cas/public/login?service=${location.origin}/login`
      if (this.redirectURL) {
        callbackURL += `%3Fredirect=${this.redirectURL}`
      }
      return callbackURL
    }
  },
  async created () {
    const params = new URLSearchParams(window.location.search)
    const ticket = params.get('ticket')
    const redirectURL = params.get('redirect')
    if (ticket) {
      try {
        await this.$api.authentication.login(ticket)
        this.$router.push(redirectURL || '/')
      } catch (e) {
        this.error = `L'authentification a échoué. ${e.message}`
      }
    }
  }
}
</script>
