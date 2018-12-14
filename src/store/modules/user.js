import { getField } from 'vuex-map-fields'

import { User } from '@/models/user'

const getters = {
  getField,
  isInspecteur (state) {
    return state.user.type === 'inspecteur'
  },
  isApprobateur (state) {
    return state.user.type === 'approbateur'
  },
  isExploitant (state) {
    return state.user.type === 'exploitant'
  }
}

const state = () => ({
  rows: [new User()]
})

export default {
  namespaced: true,
  getters,
  state
}
