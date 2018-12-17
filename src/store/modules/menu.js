import { getField, updateField } from 'vuex-map-fields'
import { ERROR, SUCCESS } from '@/store/mutation-types'
import { LIST } from '@/store/action-types'

const actions = {
  async [LIST] ({ commit, state }, userId) {
    try {
      const favoris = await this.$api.inspections.listAssignedOuvertes(userId, {
        etablissement: true
      })

      commit(SUCCESS, favoris)
    } catch (error) {
      commit(ERROR, error.message)
    }
  }
}

const mutations = {
  updateField,
  [ERROR] (state, error) {
    // eslint-disable-next-line no-param-reassign
    state.error = error
    // eslint-disable-next-line no-param-reassign
    state.success = false
  },
  [SUCCESS] (state, favoris) {
    // eslint-disable-next-line no-param-reassign
    state.error = false
    // eslint-disable-next-line no-param-reassign
    state.success = true
    // eslint-disable-next-line no-param-reassign
    state.favoris = favoris
  }
}

const getters = {
  getField
}

const state = () => ({
  favoris: [],
  error: false,
  success: false
})

export const menu = {
  namespaced: true,
  root: true,
  mutations,
  actions,
  getters,
  state
}
