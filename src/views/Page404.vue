<template lang="pug">
v-app
  v-content
    v-container.fluid.fill-height
      v-layout.align-center.justify-center.wrap
        v-flex.xs12.sm8.md4.text-xs-center
          h1 Oups !
          p La page demandée ne semble pas exister.
          v-btn(to="/" small) Aller à l'accueil
</template>
