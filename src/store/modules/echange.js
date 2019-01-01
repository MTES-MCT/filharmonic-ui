import { getField, updateField, createHelpers } from 'vuex-map-fields'
import { ADD_ROW, RESET } from '@/store/mutation-types'
import { message } from '@/store/modules/message'
import { constat } from '@/store/modules/constat'
import { SAVE } from '@/store/action-types'

const updateProperty = function ({ commit }, { echange, index, property }) {
  if (property[0] !== 'id' && echange.hasOwnProperty(property[0])) {
    commit('updateField', { path: 'rows[' + index.index + '].' + property[0], value: property[1] })
  }
}

const actions = {
  async [SAVE] ({ commit }, { echange, ...index }) {
    if (typeof echange !== 'object') {
      const message = `expected object, got: \`${typeof echange}\``
      throw new TypeError(message)
    }
    const newEchange = await this.$api.echanges.save(echange)
    if (!echange.hasOwnProperty('id')) {
      const message = 'expected echange having id property'
      throw new SyntaxError(message)
    }
    if (echange.id > 0) {
      Object.entries(echange).forEach(e => updateProperty({ commit }, { echange: newEchange, index: index, property: e }))
    } else {
      commit(ADD_ROW, newEchange)
    }
  }
}

const mutations = {
  updateField,
  [ADD_ROW] (state, echange) {
    state.rows.push(echange)
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

const modules = {
  message,
  constat
}

export const { mapMultiRowFields: mapMessagesMultiRowFields } = createHelpers({
  getterType: 'inspection/echange/message/getField',
  mutationType: 'inspection/echange/message/updateField'
})

export const { mapFields: mapConstatFields } = createHelpers({
  getterType: 'inspection/echange/constat/getField',
  mutationType: 'inspection/echange/constat/updateField'
})

export const echange = {
  namespaced: true,
  mutations,
  getters,
  state,
  modules,
  actions
}
