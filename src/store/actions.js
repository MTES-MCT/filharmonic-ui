import sessionStorage from '@/store/sessionStorage'
import { createInitialStoreState } from '@/store/state'

// makes an action with a single mutation
// const makeAction = type => ({ commit }, ...args) => {
//   commit(type, ...args)
// }

export default {
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
