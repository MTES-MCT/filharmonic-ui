import { ERROR, SUCCESS, ADD_ROW } from '@/store/mutation-types'
import etablissement from '@/store/modules/etablissement'
import echange from '@/store/modules/echange'
import { createHelpers } from 'vuex-map-fields'

const actions = {
  async load ({ commit, state }, id) {
    try {
      if (typeof id !== 'number') {
        throw new TypeError(`expected number, got: \`${typeof id}\``)
      }
      const inspection = await this.$api.inspections.get(id, {
        etablissement: true,
        activite: true,
        detailMessagesNonLus: true
      })

      commit(ADD_ROW, inspection)
    } catch (error) {
      commit(ERROR, error.message)
    }
  }
}

const mutations = {
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
  [ADD_ROW] (state, inspection) {
    // eslint-disable-next-line no-param-reassign
    state.error = false
    // eslint-disable-next-line no-param-reassign
    state.success = true
    // eslint-disable-next-line no-param-reassign
    state.rows.push(inspection)
  }
}

const state = () => ({
  rows: [],
  error: false,
  success: false
})

const modules = {
  echange,
  etablissement
}

export const { mapFields: mapEchangeFields } = createHelpers({
  getterType: 'inspection/echange/getField',
  mutationType: 'inspection/echange/updateField'
})

export const { mapFields: mapEtablissementFields } = createHelpers({
  getterType: 'inspection/etablissement/getField',
  mutationType: 'inspection/etablissement/updateField'
})

export const inspection = {
  namespaced: true,
  actions,
  mutations,
  state,
  modules
}
