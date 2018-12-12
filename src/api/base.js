import { ForbiddenError } from '@/errors'

/*
BaseAPI est la classe dont héritent les API.
Elle permet aux services d'accéder au store pour connaitre l'utilisateur authentifié,
et d'accéder aux autres services.
*/
export default class BaseAPI {
  constructor (options = {}) {
    if (!options.api) {
      throw new Error('Missing `api` option')
    }
    this.api = options.api
  }

  // helpers
  requireAuthentication () {
    if (!this.api.store.state.authentication.valid) {
      throw new ForbiddenError('Il faut être authentifié')
    }
  }
  requireInspecteur () {
    if (!this.api.store.getters.isInspecteur) {
      throw new ForbiddenError('Il faut être inspecteur')
    }
  }
  requireApprobateur () {
    if (!this.api.store.getters.isApprobateur) {
      throw new ForbiddenError('Il faut être approbateur')
    }
  }
}
