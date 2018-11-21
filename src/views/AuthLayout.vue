<template lang="pug">
v-app
  v-navigation-drawer(app permanent)
    v-toolbar.grey.lighten-1(flat)
      v-list
        v-list-tile
          v-list-tile-title.title Fil'Harmonic
    v-toolbar.transparent(flat)
      v-list
        v-list-tile(avatar)
          v-list-tile-avatar
            img(src="https://randomuser.me/api/portraits/men/85.jpg")
          v-list-tile-content
            v-list-tile-title Alain Champion
        v-divider

    v-list.py-0
      v-list-tile(to="/dashboard" title="Tableau de bord")
        v-list-tile-action
          v-icon dashboard
        v-list-tile-content
          v-list-tile-title Tableau de bord

      v-list-group(value="true")
        v-list-tile(slot="activator" title="Contrôles récentes")
          v-list-tile-action
            v-icon star
          v-list-tile-content
            v-list-tile-title Contrôles récents
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

    v-list(subheader)
      v-subheader Autres outils
      v-list-tile(href="https://monicpe.developpement-durable.gouv.fr/" target="_blank" title="MonICPE")
        v-list-tile-content
          v-list-tile-title
            span.mr-2 MonICPE
            v-icon open_in_new
      v-list-tile(href="http://www.installationsclassees.developpement-durable.gouv.fr/rechercheICForm.php" target="_blank" title="Base des etablissements classées")
        v-list-tile-content
          v-list-tile-title
            span.mr-2 Base des installations classées
            v-icon open_in_new

  v-content
    router-view
</template>

<script>
export default {
  data () {
    return {
    }
  },
  methods: {
  }
}
</script>
