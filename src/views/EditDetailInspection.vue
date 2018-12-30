<template lang="pug">
v-container.grid-list-lg.inspection-form
  v-form(ref="form" v-model="validForm" lazy-validation)
    fh-detail-inspection
    v-btn(block @click="saveInspection" :disabled="!validForm" color="primary") Sauvegarder
</template>

<script>
import FhDetailInspection from '@/components/FhDetailInspection.vue'
import { createNamespacedHelpers } from 'vuex'
import { SAVE } from '@/store/action-types'
const { mapState: mapDetailState } = createNamespacedHelpers('inspection/detail')

export default {
  components: {
    FhDetailInspection
  },
  data () {
    return {
      validForm: false
    }
  },
  computed: {
    ...mapDetailState({ detail: state => state.rows[0] })
  },
  methods: {
    saveInspection () {
      if (this.$refs.form.validate()) {
        this.$store.dispatch('inspection/' + SAVE)
        this.$router.push(`/inspections/${this.detail.id}/details`)
      }
    }
  }
}
</script>

<style lang="stylus">
.inspection-form
  max-width 600px
</style>
