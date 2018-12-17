import { getField, updateField } from 'vuex-map-fields'
import { ADD_ROW } from '@/store/mutation-types'

const mutations = {
  updateField,
  [ADD_ROW] (state, message) {
    state.rows.push(message)
  }
}

const getters = {
  getField
}

const state = () => ({
  rows: []
})

export const message = {
  namespaced: true,
  mutations,
  getters,
  state
}
