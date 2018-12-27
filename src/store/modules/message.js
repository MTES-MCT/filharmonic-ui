import { getField, updateField } from 'vuex-map-fields'
import { ADD_ROW, RESET, REMOVE_ROW } from '@/store/mutation-types'
import { SAVE } from '@/store/action-types'

const actions = {
  async [SAVE] ({ commit }, message) {
    if (message.id > 0) {
      commit(REMOVE_ROW, message)
    }
    const messageId = await this.$api.messages.save(message)
    commit(ADD_ROW, message)
    return messageId
  }
}

const mutations = {
  updateField,
  [ADD_ROW] (state, message) {
    state.rows.push(message)
  },
  [REMOVE_ROW] (state, message) {
    state.rows.pop(message)
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

export const message = {
  namespaced: true,
  mutations,
  getters,
  state,
  actions
}
