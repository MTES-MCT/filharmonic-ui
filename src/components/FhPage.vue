<template lang="pug">
div
  .app-loading(v-if="state === 'loading'")
  .fh-page__error(v-if="state === 'forbidden_error'")
    v-icon.fh-page__error-icon(color="grey") remove_circle
    p Vous n'avez pas les autorisations nécessaires pour accéder à cette page.
    p {{ message }}
  .fh-page__error(v-if="state === 'error'")
    v-icon.fh-page__error-icon(color="grey") error
    p {{ message }}
  .fh-page__error(v-if="state === 'technical_error'")
    v-icon.fh-page__error-icon(color="grey") mood_bad
    p Une erreur technique est survenue. Si le problème persiste, veuillez contacter le support.
    p Le message d'erreur était :&nbsp;
      i {{ message }}

  slot(v-if="state === 'success'")
</template>

<script>
import { ApplicationError, ForbiddenError, UnknownServerError } from '@/errors'

/*
Ce composant permet à toutes les pages d'afficher un spinner pendant le chargement
des données asynchrones et de gérer les cas d'erreurs.
*/
export default {
  name: 'FhPage',
  props: {
    wait: {
      type: Promise,
      default: Promise.resolve()
    }
  },
  data () {
    return {
      state: '',
      message: ''
    }
  },
  async created () {
    this.state = 'loading'
    try {
      await this.wait
      this.state = 'success'
    } catch (err) {
      if (err instanceof ApplicationError) {
        if (err instanceof ForbiddenError) {
          this.state = 'forbidden_error'
        } else if (err instanceof UnknownServerError) {
          this.state = 'technical_error'
        } else {
          this.state = 'error'
        }
      } else {
        this.state = 'technical_error'
      }
      this.message = err.message
    }
  }
}
</script>

<style lang="stylus">
.fh-page
  &__error
    display flex
    flex-direction column
    align-items center
    padding 24px
    margin-top 2em

  &__error-icon
    font-size 12em !important
    margin-bottom 24px
</style>
