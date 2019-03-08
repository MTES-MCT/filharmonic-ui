<template lang="pug">
v-app(v-if="user")
  v-navigation-drawer(:clipped="$vuetify.breakpoint.lgAndUp" v-model="drawer" fixed app)

    v-list.py-0
      v-list-tile(to="/" title="Tableau de bord")
        v-list-tile-action
          v-icon dashboard
        v-list-tile-content
          v-list-tile-title Tableau de bord

      v-list-tile(to="/etablissements" title="Etablissements" v-if="!$permissions.isExploitant")
        v-list-tile-action
          v-icon location_city
        v-list-tile-content
          v-list-tile-title Etablissements
      v-list-tile(to="/themes" title="Thèmes" v-if="$permissions.isApprobateur")
        v-list-tile-action
          v-icon bookmarks
        v-list-tile-content
          v-list-tile-title Thèmes

      v-list-group(value="true" v-if="!$permissions.isExploitant")
        v-list-tile(slot="activator" title="Inspections favorites")
          v-list-tile-action
            v-icon star
          v-list-tile-content
            v-list-tile-title
              | Inspections favorites
              span.grey--text.ml-1 ({{ favoris.length }})
        v-list.py-0.grey.lighten-2(dense)
          v-list-tile(v-for="inspection in favoris" :key="inspection.id"
                      :to="`/inspections/${inspection.id}`"
                      :title="`${inspection.date} - ${inspection.etablissement.nom}, ${inspection.etablissement.adresse}`"
                      )
            v-list-tile-content
              v-list-tile-title
                | {{ inspection.date }}
                strong.ml-2 {{ inspection.etablissement.nom }}
                | ,&nbsp;
                i {{ inspection.etablissement.adresse }}

  v-toolbar(:clipped-left="$vuetify.breakpoint.lgAndUp" color="blue darken-3" dark app fixed)
    v-toolbar-side-icon(@click.stop="drawer = !drawer")
    v-toolbar-title.ml-0.pl-3(style="width: 300px")
      span(class="hidden-sm-and-down") Fil'Harmonic

    v-spacer

    v-menu(transition="slide-y-transition" bottom left offset-y)
      v-btn(icon slot="activator")
        v-icon apps
      v-list(v-for="app in apps", :key="app.nom")
        v-list-tile(:href="app.url" target="_blank" :title="app.nom")
          v-icon open_in_new
          v-list-tile-title {{ app.nom }}

    v-menu(:close-on-content-click="false" bottom left offset-y v-model="showNotificationsMenu")
      v-btn(slot="activator" v-if="notifications.length > 0" icon :title="`${notifications.length} nouvelle(s) notification(s)`")
        v-icon(color="red") notifications
      v-btn(slot="activator" v-else icon title="Aucune nouvelle notification")
        v-icon notifications
      v-card
        v-subheader
          | Notifications
          v-btn.ml-5(@click="toutMarquerCommeLues()" small outline color="primary" :disabled="notifications.length === 0") Tout marquer comme lu
        v-divider
        .fh-notifications-menu
          fh-notification(v-for="notification in notifications" :key="notification.id"
                          :notification="notification"
                          @marquer-comme-lue="marquerCommeLue(notification.id)"
                          @open-inspection="showNotificationsMenu = false"
                          )

    v-menu(
      :close-on-content-click="false"
      :nudge-width="200"
      bottom left offset-y)
      v-btn(icon slot="activator" title="Mon compte")
        v-icon person
      v-card
        v-list
          v-list-tile(avatar)
            v-list-tile-content
              v-list-tile-title {{ user.prenom }} {{ user.nom }}
              v-list-tile-sub-title {{ user.profile | capitalize }}
        v-divider
        v-card-actions
          v-btn(@click="logout(false)" color="primary") Déconnexion
          v-btn(v-if="$api.devMode" @click="logout(true)" color="primary") Déconnexion SSO

  v-content
    router-view
</template>

<script>
import { mapState } from 'vuex'
import FhNotification from '@/components/FhNotification.vue'

export default {
  components: {
    FhNotification
  },
  data () {
    return {
      dialog: false,
      drawer: null,
      apps: [
        { url: 'https://monicpe.developpement-durable.gouv.fr/', nom: 'MonICPE' },
        { url: 'http://www.installationsclassees.developpement-durable.gouv.fr/rechercheICForm.php', nom: 'Base des installations classées' }
      ],
      showNotificationsMenu: false
    }
  },
  computed: {
    ...mapState({
      user: state => state.authentication.user,
      favoris: state => state.inspectionsFavorites,
      notifications: state => state.notifications
    })
  },
  async created () {
    this.$api.notifications.loadNotifications()
    this.$api.inspections.refreshInspectionsFavorites()
  },
  methods: {
    async logout (cerbereLogout) {
      await this.$api.authentication.logout(cerbereLogout)
      this.$router.push('/login?redirect=/')
    },
    async marquerCommeLue (notificationId) {
      await this.$api.notifications.lire([notificationId])
    },
    async toutMarquerCommeLues () {
      await this.$api.notifications.lire(this.notifications.map(notification => notification.id))
    }
  }
}
</script>

<style lang="stylus">
.fh-notifications-menu
  max-height 300px
  overflow-y auto
  padding 0
</style>
