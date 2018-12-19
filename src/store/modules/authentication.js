import { Authentication } from '@/models/authentication'
import { DELETE } from '@/store/action-types'
import { ADD_ROW } from '@/store/mutation-types'

const localStorageSessionTokenKey = 'fh-token'

const actions = {
  async login ({ commit }, { user, password }) {
    const authentication = await this.$api.authentication.login(user, password)
    if (authentication.valid) {
      localStorage.setItem(localStorageSessionTokenKey, authentication.token)
      commit(ADD_ROW, authentication)
    }
    return authentication
  },
  async logout ({ commit }) {
    localStorage.removeItem(localStorageSessionTokenKey)
    commit(DELETE)
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
  [ADD_ROW] (state, authentication) {
    state.token = authentication.token
    state.user = authentication.user
    state.valid = authentication.valid
  },
  [DELETE] (state) {
    state.token = ''
    state.user = null
    state.valid = false
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
