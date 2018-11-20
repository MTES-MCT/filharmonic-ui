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
    users: [
      {
        id: 1,
        name: 'Alain Champion',
        email: 'alain.champion@developpement-durable.gouv.fr',
        photoURL: 'https://randomuser.me/api/portraits/men/85.jpg',
        type: 'inspecteur'
      },
      {
        id: 2,
        name: 'Corine Dupont',
        email: 'Corine.dupont@developpement-durable.gouv.fr',
        photoURL: 'https://randomuser.me/api/portraits/women/85.jpg',
        type: 'inspecteur'
      },
      {
        id: 3,
        name: 'Albert Valide',
        email: 'albert.valide@developpement-durable.gouv.fr',
        photoURL: 'https://randomuser.me/api/portraits/men/86.jpg',
        type: 'inspecteur',
        validateur: true
      },
      {
        id: 4,
        name: 'Michel Exploitant1',
        email: 'michel@exploitant1.fr',
        photoURL: 'https://randomuser.me/api/portraits/men/87.jpg',
        type: 'exploitant'
      }
    ],
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
    inspecteurs (state) {
      return state.users.filter(u => u.type === 'inspecteur')
    }
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
