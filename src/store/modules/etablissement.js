import { getField, updateField } from 'vuex-map-fields'
import { RESET, ADD_ROW } from '@/store/mutation-types'
import { GET } from '@/store/action-types'
import { createEtablissement } from '@/models/etablissement'

const actions = {
  async [GET] ({ commit }, id) {
    if (typeof id !== 'string') {
      throw new TypeError(`expected string, got: \`${typeof id}\``)
    }
    const etablissement = await this.$api.etablissements.get(id, { inspections: true })
    commit(RESET)
    commit(ADD_ROW, createEtablissement(etablissement))
  }
}

const mutations = {
  updateField,
  [RESET] (state) {
    state.rows = []
  },
  [ADD_ROW] (state, etablissement) {
    state.rows.push(etablissement)
  }
}

const getters = {
  getField
}

const state = () => ({
  rows: []
})

export const etablissement = {
  namespaced: true,
  mutations,
  getters,
  state,
  actions
}
