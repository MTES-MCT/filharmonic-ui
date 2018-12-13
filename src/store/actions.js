import sessionStorage from '@/store/sessionStorage'
import { createInitialStoreState } from '@/store/state'

// makes an action with a single mutation
// const makeAction = type => ({ commit }, ...args) => {
//   commit(type, ...args)
// }

export default {
  async loadInspectionsFavorites ({ commit, state }) {
    const inspectionsFavorites = await this.$api.inspections.listInspectionsFavorites({
      etablissement: true
    })
    commit('loadInspectionsFavorites', inspectionsFavorites)
  },

  async loadInspection ({ commit, state }, inspectionId) {
    if (typeof inspectionId !== 'number') {
      throw new TypeError(`expected number, got: \`${typeof inspectionId}\``)
    }
    commit('loadInspection', await this.$api.inspections.get(inspectionId, {
      etablissement: true,
      activite: true,
      detailMessagesNonLus: true,
      favoris: true
    }))
  },
  async saveInspection ({ commit, dispatch }, updatedInspection) {
    if (typeof updatedInspection !== 'object') {
      throw new TypeError(`expected object, got: \`${typeof updatedInspection}\``)
    }
    await this.$api.inspections.save(updatedInspection)
    await dispatch('loadInspection', updatedInspection.id)
  },
  async toggleInspectionFavoris ({ commit, dispatch }, { inspectionId, favoris }) {
    await this.$api.inspections.toggleFavoris(inspectionId, favoris)
    await dispatch('loadInspection', inspectionId)
    await dispatch('loadInspectionsFavorites')
  },
  async validerInspection ({ commit, dispatch }, { inspectionId, approbateurId }) {
    if (typeof inspectionId !== 'number') {
      throw new TypeError(`expected number, got: \`${typeof inspectionId}\``)
    }
    if (typeof approbateurId !== 'number') {
      throw new TypeError(`expected number, got: \`${typeof approbateurId}\``)
    }
    await this.$api.inspections.valider(inspectionId, approbateurId)
    await dispatch('loadInspection', inspectionId)
  },

  async login ({ commit }, { user, password }) {
    const authenticationInfos = await this.$api.authentication.login(user, password)
    if (authenticationInfos.valid) {
      sessionStorage.save(authenticationInfos.sessionToken)
      commit('login', authenticationInfos)
    }
    return authenticationInfos
  },
  async logout ({ commit }) {
    sessionStorage.delete()
    this.replaceState(createInitialStoreState())
  }
}
