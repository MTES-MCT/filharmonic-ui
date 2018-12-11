/*
BaseAPI est la classe dont héritent les API.
Elle permet aux services d'accéder au store pour connaitre l'utilisateur authentifié,
et d'accéder aux autres services.
*/
export default class BaseAPI {
  constructor (options = {}) {
    // if (!options.store) {
    //   throw new Error('Missing `store` option')
    // }
    if (!options.api) {
      throw new Error('Missing `api` option')
    }
    // this.store = options.store
    this.api = options.api
  }

  // helpers
  requireAuthentication () {
    if (!this.api.store.state.authentication.valid) {
      throw new Error('user not authenticated')
    }
  }
  requireInspecteur () {
    if (!this.api.store.getters.isInspecteur) {
      throw new Error('Il faut être inspecteur')
    }
  }
  requireApprobateur () {
    if (!this.api.store.getters.isApprobateur) {
      throw new Error('Il faut être approbateur')
    }
  }
}
