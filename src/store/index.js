import Vue from 'vue'
import Vuex from 'vuex'
import { listControlesOuverts } from '@/api/controles'

Vue.use(Vuex)

// makes an action with a single mutation
// const makeAction = type => ({ commit }, ...args) => {
//   commit(type, ...args)
// }

export default new Vuex.Store({
  state: {
    controlesOuverts: []
  },
  getters: {},
  mutations: {
    loadControlesOuverts (state, controlesOuverts) {
      state.controlesOuverts = controlesOuverts
    }
  },
  actions: {
    async loadControlesOuverts ({ commit }) {
      const controlesOuverts = await listControlesOuverts(1) // TODO récupérer les infos de l'utilisateur à partir du store
      commit('loadControlesOuverts', controlesOuverts)
    }
  }
})
