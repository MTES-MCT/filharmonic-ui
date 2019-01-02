export default {
  loadInspectionsFavorites (state, inspectionsFavorites) {
    state.inspectionsFavorites = inspectionsFavorites
  },
  loadInspection (state, inspection) {
    state.inspectionOuverte = inspection
  },
  login (state, authenticationInfos) {
    state.authentication = authenticationInfos
  },
  updatePointDeControleBrouillon (state, payload) {
    state.inspectionOuverte.pointsDeControle.find(pointDeControle => pointDeControle.id === payload.pointDeControleId).brouillon = payload.brouillon
  },
  updateMessageLu (state, payload) {
    state.inspectionOuverte.pointsDeControle.find(pointDeControle => pointDeControle.messages.filter(message => message.id === payload.messageId).length > 0).messages.find(message => message.id === payload.messageId).lu = payload.lu
  },
  addMessage (state, payload) {
    const pointDeControle = state.inspectionOuverte.pointsDeControle.find(pointDeControle => pointDeControle.id === payload.pointDeControleId)
    if (pointDeControle !== undefined) {
      pointDeControle.messages.push(payload.message)
    } else {
      state.inspectionOuverte.comments.push(payload.message)
    }
  }
}
