import { getField, updateField } from 'vuex-map-fields'
import { ADD_ROW, RESET, REMOVE_ROW } from '@/store/mutation-types'

const mutations = {
  updateField,
  [ADD_ROW] (state, inspecteur) {
    state.rows.push(inspecteur)
  },
  [REMOVE_ROW] (state, inspecteur) {
    state.rows.pop(inspecteur)
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

export const inspecteur = {
  namespaced: true,
  mutations,
  getters,
  state
}
