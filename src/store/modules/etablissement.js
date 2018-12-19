import { getField, updateField } from 'vuex-map-fields'
import { RESET, ADD_ROW } from '@/store/mutation-types'

const mutations = {
  updateField,
  [RESET] (state) {
    state.rows = []
  },
  [ADD_ROW] (state, etablissement) {
    state.rows.push(etablissement)
  }
}

const getters = {
  getField
}

const state = () => ({
  rows: []
})

export default {
  namespaced: true,
  mutations,
  getters,
  state
}
