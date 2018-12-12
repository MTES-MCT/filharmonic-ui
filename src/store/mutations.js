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
  },
  updateMessageLu (state, payload) {
    state.inspectionOuverte.echanges.find(echange => echange.messages.filter(message => message.id === payload.messageId).length > 0).messages.find(message => message.id === payload.messageId).lu = payload.lu
  }
}
