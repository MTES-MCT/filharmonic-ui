export default {
  loadInspectionsFavorites (state, inspectionsFavorites) {
    state.inspectionsFavorites = inspectionsFavorites
  },
  loadInspection (state, inspection) {
    state.inspectionOuverte = inspection
  },
  login (state, userInfos) {
    state.authentication = {
      valid: true,
      user: userInfos
    }
  }
}
