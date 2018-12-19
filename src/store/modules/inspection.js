import { ADD_ROW, RESET } from '@/store/mutation-types'
import { GET, SAVE, VALIDATE } from '@/store/action-types'
import etablissement from '@/store/modules/etablissement'
import { echange } from '@/store/modules/echange'
import { getField, updateField, createHelpers } from 'vuex-map-fields'

const actions = {
  async [GET] ({ commit }, id) {
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
      commit('echange/' + ADD_ROW, e)
    })
    commit(ADD_ROW, inspection)
  },
  async [SAVE] ({ commit }, updatedInspection) {
    if (typeof updatedInspection !== 'object') {
      const message = `expected object, got: \`${typeof updatedInspection}\``
      throw new TypeError(message)
    }
    await this.$api.inspections.save(updatedInspection)
  },
  async [VALIDATE] ({ commit }, { inspectionId, approbateurId }) {
    if (typeof inspectionId !== 'number') {
      const message = `expected number, got: \`${typeof inspectionId}\``
      throw new TypeError(message)
    }
    if (typeof approbateurId !== 'number') {
      const message = `expected number, got: \`${typeof approbateurId}\``
      throw new TypeError(message)
    }
    await this.$api.inspections.valider(inspectionId, approbateurId)
  }
}

const mutations = {
  updateField,
  [ADD_ROW] (state, inspection) {
    state.rows.push(inspection)
  },
  [RESET] (state) {
    state.rows = []
  }
}

const state = () => ({
  rows: []
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
