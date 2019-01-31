<template lang="pug">
v-container.pa-0(grid-list-md)
  v-layout.column
    v-text-field(label="Sujet" hideDetails clearable
                  v-model="pointDeControle.sujet"
                  required
                  :rules="notEmpty"
                )

    v-text-field(v-for="(referenceReglementaire, index) in pointDeControle.references_reglementaires" :key="index"
                  label="Référence réglementaire" hideDetails clearable
                  v-model="pointDeControle.references_reglementaires[index]"
                  :append-outer-icon="pointDeControle.references_reglementaires.length > 1 ? 'delete' : null"
                  @click:append-outer="pointDeControle.references_reglementaires.splice(index, 1)"
                  required
                  :rules="notEmpty"
                )
    .d-block
      v-btn(flat title="Ajouter une référence réglementaire" @click="pointDeControle.references_reglementaires.push('')")
        v-icon(medium left) add
        | Nouvelle référence réglementaire
</template>

<script>
export default {
  name: 'FhPointDeControleForm',
  props: {
    pointDeControle: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      notEmpty: [
        v => !!v || 'Il faut renseigner une valeur'
      ]
    }
  }
}
</script>

<style lang="stylus">
</style>
