import { getField, updateField } from 'vuex-map-fields'
import { ADD_ROW, RESET } from '@/store/mutation-types'
import { LIST } from '@/store/action-types'
import { createFavori } from '@/models/favori'

const actions = {
  async [LIST] ({ commit }, userId) {
    const inspections = await this.$api.inspections.listAssignedOuvertes(userId, {
      etablissement: true
    })
    commit(RESET)
    inspections.forEach(inspection => {
      commit(ADD_ROW, createFavori({ inspection: inspection, userId: userId }))
    })
  }
}

const mutations = {
  updateField,
  [ADD_ROW] (state, favori) {
    state.rows.push(favori)
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

export const favori = {
  namespaced: true,
  mutations,
  getters,
  state,
  actions
}
