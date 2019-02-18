export default {
  loadInspection (state, inspection) {
    state.inspectionOuverte = inspection
  },
  loadInspectionsFavorites (state, inspectionsFavorites) {
    state.inspectionsFavorites = inspectionsFavorites
  },
  loadNotifications (state, notifications) {
    state.notifications = notifications
  },
  login (state, userInfos) {
    state.authentication = {
      valid: true,
      user: userInfos
    }
  },
  saveRechercheEtablissements (state, rechercheEtablissements) {
    state.rechercheEtablissements = rechercheEtablissements
  }
}
