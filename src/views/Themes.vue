<template lang="pug">
fh-page(:wait="wait")
  template(slot-scope="_")
    v-container
      h1.display-1.font-weight-bold.mb-4 Référentiel des thèmes
      p Cette page permet de gérer les thèmes utilisables lors des inspections.
      div(v-for="theme in themes" :key="theme.id")
        span.body-2 {{ theme.name }}
        v-btn(icon @click="deleteTheme(theme.id)")
          v-icon close
      v-form(ref="form" @submit.prevent="addTheme")
        v-text-field.d-inline-block(v-model="newTheme" required :rules="themesRules" label="Nouveau thème")
        v-btn(type="submit" color="primary") Créer
</template>

<script>
import BasePage from '@/views/mixins/BasePage.js'
import * as _ from '@/util'

export default {
  mixins: [BasePage],
  data () {
    return {
      themes: [],
      newTheme: '',
      themesRules: [
        v => !!v || 'Il faut renseigner une valeur',
        v => !this.nomsThemes.includes(_.normalize(v)) || 'Ce thème existe déjà'
      ]
    }
  },
  computed: {
    nomsThemes () {
      return this.themes.map(theme => theme.name)
    }
  },
  created () {
    this.loadThemes()
  },
  methods: {
    async loadThemes () {
      this.wait = this.$api.themes.list()
      this.themes = await this.wait
    },
    async addTheme () {
      if (this.$refs.form.validate()) {
        await this.$api.themes.create(this.newTheme)
        this.$refs.form.reset()
        this.newTheme = ''
        await this.loadThemes()
      }
    },
    async deleteTheme (themeId) {
      await this.$api.themes.delete(themeId)
      await this.loadThemes()
    }
  }
}
</script>
