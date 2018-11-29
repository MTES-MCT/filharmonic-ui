import AuthenticationAPI from '@/api/authentication'
import { listControlesOuverts } from '@/api/controles'
import sessionStorage from './sessionStorage'

// makes an action with a single mutation
// const makeAction = type => ({ commit }, ...args) => {
//   commit(type, ...args)
// }

export default {
  async loadControlesOuverts ({ commit, state }) {
    const controlesOuverts = await listControlesOuverts(state.authentication.user.id)
    commit('loadControlesOuverts', controlesOuverts)
  },
  async login ({ commit }, { user, password }) {
    const authenticationInfos = await AuthenticationAPI.login(user, password)
    sessionStorage.save(authenticationInfos.sessionToken)
    commit('login', authenticationInfos)
    return authenticationInfos
  },
  async logout ({ commit }) {
    sessionStorage.delete()
    commit('logout')
  }
}
