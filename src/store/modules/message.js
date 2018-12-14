import { getField, updateField } from 'vuex-map-fields'
import { ADD_ROW } from '@/store/mutation-types'
import { Message } from '@/models/message'

const mutations = {
  updateField,
  [ADD_ROW] (state) {
    state.rows.push(new Message())
  }
}

const getters = {
  getField
}

const state = () => ({
  rows: [new Message()]
})

export default {
  namespaced: true,
  mutations,
  getters,
  state
}
