export default {
  // permissions
  isInspecteur (state) {
    return state.authentication.user.type === 'inspecteur'
  },
  isApprobateur (state) {
    return state.authentication.user.type === 'approbateur'
  },
  isExploitant (state) {
    return state.authentication.user.type === 'exploitant'
  }
}
