<template lang="pug">
v-app
  v-navigation-drawer(:clipped="$vuetify.breakpoint.lgAndUp" v-model="drawer" fixed app)

    v-list.py-0
      v-list-tile(to="/dashboard" title="Tableau de bord")
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
          v-list-tile(to="/controles/1" title="Contrôle A")
            v-list-tile-action
            v-list-tile-content
              v-list-tile-title Contrôle A
          v-list-tile(to="/controles/2" title="Contrôle B")
            v-list-tile-action
            v-list-tile-content
              v-list-tile-title Contrôle B
          v-list-tile(to="/controles/3" title="Contrôle C")
            v-list-tile-action
            v-list-tile-content
              v-list-tile-title Contrôle C

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
      v-list
        v-list-tile(href="https://monicpe.developpement-durable.gouv.fr/" target="_blank" title="MonICPE")
          v-icon open_in_new
          v-list-tile-title MonICPE
        v-list-tile(href="http://www.installationsclassees.developpement-durable.gouv.fr/rechercheICForm.php" target="_blank" title="Base des etablissements classées")
          v-icon open_in_new
          v-list-tile-title Base des installations classées
    v-btn(icon)
      v-icon notifications
    v-menu(
      v-model="menu"
      :close-on-content-click="false"
      :nudge-width="200"
      offset-x)
      v-btn(icon slot="activator")
        v-icon person
      v-card
        v-list
          v-list-tile(avatar)
            v-list-tile-avatar
              img(src="https://randomuser.me/api/portraits/men/85.jpg" alt="Alain Champion")
            v-list-tile-content
              v-list-tile-title Alain Champion
              v-list-tile-sub-title Inspecteur
      v-card-actions
        v-btn(to="/" color="primary") Déconnexion

  v-content
    router-view
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      dialog: false,
      drawer: null,
      menu: true
    }
  },
  computed: {
    ...mapGetters([
      'user'
    ])
  },
  methods: {
  }
}
</script>
