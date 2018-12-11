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
                | Utilisateurs de test disponibles
                v-btn(v-for="user in users" :key="user.id"
                      @click="login(user.id)"
                      small color="accent"
                      ) {{ user.name }} ({{ user.type }})
                v-form
                  v-text-field(
                    v-model="id"
                    prepend-icon="person"
                    name="id"
                    label="Identifiant"
                    required)
                  v-text-field(
                    v-model="password"
                    prepend-icon="lock"
                    :type="revealPassword ? 'text' : 'password'"
                    :append-icon="revealPassword ? 'visibility_off' : 'visibility'"
                    @click:append="revealPassword = !revealPassword"
                    name="password"
                    label="Mot de passe"
                    required)

                  .red--text.my-3(v-if="authenticationError") {{ authenticationError }}

                  v-card-actions
                    v-btn(@click="login(id, password)" color="primary") Se connecter
                    v-btn(to="/") Annuler
</template>

<script>
export default {
  data () {
    return {
      id: '',
      password: '',
      revealPassword: false,
      authenticationError: false,

      // mock
      users: []
    }
  },
  async created () {
    this.users = await this.$api.users.list()
  },
  methods: {
    async login (id, password) {
      this.authenticationError = ''
      const authenticationInfos = await this.$store.dispatch('login', {
        user: id,
        password: password
      })
      if (authenticationInfos.valid) {
        this.$router.push(this.$route.query.redirect || '/')
      } else {
        this.authenticationError = "L'authentification a échoué."
      }
    }
  }
}
</script>
