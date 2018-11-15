<template lang="pug">
v-app
  v-content
    v-container.fluid.fill-height
      v-layout.align-center.justify-center.wrap
        v-flex.xs12.sm8.md4.text-xs-center
          v-form(@submit.prevent="login()")
            v-card.elevation-12
              v-card-text
                h1.mb-3 Connexion à Fil'Harmonic
                p TODO connexion Cerbère / France Connect
              v-card-actions
                v-btn(block type="submit") Se connecter

          v-btn.mt-4(to="/" flat small) Retourner à la page d'accueil
</template>

<script>
export default {
  methods: {
    login () {
      console.log('TODO login')
      this.$router.push('/dashboard')
    }
  }
}
</script>
