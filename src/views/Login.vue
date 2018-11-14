<template lang="pug">
v-container
  v-layout.text-xs-center.wrap
    v-flex.mb-4
      form(@submit.prevent="login()")
        h1.mb-3 Connexion
        p TODO connexion Cerbère / France Connect
        v-btn(type="submit") Se connecter
    v-flex.xs12
      v-btn(to="/" flat small) Retourner à la page d'accueil
</template>

<script>
export default {
  methods: {
    login () {
      console.log('TODO login')
    }
  }
}
</script>
