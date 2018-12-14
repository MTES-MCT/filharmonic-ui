import { Authentication } from '@/models/authentication'

const localStorageSessionTokenKey = 'fh-token'

const actions = {
  async login ({ commit }, { user, password }) {
    const authentication = await this.$api.authentication.login(user, password)
    if (authentication.valid) {
      localStorage.setItem(localStorageSessionTokenKey, authentication.token)
      commit('login', authentication)
    }
    return authentication
  },
  async logout ({ commit }) {
    localStorage.removeItem(localStorageSessionTokenKey)
    commit('logout')
  },
  async authenticate ({ commit }, { token }) {
    const authentication = await this.$api.authentication.authenticate(token)
    if (!authentication.valid) {
      localStorage.delete()
    }
    return authentication
  }
}

const mutations = {
  login (state, authentication) {
    state.token = authentication.token
    state.user = authentication.user
    state.valid = authentication.valid
  },
  logout (state) {
    state = new Authentication()
  }
}

const getters = {
  isInspecteur (state) {
    return state.valid && state.user.type === 'inspecteur'
  },
  isApprobateur (state) {
    return state.valid && state.user.type === 'approbateur'
  },
  isExploitant (state) {
    return state.valid && state.user.type === 'exploitant'
  }
}

const state = () => new Authentication()

export const authentication = {
  namespaced: true,
  actions,
  mutations,
  getters,
  state
}
