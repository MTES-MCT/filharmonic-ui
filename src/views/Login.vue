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
                v-form(@submit.prevent="login()")
                  v-text-field(
                    prepend-icon="person"
                    name="login"
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
                    v-btn(type="submit" color="primary") Se connecter
                    v-btn(to="/") Annuler
</template>

<script>
export default {
  data () {
    return {
      show: false,
      password: 'Mot de passe',
      rules: {
        required: value => !!value || 'Requis.',
        min: v => v.length >= 8 || 'Min 8 caractères',
        emailMatch: () => ('Le login et le mot de passe ne correspondent pas.')
      }
    }
  },
  methods: {
    login () {
      console.log('TODO login')
      this.$router.push('/dashboard')
    }
  }
}
</script>
