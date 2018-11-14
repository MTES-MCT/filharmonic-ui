<template lang="pug">
v-app
  v-toolbar(app)
    v-toolbar-title.headline
      span Fil'Harmonic&nbsp;
      span.font-weight-light L'inspection facile
    v-spacer
    v-btn(to="/login" flat) Connexion

  v-content
    router-view(:key="$route.fullPath")
</template>

<script>

export default {
  name: 'App',
  data () {
    return {
      //
    }
  }
}
</script>
