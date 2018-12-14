import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'
import sessionStorage from '@/store/sessionStorage'
import { createInitialStoreState } from '@/store/state'
import { menu } from '@/store/modules/menu'
import { auth } from '@/store/modules/auth'

Vue.use(Vuex)

export async function createStore (options = {}) {
  const api = options.api
  if (!api) {
    throw new Error('Missing `api` option')
  }

  const sessionToken = sessionStorage.load()

  const authenticationInfos = await api.authentication.authenticate(sessionToken)
  if (!authenticationInfos.valid) {
    sessionStorage.delete()
  }

  const store = new Vuex.Store({
    state: createInitialStoreState(authenticationInfos),
    strict: process.env.NODE_ENV !== 'production',
    modules: {
      auth: auth,
      menu: menu
    },
    plugins: [createLogger()]
  })

  // expose the API to the store
  store.$api = api

  // expose the store to the API
  api.store = store

  return store
}
