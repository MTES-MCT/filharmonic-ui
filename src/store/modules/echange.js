import { getField, updateField, createHelpers } from 'vuex-map-fields'
import { ADD_ROW, SUCCESS, ERROR, RESET } from '@/store/mutation-types'
import { message } from '@/store/modules/message'
import { SAVE } from '@/store/action-types'

const actions = {
  async [SAVE] ({ commit }, echange) {
    if (typeof echange !== 'object') {
      const message = `expected object, got: \`${typeof echange}\``
      throw new TypeError(message)
    }
    await this.$api.echanges.save(echange)
  }
}

const mutations = {
  updateField,
  [ADD_ROW] (state, echange) {
    // eslint-disable-next-line no-param-reassign
    state.error = false
    // eslint-disable-next-line no-param-reassign
    state.success = true
    state.rows.push(echange)
  },
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
  },
  [RESET] (state) {
    state.rows = []
  }
}

const getters = {
  getField
}

const state = () => ({
  rows: [],
  error: false,
  success: false
})

const modules = {
  message
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
