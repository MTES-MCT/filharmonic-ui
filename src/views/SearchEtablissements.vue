<template lang="pug">
v-container
  h1.display-1.font-weight-bold.mb-4 Recherche des établissements
  v-form(ref="form" lazy-validation)
    v-text-field(
      v-model="name"
      label="Nom usuel ou raison sociale")
    v-text-field(
      v-model="localisation"
      label="Localisation par commune ou code postal")
    v-text-field(
      v-model="s3ic"
      label="Code S3IC")

    v-btn(
      to="/etablissements"
      color="primary") Rechercher
    v-btn(
      type="submit"
      @click="clear") Effacer

</template>

<script>
export default {
  data: () => ({
  }),

  methods: {
    clear () {
      this.$refs.form.reset()
    }
  }
}
</script>
