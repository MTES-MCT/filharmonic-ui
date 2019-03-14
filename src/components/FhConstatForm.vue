<template lang="pug">
v-layout.column
  v-radio-group.mt-0(row v-model="constat.type" hide-details required :rules="notEmpty")
    v-radio(v-for="(typeConstats, key) in typesConstats" :key="key" :label="typeConstats.label" :value="key")

  v-container.pa-0(grid-list-md)
    v-layout.mt-3.wrap
      v-flex.sm-12
        v-textarea(box label="Remarques" v-model="constat.remarques" auto-grow hideDetails rows="3" clearable)
      v-flex.shrink(v-if="constat.type !== 'conforme'")
        h4 Délai
        v-layout.row.mt-1
          v-text-field(type="number" v-model.number="constat.delai_nombre"
                        label="Délai" box single-line style="width: 80px")
          v-select.ml-1(v-model="constat.delai_unite" :items="unitesDelaisConstat"
                        label="Unité" box single-line style="width: 100px")
</template>

<script>
import { typesConstats, unitesDelaisConstat } from '@/api/inspections'

export default {
  name: 'FhConstatForm',
  props: {
    constat: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      typesConstats,
      unitesDelaisConstat,
      notEmpty: [
        v => !!v || 'Il faut renseigner une valeur'
      ]
    }
  }
}
</script>

<style lang="stylus">
</style>
