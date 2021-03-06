import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'
import actions from '@/store/actions'
import getters from '@/store/getters'
import mutations from '@/store/mutations'
import { createInitialStoreState } from '@/store/state'

Vue.use(Vuex)

export async function createStore (options = {}) {
  const api = options.api
  if (!api) {
    throw new Error('Missing `api` option')
  }

  const authenticationInfos = await api.authentication.authenticate()

  const store = new Vuex.Store({
    state: createInitialStoreState(authenticationInfos),
    getters,
    mutations,
    actions,
    strict: process.env.NODE_ENV !== 'production',
    plugins: process.env.NODE_ENV !== 'production' ? [createLogger()] : []
  })

  // expose the API to the store
  store.$api = api

  // expose the store to the API
  api.store = store

  return store
}
