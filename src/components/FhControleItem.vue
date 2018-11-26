<template lang="pug">
v-list-tile(:to="`/controles/${controle.id}`")
  v-list-tile-action.mr-4.fh-controle-item__date
    v-list-tile-title
      v-icon.mr-2 event
      time {{ controle.date }}

  v-list-tile-content
    v-list-tile-title
      strong.ml-2 {{ controle.etablissement.nom }}
      span.ml-4 {{ controle.etablissement.adresse }}
    v-list-tile-sub-title
      v-chip(v-for="(theme, index) in controle.themes" :key="index" small) {{ theme }}

  v-layout.column.align-end.text-xs-right.hidden-sm-and-down
    div Dernière activité par {{ controle.lastEvent.author.name }}
    div Le {{ controle.lastEvent.date.toLocaleString() }}

</template>

<script>
import FhMessage from '@/components/FhMessage.vue'

export default {
  name: 'FhControleItem',
  components: {
    FhMessage
  },
  props: {
    controle: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="stylus">
.fh-controle-item
  &__date
    min-width 130px
    font-size 1.1em
</style>
