<template lang="pug">
.fh-evenement(:class="{'fh-evenement--compact': compact}")
  v-avatar.fh-evenement__avatar(:size="avatarSize")
    img(:src="evenement.auteur.photoURL" :alt="evenement.auteur.name")
  v-layout.column(v-if="compact")
    div
      .fh-evenement__auteur {{ evenement.auteur.name }}
      .fh-evenement__message  {{ message }}
    timeago.fh-evenement__date.grey--text(:datetime="evenement.created_at" :title="evenement.created_at.toLocaleString()")
  v-layout.row(v-else)
    .fh-evenement__auteur {{ evenement.auteur.name }}
    .fh-evenement__message {{ message }}
    timeago.fh-evenement__date(:datetime="evenement.created_at" :title="evenement.created_at.toLocaleString()")

</template>

<script>
import { evenements } from '@/api/evenements'

export default {
  name: 'FhEvenement',
  props: {
    evenement: {
      type: Object,
      required: true
    },
    compact: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    metadonneesEvenement () {
      return evenements[this.evenement.type]
    },
    avatarSize () {
      return this.compact ? 24 : 40
    },
    message () {
      return this.metadonneesEvenement.message(this.evenement)
    }
  }
}
</script>

<style lang="stylus">
.fh-evenement
  border-top 1px solid #f0f0f0
  padding 8px 16px
  display flex
  flex-direction row
  align-items center

  &--compact
    font-size .8em

  &__avatar
    margin-right 8px

  &__auteur
    font-weight bold
    margin-right 4px
    display inline

  &__message
    display inline
    flex 1
    overflow hidden

  &__date
    color #2e2e2e
</style>
