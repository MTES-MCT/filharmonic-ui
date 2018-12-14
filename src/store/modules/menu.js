import { getField, updateField } from 'vuex-map-fields'
import { LIST } from '@/store/action-types'
import { ERROR, SUCCESS } from '@/store/mutation-types'
import InspectionsAPI from '@/api/inspections'
import { createInspection } from '@/models/inspection'

const actions = {
  async [LIST] ({ commit, state }) {
    try {
      state.rows = await InspectionsAPI.listAssignedOuvertes(state.authentication.user.id, {
        etablissement: true
      }).map(x => createInspection(x))

      commit(SUCCESS)
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
  [SUCCESS] (state) {
    // eslint-disable-next-line no-param-reassign
    state.error = false
    // eslint-disable-next-line no-param-reassign
    state.success = true
  }
}

const getters = {
  getField
}

const state = (data) => ({
  rows: [],
  error: false,
  success: false
})

export const menu = {
  namespaced: true,
  mutations,
  actions,
  getters,
  state
}
