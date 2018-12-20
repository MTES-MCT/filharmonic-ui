<template lang="pug">
v-app
  v-snackbar(v-model="showSnackbar" top :color="snackbar.color" :timeout="4000")
    | {{ snackbar.message }}
    v-btn(icon @click="showSnackbar = false")
      v-icon close
  v-navigation-drawer(:clipped="$vuetify.breakpoint.lgAndUp" v-model="drawer" fixed app)

    v-list.py-0
      v-list-tile(to="/" title="Tableau de bord")
        v-list-tile-action
          v-icon dashboard
        v-list-tile-content
          v-list-tile-title Tableau de bord

      v-list-group(value="true")
        v-list-tile(slot="activator" title="Inspections favoris")
          v-list-tile-action
            v-icon star
          v-list-tile-content
            v-list-tile-title Inspections favorites
        v-list.py-0.grey.lighten-2(dense)
          v-list-tile(v-for="favori in favoris" :key="favori.id"
                      :to="`/inspections/${favori.id}`"
                      :title="`${favori.date} - ${favori.etablissement.nom}`"
                      )
            v-list-tile-content
              v-list-tile-title
                | {{ favori.date }}
                strong.ml-2 {{ favori.etablissement.nom }}
                | ,&nbsp;
                i {{ favori.etablissement.adresse }}

      v-list-tile(to="/inspections" exact title="Inspections")
        v-list-tile-action
          v-icon search
        v-list-tile-content
          v-list-tile-title Inspections
      v-list-tile(to="/etablissements" title="Etablissements")
        v-list-tile-action
          v-icon location_city
        v-list-tile-content
          v-list-tile-title Etablissements

  v-toolbar(:clipped-left="$vuetify.breakpoint.lgAndUp" color="blue darken-3" dark app fixed)
    v-toolbar-side-icon(@click.stop="drawer = !drawer")
    v-toolbar-title(style="width: 300px" class="ml-0 pl-3")
      span(class="hidden-sm-and-down") Fil'Harmonic
    v-spacer
    v-menu(transition="slide-y-transition" bottom)
      v-btn(icon slot="activator")
        v-icon apps
      v-list(v-for="app in apps", :key="app.nom")
        v-list-tile(:href="app.url" target="_blank" :title="app.nom")
          v-icon open_in_new
          v-list-tile-title {{ app.nom }}
    v-btn(icon)
      v-icon notifications
    v-menu(
      :close-on-content-click="false"
      :nudge-width="200"
      offset-x offset-y)
      v-btn(icon slot="activator")
        v-icon person
      v-card
        v-list
          v-list-tile(avatar)
            v-list-tile-avatar
              img(:src="user.photoURL" :alt="user.name")
            v-list-tile-content
              v-list-tile-title {{ user.name }}
              v-list-tile-sub-title {{ user.type | capitalize }}
        v-divider
        v-card-actions
          v-btn(@click="logout()" color="primary") Déconnexion

  v-content
    router-view(@alert='updateAlert')
</template>

<script>
import events from '@/events'
import { createNamespacedHelpers } from 'vuex'
import { LIST } from '@/store/action-types'
const { mapState: mapFavorisState, mapActions: mapFavorisActions } = createNamespacedHelpers('favori')
const { mapState: mapAuthenticationState, mapActions: mapAuthenticationActions } = createNamespacedHelpers('authentication')

const snackbarColor = {
  error: 'red',
  success: 'green'
}

export default {
  data () {
    return {
      dialog: false,
      drawer: null,
      apps: [
        { url: 'https://monicpe.developpement-durable.gouv.fr/', nom: 'MonICPE' },
        { url: 'http://www.installationsclassees.developpement-durable.gouv.fr/rechercheICForm.php', nom: 'Base des installations classées' }
      ],
      showSnackbar: false,
      snackbar: {
        message: '',
        color: ''
      }
    }
  },
  computed: {
    ...mapFavorisState({
      favoris: 'rows'
    }),
    ...mapAuthenticationState({
      user: state => state.rows[0].user
    })
  },
  async created () {
    events.bus.$on(events.Alert, this.updateAlert)
    await this.listFavoris(this.user.id)
  },
  destroyed () {
    events.bus.$off(events.Alert, this.updateAlert)
  },
  methods: {
    ...mapFavorisActions({
      listFavoris: LIST
    }),
    ...mapAuthenticationActions({
      authLogout: 'logout'
    }),
    logout () {
      this.authLogout()
      this.$router.push('/login?redirect=/')
    },
    updateAlert (messageType, message) {
      this.snackbar.color = snackbarColor[messageType]
      this.snackbar.message = message
      this.showSnackbar = true
    }
  }
}
</script>
