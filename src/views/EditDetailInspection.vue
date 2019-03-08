<template lang="pug">
v-container.grid-list-lg.inspection-form
  v-form(ref="form" v-model="validForm" lazy-validation)
    fh-detail-inspection(:inspection="updatedInspection")
    fh-btn(block :action="saveInspection" :disableif="!validForm" color="primary") Sauvegarder
</template>

<script>
import FhBtn from '@/components/FhBtn.vue'
import FhDetailInspection from '@/components/FhDetailInspection.vue'
import * as _ from '@/util'

export default {
  components: {
    FhBtn,
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
      validForm: false,
      updatedInspection: {}
    }
  },
  created () {
    this.updatedInspection = _.cloneDeep(this.inspection)
    delete this.updatedInspection.points_de_controle
    delete this.updatedInspection.etablissement
    delete this.updatedInspection.suite
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
