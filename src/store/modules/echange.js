import { getField, updateField, createHelpers } from 'vuex-map-fields'
import { ADD_ROW, SUCCESS, ERROR } from '@/store/mutation-types'
import { SAVE, GET } from '@/store/action-types'

const actions = {
  async [SAVE] ({ commit }, echange) {
    try {
      if (typeof echange !== 'object') {
        const message = `expected object, got: \`${typeof echange}\``
        commit(ERROR, message)
        throw new TypeError(message)
      }
      await this.$api.echanges.save(echange)
      commit(SUCCESS)
    } catch (error) {
      commit(ERROR, error.message)
    }
  },
  async [GET] ({ commit, state }, id) {
    try {
      if (typeof id !== 'number') {
        const message = `expected number, got: \`${typeof id}\``
        commit(ERROR, message)
        throw new TypeError(message)
      }
      const echange = await this.$api.echanges.get(id)
      commit(ADD_ROW, echange)
    } catch (error) {
      commit(ERROR, error.message)
    }
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
  actions,
  getters,
  state
}
