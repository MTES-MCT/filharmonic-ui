export default {
  loadControlesOuverts (state, controlesOuverts) {
    state.controlesOuverts = controlesOuverts
  },
  login (state, authenticationInfos) {
    state.authentication = authenticationInfos
  },
  logout (state, authInfos) {
    state.authentication = {
      valid: false,
      sessionToken: '',
      user: {}
    }
  }
}
