import { getField, updateField } from 'vuex-map-fields'
import { ADD_ROW, RESET } from '@/store/mutation-types'
import { SAVE } from '@/store/action-types'

const actions = {
  async [SAVE] ({ commit }, evenement) {
    const newEvenement = await this.$api.evenements.create({
      type: evenement.type,
      author: evenement.author,
      data: evenement.data,
      inspectionId: evenement.inspectionId
    })
    commit(ADD_ROW, newEvenement)
    return newEvenement
  }
}

const mutations = {
  updateField,
  [ADD_ROW] (state, evenement) {
    state.rows.push(evenement)
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

export const evenement = {
  namespaced: true,
  mutations,
  getters,
  state,
  actions
}
