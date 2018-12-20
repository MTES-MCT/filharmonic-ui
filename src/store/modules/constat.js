import { getField, updateField } from 'vuex-map-fields'
import { ADD_ROW, RESET } from '@/store/mutation-types'

const mutations = {
  updateField,
  [ADD_ROW] (state, constat) {
    state.rows.push(constat)
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

export const constat = {
  namespaced: true,
  mutations,
  getters,
  state
}
