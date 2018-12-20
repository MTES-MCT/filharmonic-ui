import { ADD_ROW, RESET } from '@/store/mutation-types'
import { GET, SAVE, VALIDATE } from '@/store/action-types'
import { etablissement } from '@/store/modules/etablissement'
import { echange } from '@/store/modules/echange'
import { theme } from '@/store/modules/theme'
import { detail } from '@/store/modules/detail'
import { etat } from '@/store/modules/etat'
import { inspecteur } from '@/store/modules/inspecteur'
import { getField, updateField, createHelpers } from 'vuex-map-fields'
import { createEtat } from '@/models/etat'
import { createDetail } from '@/models/detail'
import { createTheme } from '@/models/theme'
import { createSuite } from '@/models/suite'
import { createConstat } from '@/models/constat'
import { createEtablissement } from '@/models/etablissement'
import { createUser } from '@/models/user'

const actions = {
  async [GET] ({ commit }, id) {
    if (typeof id !== 'number') {
      throw new TypeError(`expected number, got: \`${typeof id}\``)
    }
    const inspection = await this.$api.inspections.get(id, {
      etablissement: true,
      activite: true,
      detailMessagesNonLus: true,
      echanges: true,
      themes: true,
      inspecteurs: true
    })
    reset(commit)
    commit('detail/' + ADD_ROW, createDetail(inspection))
    commit('etat/' + ADD_ROW, createEtat(inspection.etat))
    commit('etablissement/' + ADD_ROW, createEtablissement(inspection.etablissement))
    inspection.echanges.forEach(e => {
      commit('echange/' + ADD_ROW, e)
      e.messages.forEach(m => {
        commit('echange/message/' + ADD_ROW, { echangeId: e.id, message: m })
      })
      if (e.constat) {
        commit('echange/constat/' + ADD_ROW, createConstat(e.constat))
      }
      if (e.suites) {
        e.suites.forEach(s => {
          commit('echange/suite/' + ADD_ROW, createSuite(s))
        })
      }
    })
    inspection.themes.forEach(t => {
      commit('theme/' + ADD_ROW, createTheme(t))
    })
    inspection.inspecteurs.forEach(u => {
      commit('inspecteur/' + ADD_ROW, createUser(u))
    })
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

const reset = (commit) => {
  commit(RESET)
  commit('detail/' + RESET)
  commit('etablissement/' + RESET)
  commit('etat/' + RESET)
  commit('theme/' + RESET)
  commit('echange/' + RESET)
  commit('inspecteur/' + RESET)
  commit('echange/message/' + RESET)
  commit('echange/suite/' + RESET)
  commit('echange/constat/' + RESET)
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
  etablissement,
  theme,
  etat,
  detail,
  inspecteur
}

const getters = {
  getField
}

export const { mapMultiRowFields: mapEchangesMultiRowFields } = createHelpers({
  getterType: 'inspection/echange/getField',
  mutationType: 'inspection/echange/updateField'
})
export const { mapMultiRowFields: mapInspecteursMultiRowFields } = createHelpers({
  getterType: 'inspection/inspecteur/getField',
  mutationType: 'inspection/inspecteur/updateField'
})
export const { mapMultiRowFields: mapThemesMultiRowFields } = createHelpers({
  getterType: 'inspection/theme/getField',
  mutationType: 'inspection/theme/updateField'
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
