import { getField, updateField } from 'vuex-map-fields'
import { ADD_ROW, RESET } from '@/store/mutation-types'

const mutations = {
  updateField,
  [ADD_ROW] (state, detail) {
    state.rows.push(detail)
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

export const detail = {
  namespaced: true,
  mutations,
  getters,
  state
}
