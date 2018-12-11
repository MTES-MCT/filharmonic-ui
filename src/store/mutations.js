export default {
  loadInspectionsOuvertes (state, inspectionsOuvertes) {
    state.inspectionsOuvertes = inspectionsOuvertes
  },
  loadInspection (state, inspection) {
    state.inspectionOuverte = inspection
  },
  login (state, authenticationInfos) {
    state.authentication = authenticationInfos
  },
  updateEchangeBrouillon (state, payload) {
    state.inspectionOuverte.echanges.find(echange => echange.id === payload.echangeId).brouillon = payload.brouillon
  }
}
