class UserAPI {
  async authenticate (sessionToken) {
    // TODO validation auprès de l'API
    if (sessionToken !== 'valid-token') {
      return {
        valid: false
      }
    }
    const authenticationInfo = {
      valid: true,
      user: {
        id: 1,
        identifiant: 'alain.champion',
        nom: 'Alain Champion',
        profil: 'inspecteur',
        avatar: 'https://randomuser.me/api/portraits/men/85.jpg'
      }
    }
    return {
      valid: authenticationInfo.valid,
      sessionToken: sessionToken,
      user: authenticationInfo.user
    }
  }

  async login (user, password) {
    // TODO validation auprès de l'API
    const authenticationInfo = {
      valid: true,
      user: {
        id: 1,
        identifiant: 'alain.champion',
        nom: 'Alain Champion',
        profil: 'inspecteur',
        avatar: 'https://randomuser.me/api/portraits/men/85.jpg'
      }
    }
    return {
      valid: authenticationInfo.valid,
      sessionToken: 'valid-token',
      user: authenticationInfo.user
    }
  }
}

export default new UserAPI()
