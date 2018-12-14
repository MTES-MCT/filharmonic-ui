import { createInspection } from '@/models/inspection'
import InspectionsAPI from '@/api/inspections'
import { SUBMIT } from '@/store/action-types'
import { ERROR, SUCCESS } from '@/store/mutation-types'
import etablissement from '@/store/modules/etablissement'
import echange from '@/store/modules/echange'
import { createHelpers } from 'vuex-map-fields'

const actions = {
  async [SUBMIT] ({ commit, state }) {
    try {
      const inspectionData = createInspection({
        echanges: state.echange.rows,
        etablissement: state.etablissement.rows[0]
      })

      await InspectionsAPI.save(inspectionData)

      commit(SUCCESS)
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
  favorites (state, favorites) {
    state.favorites = favorites
  }
}

const state = () => ({
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
