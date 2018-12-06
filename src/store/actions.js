import AuthenticationAPI from '@/api/authentication'
import { listInspectionsOuvertes } from '@/api/inspections'
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
