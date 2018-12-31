import { getField, updateField } from 'vuex-map-fields'
import { ADD_ROW, RESET } from '@/store/mutation-types'
import { SAVE } from '@/store/action-types'

const actions = {
  async [SAVE] ({ commit }, suite) {
    if (typeof suite !== 'object') {
      const message = `expected object, got: \`${typeof suite}\``
      throw new TypeError(message)
    }
    const newSuite = await this.$api.suites.save(suite)
    commit(ADD_ROW, newSuite)
  }
}

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
  state,
  actions
}
