import BaseAPI from './base'

export default class AuthenticationAPI extends BaseAPI {
  async authenticate (sessionToken) {
    if (!sessionToken) {
      return {
        valid: false
      }
    }

    // TODO validation auprès de l'API
    return this.loginAsMockedUser(sessionToken.substring('valid-token-'.length))
  }

  async login (user, password) {
    // TODO validation auprès de l'API
    return this.loginAsMockedUser(user)
  }

  async loginAsMockedUser (idStr) {
    const user = await this.api.users.get(parseInt(idStr, 10))
    if (!user) {
      return {
        valid: false
      }
    }
    return {
      valid: true,
      sessionToken: `valid-token-${user.id}`,
      user: user
    }
  }
}
