import { getUser } from '@/api/users'

async function loginAsMockedUser (idStr) {
  const user = await getUser(parseInt(idStr, 10))
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

class UserAPI {
  authenticate (sessionToken) {
    if (!sessionToken) {
      return {
        valid: false
      }
    }

    // TODO validation auprès de l'API
    return loginAsMockedUser(sessionToken.substring('valid-token-'.length))
  }

  login (user, password) {
    // TODO validation auprès de l'API
    return loginAsMockedUser(user)
  }
}

export default new UserAPI()
