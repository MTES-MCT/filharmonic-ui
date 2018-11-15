<template lang="pug">
v-app
  v-toolbar(app)
    v-toolbar-title.headline
      span Fil'Harmonic&nbsp;
      span.font-weight-light L'inspection pratique
    v-spacer
    v-toolbar-items
      v-btn(to="/login" flat) Connexion

  v-content
    v-container
      v-layout.text-xs-center.wrap
        v-flex.mb-4
          h1.display-1.font-weight-bold.mb-4 Bienvenue sur Fil'Harmonic
          p.subheading.font-weight-regular
            | TODO description du service
          v-btn(to="/login") Connexion
</template>
