import { getField, updateField } from 'vuex-map-fields'
import { ADD_ROW, RESET } from '@/store/mutation-types'
import { SAVE } from '@/store/action-types'

const actions = {
  async [SAVE] ({ commit }, constat) {
    const newConstat = await this.$api.constats.save(constat)
    commit(ADD_ROW, newConstat)
    return newConstat
  }
}

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
  state,
  actions
}
