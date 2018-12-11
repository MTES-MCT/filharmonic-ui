import sessionStorage from '@/store/sessionStorage'
import { createInitialStoreState } from '@/store/state'

// makes an action with a single mutation
// const makeAction = type => ({ commit }, ...args) => {
//   commit(type, ...args)
// }

export default {
  async loadInspectionsOuvertes ({ commit, state }) {
    const inspectionsOuvertes = await this.$api.inspections.listAssignedOuvertes(state.authentication.user.id, {
      etablissement: true
    })
    commit('loadInspectionsOuvertes', inspectionsOuvertes)
  },

  async loadInspection ({ commit, state }, inspectionId) {
    if (typeof inspectionId !== 'number') {
      throw new TypeError(`expected number, got: \`${typeof inspectionId}\``)
    }
    commit('loadInspection', await this.$api.inspections.get(inspectionId, {
      etablissement: true,
      activite: true,
      detailMessagesNonLus: true
    }))
  },
  async saveInspection ({ commit, dispatch }, updatedInspection) {
    if (typeof updatedInspection !== 'object') {
      throw new TypeError(`expected object, got: \`${typeof updatedInspection}\``)
    }
    await this.$api.inspections.save(updatedInspection)
    await dispatch('loadInspection', updatedInspection.id)
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
