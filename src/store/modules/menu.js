import { getField, updateField } from 'vuex-map-fields'
import { RESET, ADD_ROW } from '@/store/mutation-types'
import { LIST } from '@/store/action-types'

const actions = {
  async [LIST] ({ commit }, userId) {
    const favoris = await this.$api.inspections.listAssignedOuvertes(userId, {
      etablissement: true
    })
    commit(RESET)
    favoris.forEach(favori => {
      commit(ADD_ROW, favori)
    })
  }
}

const mutations = {
  updateField,
  [RESET] (state) {
    state.favoris = []
  },
  [ADD_ROW] (state, favoris) {
    state.favoris.push(favoris)
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
