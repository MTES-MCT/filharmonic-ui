const localStorageSessionTokenKey = 'fh-token'

export default {
  save (sessionToken) {
    localStorage.setItem(localStorageSessionTokenKey, sessionToken)
  },
  load () {
    return localStorage.getItem(localStorageSessionTokenKey)
  },
  delete () {
    return localStorage.removeItem(localStorageSessionTokenKey)
  }
}

