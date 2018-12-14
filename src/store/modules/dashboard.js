import { getField, updateField } from 'vuex-map-fields'
import { ADD_ROW } from '@/store/mutation-types'
import { Inspection } from '@/models/inspection'
import InspectionsAPI from '@/api/inspections'

const actions = {
  async loadInspectionsOuvertes ({ commit, state }) {
    const inspectionsOuvertes = await InspectionsAPI.listAssignedOuvertes(state.authentication.user.id, {
      etablissement: true
    })
    commit('loadInspectionsOuvertes', inspectionsOuvertes)
  }
}

const mutations = {
  updateField,
  [ADD_ROW] (state) {
    state.rows.push(new Inspection())
  }
}

const getters = {
  getField
}

const state = () => ({
  rows: [new Inspection()]
})

export const dashboard = {
  namespaced: true,
  mutations,
  actions,
  getters,
  state
}
