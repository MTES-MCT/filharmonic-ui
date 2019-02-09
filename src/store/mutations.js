export default {
  loadInspection (state, inspection) {
    state.inspectionOuverte = inspection
  },
  loadNotifications (state, notifications) {
    state.notifications = notifications
  },
  login (state, userInfos) {
    state.authentication = {
      valid: true,
      user: userInfos
    }
  }
}
