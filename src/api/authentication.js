import { ForbiddenError, UnknownServerError } from '@/errors'
import sessionStorage from '@/api/sessionStorage'
import BaseAPI from './base'

export default class AuthenticationAPI extends BaseAPI {
  async authenticate () {
    const token = sessionStorage.load()
    if (token) {
      try {
        const res = await this.request('post', 'authenticate', {
          token
        })
        const userInfos = await res.json()
        this.api.setAuthToken(token)
        return {
          valid: true,
          user: userInfos
        }
      } catch (err) {
        console.log('failed authentication', err) // eslint-disable-line no-console
        sessionStorage.delete()
      }
    }
    return null
  }

  async login (ticket) {
    const res = await this.request('post', 'login', {
      ticket
    })
    const authenticationInfos = await res.json()
    if (authenticationInfos) {
      sessionStorage.save(authenticationInfos.token)
      this.api.setAuthToken(authenticationInfos.token)
      this.api.store.commit('login', authenticationInfos.user)
    }
  }

  async logout () {
    sessionStorage.delete()
    await this.api.store.dispatch('logout')
  }

  async request (method, url, body, headers = {}) {
    const res = await fetch(`/api/${url}`, {
      method: method,
      body: body ? JSON.stringify(body) : null,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...headers
      }
    })

    // asserts that the response is json
    const contentType = res.headers.get('content-type')
    if (contentType && !contentType.startsWith('application/json')) {
      throw new UnknownServerError({
        message: 'Oops! Something seems wrong with the server (returned no JSON data)',
        additionnalMessage: await res.text()
      })
    }

    // asserts that the response is ok
    if (!res.ok) {
      const errorMessage = await res.json().message
      // TODO check if the error is known
      if (res.status === 401) {
        throw new ForbiddenError({
          message: 'Unauthorized',
          additionnalMessage: errorMessage
        })
      }
      throw new UnknownServerError({
        message: 'Oops! Something seems wrong with the server',
        additionnalMessage: errorMessage
      })
    }
    return res
  }
}
