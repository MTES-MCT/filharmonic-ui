import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'
import AuthenticationAPI from '@/api/authentication'
import actions from '@/store/actions'
import mutations from '@/store/mutations'
import sessionStorage from '@/store/sessionStorage'
import { createInitialStoreState } from '@/store/state'

Vue.use(Vuex)

export async function createStore () {
  const sessionToken = sessionStorage.load()
  const authenticationInfos = await AuthenticationAPI.authenticate(sessionToken)
  if (!authenticationInfos.valid) {
    sessionStorage.delete()
  }

  return new Vuex.Store({
    state: createInitialStoreState(authenticationInfos),
    getters: {},
    mutations,
    actions,
    strict: process.env.NODE_ENV !== 'production',
    plugins: [createLogger()]
  })
}
