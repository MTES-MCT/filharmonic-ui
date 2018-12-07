export function createInitialStoreState (authenticationInfos) {
  return {
    authentication: authenticationInfos || {
      valid: false
    },
    inspectionsOuvertes: [],

    // utilisé si l'utilisateur navigue sur une page d'inspection
    inspectionOuverte: null
  }
}
