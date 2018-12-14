import { getField, updateField } from 'vuex-map-fields'
import { ERROR, SUCCESS } from '@/store/mutation-types'
// import { createInspection } from '@/models/inspection'

const actions = {
  async favoris ({ commit, state }, userId) {
    try {
      console.log('userId=' + userId)
      const favoris = await this.$api.inspections.listAssignedOuvertes(userId, {
        etablissement: true
      })
      // const inspectionsData = data.map(x => createInspection(x))

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
    state.rows = favoris
  }
}

const getters = {
  getField
}

const state = () => ({
  rows: [],
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
