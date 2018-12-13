export function createInitialStoreState (authenticationInfos) {
  return {
    authentication: authenticationInfos || {
      valid: false
    },
    inspectionsFavorites: [],

    // utilisé si l'utilisateur navigue sur une page d'inspection
    inspectionOuverte: null
  }
}
