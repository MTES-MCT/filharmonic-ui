import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'
import AuthenticationAPI from '@/api/authentication'
import actions from './actions'
import mutations from './mutations'
import sessionStorage from '@/store/sessionStorage'

Vue.use(Vuex)

export async function createStore () {
  const sessionToken = sessionStorage.load()
  const authenticationInfos = await AuthenticationAPI.authenticate(sessionToken)

  return new Vuex.Store({
    state: {
      authentication: authenticationInfos,
      controlesOuverts: []
    },
    getters: {},
    mutations,
    actions,
    strict: process.env.NODE_ENV !== 'production',
    plugins: [createLogger()]
  })
}
