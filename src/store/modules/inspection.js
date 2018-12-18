import { ERROR, SUCCESS, ADD_ROW, RESET } from '@/store/mutation-types'
import { GET, SAVE, VALIDATE } from '@/store/action-types'
import etablissement from '@/store/modules/etablissement'
import { echange } from '@/store/modules/echange'
import { getField, updateField, createHelpers } from 'vuex-map-fields'

const actions = {
  async [GET] ({ commit }, id) {
    try {
      if (typeof id !== 'number') {
        throw new TypeError(`expected number, got: \`${typeof id}\``)
      }
      const inspection = await this.$api.inspections.get(id, {
        etablissement: true,
        activite: true,
        detailMessagesNonLus: true
      })
      commit(RESET)
      commit('echange/' + RESET)
      commit('echange/message/' + RESET)
      inspection.echanges.forEach(e => {
        e.messages.forEach(m => {
          commit('echange/message/' + ADD_ROW, { echangeId: e.id, message: m })
        })
        e.messages = null
        commit('echange/' + ADD_ROW, e)
      })
      inspection.echanges = null
      commit(ADD_ROW, inspection)
    } catch (error) {
      commit(ERROR, error.message)
    }
  },
  async [SAVE] ({ commit }, updatedInspection) {
    try {
      if (typeof updatedInspection !== 'object') {
        const message = `expected object, got: \`${typeof updatedInspection}\``
        commit(ERROR, message)
        throw new TypeError(message)
      }
      await this.$api.inspections.save(updatedInspection)
      commit(SUCCESS)
    } catch (error) {
      commit(ERROR, error.message)
    }
  },
  async [VALIDATE] ({ commit }, { inspectionId, approbateurId }) {
    try {
      if (typeof inspectionId !== 'number') {
        const message = `expected number, got: \`${typeof inspectionId}\``
        commit(ERROR, message)
        throw new TypeError(message)
      }
      if (typeof approbateurId !== 'number') {
        const message = `expected number, got: \`${typeof approbateurId}\``
        commit(ERROR, message)
        throw new TypeError(message)
      }
      await this.$api.inspections.valider(inspectionId, approbateurId)
      commit(SUCCESS)
    } catch (error) {
      commit(ERROR, error.message)
    }
  }
}

const mutations = {
  updateField,
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
    state.rows.push(inspection)
  },
  [RESET] (state) {
    state.rows = []
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

const getters = {
  getField
}

export const { mapMultiRowFields: mapEchangesMultiRowFields } = createHelpers({
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
  getters,
  state,
  modules
}