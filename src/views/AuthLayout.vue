<template lang="pug">
v-app
  v-navigation-drawer(app permanent)
    v-toolbar(flat)
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

    v-list
      v-list-tile(to="/dashboard" title="Tableau de bord")
        v-list-tile-action
          v-icon dashboard
        v-list-tile-content
          v-list-tile-title Tableau de bord

      v-list-group(value="true")
        v-list-tile(slot="activator" title="Visites récentes")
          v-list-tile-action
            v-icon star
          v-list-tile-content
            v-list-tile-title Visites récentes
        v-list(dense)
          v-list-tile(to="/visites/1" title="Visite A")
            v-list-tile-action
            v-list-tile-content
              v-list-tile-title Visite A
          v-list-tile(to="/visites/2" title="Visite B")
            v-list-tile-action
            v-list-tile-content
              v-list-tile-title Visite B
          v-list-tile(to="/visites/3" title="Visite C")
            v-list-tile-action
            v-list-tile-content
              v-list-tile-title Visite C

      v-list-tile(to="/visites" title="Visites")
        v-list-tile-action
          v-icon search
        v-list-tile-content
          v-list-tile-title Visites
      v-list-tile(to="/installations" title="Installations")
        v-list-tile-action
          v-icon location_city
        v-list-tile-content
          v-list-tile-title Installations

    v-list(subheader)
      v-subheader Autres outils
      v-list-tile(href="https://monicpe.developpement-durable.gouv.fr/" target="_blank" title="MonICPE")
        v-list-tile-content
          v-list-tile-title
            span.mr-2 MonICPE
            v-icon open_in_new
      v-list-tile(href="http://www.installationsclassees.developpement-durable.gouv.fr/rechercheICForm.php" target="_blank" title="Base des installations classées")
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
