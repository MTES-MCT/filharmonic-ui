export default {
  // permissions
  isInspecteur (state) {
    return state.authentication.valid && state.authentication.user.profile === 'inspecteur'
  },
  isApprobateur (state) {
    return state.authentication.valid && state.authentication.user.profile === 'approbateur'
  },
  isExploitant (state) {
    return state.authentication.valid && state.authentication.user.profile === 'exploitant'
  },
  user (state) {
    return state.authentication.user
  }
}
