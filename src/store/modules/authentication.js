import { ADD_ROW, RESET } from '@/store/mutation-types'

const localStorageSessionTokenKey = 'fh-token'

const actions = {
  async login ({ commit }, { user, password }) {
    commit(RESET)
    const authentication = await this.$api.authentication.login(user, password)
    if (authentication.valid) {
      localStorage.setItem(localStorageSessionTokenKey, authentication.token)
      commit(ADD_ROW, authentication)
    }
    return authentication
  },
  async logout ({ commit }) {
    localStorage.removeItem(localStorageSessionTokenKey)
    commit(RESET)
  },
  async authenticate ({ commit }, { token }) {
    const authentication = await this.$api.authentication.authenticate(token)
    if (!authentication.valid) {
      localStorage.delete()
      commit(RESET)
    } else {
      commit(ADD_ROW, authentication)
    }
    return authentication
  }
}

const mutations = {
  [ADD_ROW] (state, authentication) {
    state.rows.push(authentication)
  },
  [RESET] (state) {
    state.rows = []
  }
}

const isAuthenticated = (state) => {
  return state.rows.length > 0 && state.rows[0].valid
}

const getters = {
  isAuthenticated (state) {
    return isAuthenticated(state)
  },
  isInspecteur (state) {
    return isAuthenticated(state) && state.rows[0].user.type === 'inspecteur'
  },
  isApprobateur (state) {
    return isAuthenticated(state) && state.rows[0].user.type === 'approbateur'
  },
  isExploitant (state) {
    return isAuthenticated(state) && state.rows[0].user.type === 'exploitant'
  }
}

const state = () => ({
  rows: []
})

export const authentication = {
  namespaced: true,
  actions,
  mutations,
  getters,
  state
}
