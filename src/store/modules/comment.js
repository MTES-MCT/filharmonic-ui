import { getField, updateField } from 'vuex-map-fields'
import { ADD_ROW, RESET } from '@/store/mutation-types'

const mutations = {
  updateField,
  [ADD_ROW] (state, comment) {
    state.rows.push(comment)
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

export const comment = {
  namespaced: true,
  mutations,
  getters,
  state
}
