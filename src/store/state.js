export function createInitialStoreState (authenticationInfos) {
  return {
    authentication: authenticationInfos || {
      valid: false
    },
    // utilisé si l'utilisateur navigue sur une page d'inspection
    inspectionOuverte: null,
    notifications: [],
    rechercheEtablissements: {
      filter: {},
      results: []
    }
  }
}
