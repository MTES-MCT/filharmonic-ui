<template lang="pug">
v-app
  v-navigation-drawer(:clipped="$vuetify.breakpoint.lgAndUp" v-model="drawer" fixed app)

    v-list.py-0
      v-list-tile(to="/" title="Tableau de bord")
        v-list-tile-action
          v-icon dashboard
        v-list-tile-content
          v-list-tile-title Tableau de bord

      v-list-group(value="true")
        v-list-tile(slot="activator" title="Contrôles favoris")
          v-list-tile-action
            v-icon star
          v-list-tile-content
            v-list-tile-title Contrôles favoris
        v-list.py-0.grey.lighten-2(dense)
          v-list-tile(v-for="controle in controlesOuverts" :key="controle.id"
                      :to="`/controles/${controle.id}`"
                      :title="`${controle.date} - ${controle.etablissement.nom}`"
                      )
            v-list-tile-content
              v-list-tile-title
                | {{ controle.date }}
                strong.ml-2 {{ controle.etablissement.nom }}
                | ,&nbsp;
                i {{ controle.etablissement.adresse }}

      v-list-tile(to="/controles" title="Contrôles")
        v-list-tile-action
          v-icon search
        v-list-tile-content
          v-list-tile-title Contrôles
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
      offset-x)
      v-btn(icon slot="activator")
        v-icon person
      v-card
        v-list
          v-list-tile(avatar)
            v-list-tile-avatar
              img(:src="user.avatar" :alt="user.nom")
            v-list-tile-content
              v-list-tile-title {{ user.nom }}
              v-list-tile-sub-title {{ user.profil | capitalize }}
      v-card-actions
        v-btn(@click="logout()" color="primary") Déconnexion

  v-content
    router-view
</template>

<script>
import { mapState } from 'vuex'

export default {
  data () {
    return {
      dialog: false,
      drawer: null,
      apps: [
        { url: 'https://monicpe.developpement-durable.gouv.fr/', nom: 'MonICPE' },
        { url: 'http://www.installationsclassees.developpement-durable.gouv.fr/rechercheICForm.php', nom: 'Base des installations classées' }
      ]
    }
  },
  computed: {
    ...mapState({
      user: state => state.authentication.user,
      controlesOuverts: 'controlesOuverts'
    })
  },
  async created () {
    await this.$store.dispatch('loadControlesOuverts')
  },
  methods: {
    async logout () {
      await this.$store.dispatch('logout')
      this.$router.push('/login?redirect=/')
    }
  }
}
</script>
