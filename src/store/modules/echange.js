import { getField, updateField, createHelpers } from 'vuex-map-fields'
import { Echange } from '@/models/echange'
import { ADD_ROW } from '@/store/mutation-types'

const mutations = {
  updateField,
  [ADD_ROW] (state) {
    state.rows.push(new Echange())
  }
}

const getters = {
  getField
}

const state = () => ({
  rows: [new Echange()]
})

export const { mapFields: mapMessageFields } = createHelpers({
  getterType: 'inspection/echange/message/getField',
  mutationType: 'inspection/echange/message/updateField'
})

export const { mapFields: mapConstatFields } = createHelpers({
  getterType: 'inspection/echange/constat/getField',
  mutationType: 'inspection/echange/constat/updateField'
})

export default {
  namespaced: true,
  mutations,
  getters,
  state
}
