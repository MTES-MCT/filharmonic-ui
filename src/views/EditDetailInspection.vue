<template lang="pug">
v-container.grid-list-lg.inspection-form
  v-form(ref="form" v-model="validForm" lazy-validation)
    fh-detail-inspection
    v-btn(block @click="saveInspection" :disabled="!validForm" color="primary") Sauvegarder
</template>

<script>
import FhDetailInspection from '@/components/FhDetailInspection.vue'
import { SAVE } from '@/store/action-types'

export default {
  components: {
    FhDetailInspection
  },
  props: {
    inspection: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      validForm: false
    }
  },
  methods: {
    saveInspection () {
      if (this.$refs.form.validate()) {
        this.$store.dispatch('inspection/' + SAVE)
        this.$router.push(`/inspections/${this.inspection.id}/details`)
      }
    }
  }
}
</script>

<style lang="stylus">
.inspection-form
  max-width 600px
</style>
