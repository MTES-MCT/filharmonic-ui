import { Authentication } from '@/models/authentication'

const actions = {
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
    this.replaceState(new Authentication())
  }
}

const mutations = {
  login (state, authenticationInfos) {
    state.authentication = authenticationInfos
  }
}

const state = () => ({
  authentication: {}
})

export const auth = {
  namespaced: true,
  actions,
  mutations,
  state
}
