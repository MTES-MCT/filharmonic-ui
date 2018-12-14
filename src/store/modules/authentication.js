import { Authentication } from '@/models/authentication'
import AuthenticationAPI from '@/api/authentication'

const localStorageSessionTokenKey = 'fh-token'

const actions = {
  async login ({ commit }, { user, password }) {
    const authenticationInfos = await AuthenticationAPI.login(user, password)
    if (authenticationInfos.valid) {
      sessionStorage.save(authenticationInfos.sessionToken)
      commit('login', authenticationInfos)
    }
    return authenticationInfos
  },
  async logout ({ commit }) {
    this.delete()
    this.replaceState(new Authentication())
  },
  async authenticate ({ commit }, { sessionToken }) {
    const authenticationInfos = await AuthenticationAPI.authenticate(sessionToken)
    if (!authenticationInfos.valid) {
      sessionStorage.delete()
    }
    return authenticationInfos
  }
}

const mutations = {
  login (state, authenticationInfos) {
    state = authenticationInfos
  },
  save (sessionToken) {
    sessionStorage.setItem(localStorageSessionTokenKey, sessionToken)
  },
  load () {
    return sessionStorage.getItem(localStorageSessionTokenKey)
  },
  delete () {
    return sessionStorage.removeItem(localStorageSessionTokenKey)
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

const state = () => ({
  token: sessionStorage.getItem(localStorageSessionTokenKey),
  valid: false,
  user: null
})

export const authentication = {
  namespaced: true,
  actions,
  mutations,
  getters,
  state
}
