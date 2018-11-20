import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// makes an action with a single mutation
const makeAction = type => ({ commit }, ...args) => {
  commit(type, ...args)
}

export default new Vuex.Store({
  state: {
    // mocked data
    themes: [
      "Rejets dans l'eau",
      "Rejets dans l'air",
      'Sûreté',
      'Produits chimiques',
      'Incendie',
      'COV'
    ]
  },
  getters: {
  },
  mutations: {
    addTheme (state, theme) {
      state.themes.push(theme)
    },
    removeTheme (state, theme) {
      const index = this.themes.indexOf(theme)
      if (index !== -1) {
        this.themes.splice(index, 1)
      }
    }
  },
  actions: {
    addTheme: makeAction('addTheme'),
    removeTheme: makeAction('removeTheme')
  }
})
