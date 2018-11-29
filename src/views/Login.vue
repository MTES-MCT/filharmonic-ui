<template lang="pug">
v-app
  v-content
    p.display-1.mt-4.text-xs-center(v-if="errorNotFound") L'authentification a échoué.
    v-container.fluid.fill-height(v-if="!errorNotFound")
      v-layout.align-center.justify-center.wrap
        v-flex.xs12.sm8.md4.text-xs-center
            v-card.elevation-12
              v-toolbar(dark color="primary")
                v-toolbar-title Fil'Harmonic
              v-card-text
                v-form
                  v-text-field(
                    prepend-icon="person"
                    name="id"
                    label="Identifiant"
                    required)
                  v-text-field(
                    prepend-icon="lock"
                    :append-icon="show ? 'visibility_off' : 'visibility'"
                    :type="show ? 'text' : 'password'"
                    @click:append="show = !show"
                    name="password"
                    label="Mot de passe"
                    required)
                  v-card-actions
                    v-btn(@click="login(id,password)" color="primary") Se connecter
                    v-btn(to="/") Annuler
</template>

<script>
export default {
  data () {
    return {
      show: false,
      id: '',
      password: 'Mot de passe',
      rules: {
        required: value => !!value || 'Requis.',
        min: v => v.length >= 8 || 'Min 8 caractères',
        emailMatch: () => ('Le login et le mot de passe ne correspondent pas.')
      },
      errorNotFound: false
    }
  },
  methods: {
    async login (id, password) {
      const authenticationInfos = await this.$store.dispatch('login', {
        user: id,
        password: password
      })
      console.log(authenticationInfos)
      if (authenticationInfos.valid) {
        console.log('redirect=' + this.$route.query.redirect)
        this.$router.push(this.$route.query.redirect || '/')
      } else {
        this.errorNotFound = true
      }
      // } else {
      //   this.errorNotFound = true
      // }
    }
  }
}
</script>
