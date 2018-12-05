export function createInitialStoreState (authenticationInfos) {
  return {
    authentication: authenticationInfos || {
      valid: false
    },
    inspectionsOuvertes: []
  }
}
