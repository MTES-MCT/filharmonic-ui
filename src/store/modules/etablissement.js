import { getField, updateField } from 'vuex-map-fields'

import { Etablissement } from '@/models/etablissement'

const mutations = {
  updateField
}

const getters = {
  getField
}

const state = () => ({
  rows: [new Etablissement()]
})

export default {
  namespaced: true,
  mutations,
  getters,
  state
}
