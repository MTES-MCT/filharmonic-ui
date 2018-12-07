import AuthenticationAPI from '@/api/authentication'
import { getInspection, listInspectionsOuvertes, saveInspection } from '@/api/inspections'
import sessionStorage from '@/store/sessionStorage'
import { createInitialStoreState } from '@/store/state'

// makes an action with a single mutation
// const makeAction = type => ({ commit }, ...args) => {
//   commit(type, ...args)
// }

export default {
  async loadInspectionsOuvertes ({ commit, state }) {
    const inspectionsOuvertes = await listInspectionsOuvertes(state.authentication.user.id, {
      etablissement: true
    })
    commit('loadInspectionsOuvertes', inspectionsOuvertes)
  },

  async loadInspection ({ commit, state }, inspectionId) {
    if (typeof inspectionId !== 'number') {
      throw new TypeError(`expected number, got: \`${typeof inspectionId}\``)
    }
    commit('loadInspection', await getInspection(inspectionId, {
      etablissement: true,
      activite: true
    }))
  },
  async saveInspection ({ commit, dispatch }, updatedInspection) {
    if (typeof updatedInspection !== 'object') {
      throw new TypeError(`expected object, got: \`${typeof updatedInspection}\``)
    }
    await saveInspection(updatedInspection)
    await dispatch('loadInspection', updatedInspection.id)
  },

  async login ({ commit }, { user, password }) {
    const authenticationInfos = await AuthenticationAPI.login(user, password)
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
