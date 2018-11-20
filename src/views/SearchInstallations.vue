<template lang="pug">
v-container
  h1.display-1.font-weight-bold.mb-4 Recherche des installations
  v-form(ref="form" v-model="valid" lazy-validation)
    v-text-field(
      v-model="name"
      :rules="nameRules"
      label="Nom"
      required)
    v-text-field(
      v-model="localisation"
      label="Localisation")

    v-btn(
      :disabled="!valid"
      to="/installations"
      color="primary") Rechercher
    v-btn(
      type="submit"
      @click="clear") Effacer

</template>

<script>
export default {
  data: () => ({
    valid: false,
    name: '',
    nameRules: [
      v => !!v || 'Name is required'
    ]
  }),

  methods: {
    clear () {
      this.$refs.form.reset()
    }
  }
}
</script>
