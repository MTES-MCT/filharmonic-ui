<template lang="pug">
v-container.grid-list-lg.inspection-form
  v-form(ref="form" v-model="validForm" lazy-validation)
    fh-detail-inspection(:inspection="updatedInspection")
    v-btn(block @click="saveInspection" :disabled="!validForm" color="primary") Sauvegarder
</template>

<script>
import FhDetailInspection from '@/components/FhDetailInspection.vue'
import * as _ from '@/util'

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
  created () {
    this.updatedInspection = _.cloneDeep(this.inspection)
  },
  methods: {
    async saveInspection () {
      if (this.$refs.form.validate()) {
        await this.$api.inspections.save(this.updatedInspection)
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
