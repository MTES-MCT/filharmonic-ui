export default {
  loadInspectionsOuvertes (state, inspectionsOuvertes) {
    state.inspectionsOuvertes = inspectionsOuvertes
  },
  loadInspection (state, inspection) {
    state.inspectionOuverte = inspection
  },
  login (state, authenticationInfos) {
    state.authentication = authenticationInfos
  }
}
