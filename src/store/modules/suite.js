import { getField, updateField } from 'vuex-map-fields'
import { ADD_ROW, RESET } from '@/store/mutation-types'

const mutations = {
  updateField,
  [ADD_ROW] (state, suite) {
    state.rows.push(suite)
  },
  [RESET] (state) {
    state.rows = []
  }
}

const getters = {
  getField
}

const state = () => ({
  rows: []
})

export const suite = {
  namespaced: true,
  mutations,
  getters,
  state
}
