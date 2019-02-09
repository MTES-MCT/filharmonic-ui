import { ForbiddenError, UnknownServerError } from '@/errors'
import sessionStorage from '@/api/sessionStorage'
import EvenementsAPI from './evenements'
import LettresAPI from './lettres'

export default class API {
  constructor (options = {}) {
    this.evenements = new EvenementsAPI({
      api: this
    })
    this.lettres = new LettresAPI({
      api: this
    })

    this.authentication = {
      authenticate: async () => {
        const token = sessionStorage.load()
        if (token) {
          try {
            const res = await this.request('post', 'authenticate',
              {
                token
              })
            const userInfos = await res.json()
            this.setAuthToken(token)
            if (!userInfos.hasOwnProperty('favoris')) {
              userInfos.favoris = []
            }
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
      },
      login: async (ticket) => {
        const res = await this.request('post', 'login',
          {
            ticket
          })
        const authenticationInfos = await res.json()
        if (authenticationInfos) {
          sessionStorage.save(authenticationInfos.token)
          this.setAuthToken(authenticationInfos.token)
          if (!authenticationInfos.user.hasOwnProperty('favoris')) {
            authenticationInfos.user.favoris = []
          }
          this.store.commit('login', authenticationInfos.user)
        }
      },
      loadUser: async () => {
        const user = await this.authRequestJson('get', 'user')
        if (!user.hasOwnProperty('favoris')) {
          user.favoris = []
        }
        this.store.commit('login', user)
      },
      refreshUser: () => {
        return this.authentication.loadUser()
      },
      logout: () => {
        sessionStorage.delete()
        this.store.dispatch('logout')
      }
    }

    this.users = {
      listInspecteurs: () => {
        return this.authRequestJson('get', 'inspecteurs')
      }
    }

    this.etablissements = {
      list: filter => {
        const search = new URLSearchParams()
        Object.keys(filter).forEach(key => {
          search.set(key, filter[key])
        })
        return this.authRequestJson('get', 'etablissements?' + search.toString())
      },
      get: etablissementId => {
        return this.authRequestJson('get', `etablissements/${etablissementId}`)
      }
    }

    this.inspections = {
      list: () => {
        return this.authRequestJson('get', 'inspections')
      },
      get: inspectionId => {
        return this.authRequestJson('get', `inspections/${inspectionId}`)
      },
      ajouterPieceJointe: async pieceJointeData => {
        const formData = new FormData()
        formData.append('file', pieceJointeData.file)
        formData.append('filename', pieceJointeData.filename)
        formData.append('size', pieceJointeData.size)
        const res = await fetch(`/api/piecesjointes`, {
          method: 'post',
          body: formData,
          headers: {
            'Authorization': this.authToken,
            'Accept': '*/*'
          }
        })
        if (!res.ok) {
          if (res.status === 401) {
            throw new ForbiddenError({
              message: 'Unauthorized'
              // additionnalMessage: errorMessage
            })
          }
          throw new UnknownServerError({
            message: 'Oops! Something seems wrong with the server'
            // additionnalMessage: errorMessage
          })
        }
        return (await res.json()).id
      },
      getPieceJointe: async pieceJointeId => {
        const res = await fetch(`/api/piecesjointes/${pieceJointeId}`, {
          method: 'get',
          headers: {
            'Authorization': this.authToken,
            'Accept': '*/*'
          }
        })
        if (!res.ok) {
          if (res.status === 401) {
            throw new ForbiddenError({
              message: 'Unauthorized'
              // additionnalMessage: errorMessage
            })
          }
          throw new UnknownServerError({
            message: 'Oops! Something seems wrong with the server'
            // additionnalMessage: errorMessage
          })
        }
        const blob = await res.blob()
        return URL.createObjectURL(blob)
      },
      lireMessage: async messageId => {
        await this.authRequestJson('post', `messages/${messageId}/lire`)
        await this.inspections.refreshInspectionOuverte()
      },
      ajouterMessage: async (pointDeControleId, message) => {
        await this.authRequestJson('post', `pointsdecontrole/${pointDeControleId}/messages`, message)
        await this.inspections.refreshInspectionOuverte()
      },
      ajouterCommentaire: async (inspectionId, commentaire) => {
        await this.authRequestJson('post', `inspections/${inspectionId}/commentaires`, commentaire)
        await this.inspections.refreshInspectionOuverte()
      },
      save: async (updatedInspection) => {
        await this.authRequestJson('put', `inspections/${updatedInspection.id}`, updatedInspection)
        await this.inspections.refreshInspectionOuverte()
      },
      ajouterPointDeControle: async (inspectionId, pointDeControle) => {
        await this.authRequestJson('post', `inspections/${inspectionId}/pointsdecontrole`, pointDeControle)
        await this.inspections.refreshInspectionOuverte()
      },
      modifierPointDeControle: async (pointDeControleId, pointDeControle) => {
        await this.authRequestJson('put', `pointsdecontrole/${pointDeControleId}`, pointDeControle)
        await this.inspections.refreshInspectionOuverte()
      },
      supprimerPointDeControle: async pointDeControleId => {
        await this.authRequestJson('delete', `pointsdecontrole/${pointDeControleId}`)
        await this.inspections.refreshInspectionOuverte()
      },
      publierPointDeControle: async pointDeControleId => {
        await this.authRequestJson('post', `pointsdecontrole/${pointDeControleId}/publier`)
        await this.inspections.refreshInspectionOuverte()
      },
      addFavori: async idInspection => {
        await this.authRequestJson('post', `inspections/${idInspection}/favori`)
        await this.authentication.refreshUser()
      },
      removeFavori: async idInspection => {
        await this.authRequestJson('delete', `inspections/${idInspection}/favori`)
        await this.authentication.refreshUser()
      },
      ajouterConstat: async (pointDeControleId, constat) => {
        await this.authRequestJson('post', `pointsdecontrole/${pointDeControleId}/constat`, constat)
        await this.inspections.refreshInspectionOuverte()
      },
      supprimerConstat: async (pointDeControleId) => {
        await this.authRequestJson('delete', `pointsdecontrole/${pointDeControleId}/constat`)
        await this.inspections.refreshInspectionOuverte()
      },
      creerSuite: async (inspectionId, suite) => {
        await this.authRequestJson('post', `inspections/${inspectionId}/suite`, suite)
        await this.inspections.refreshInspectionOuverte()
      },
      modifierSuite: async (inspectionId, suite) => {
        await this.authRequestJson('put', `inspections/${inspectionId}/suite`, suite)
        await this.inspections.refreshInspectionOuverte()
      },
      supprimerSuite: async (inspectionId) => {
        await this.authRequestJson('delete', `inspections/${inspectionId}/suite`)
        await this.inspections.refreshInspectionOuverte()
      },
      publier: async (inspectionId) => {
        await this.authRequestJson('post', `inspections/${inspectionId}/publier`)
        await this.inspections.refreshInspectionOuverte()
      },
      demanderValidation: async (inspectionId) => {
        await this.authRequestJson('post', `inspections/${inspectionId}/demandervalidation`)
        await this.inspections.refreshInspectionOuverte()
      },
      rejeter: async (inspectionId) => {
        await this.authRequestJson('post', `inspections/${inspectionId}/rejeter`)
        await this.inspections.refreshInspectionOuverte()
      },
      valider: async (inspectionId) => {
        await this.authRequestJson('post', `inspections/${inspectionId}/valider`)
        await this.inspections.refreshInspectionOuverte()
      },

      // interne
      refreshInspectionOuverte: () => {
        this.notifications.refreshNotifications()
        return this.inspections.loadInspection(this.store.state.inspectionOuverte.id)
      },
      loadInspection: async inspectionId => {
        if (typeof inspectionId !== 'number') {
          throw new TypeError(`expected number, got: \`${typeof inspectionId}\``)
        }
        const inspection = await this.inspections.get(inspectionId)
        if (inspection.points_de_controle === undefined) {
          inspection.points_de_controle = []
        } else {
          inspection.points_de_controle.forEach(pointDeControle => {
            if (pointDeControle.messages === undefined) {
              pointDeControle.messages = []
            }
          })
        }
        this.store.commit('loadInspection', inspection)
      }
    }

    this.themes = {
      list: () => {
        return this.authRequestJson('get', 'themes')
      },
      create: (theme) => {
        return this.authRequestJson('post', 'themes', theme)
      },
      delete: (themeId) => {
        return this.authRequestJson('delete', `themes/${themeId}`)
      }
    }

    this.notifications = {
      list: async () => {
        return this.authRequestJson('get', 'notifications')
      },
      create: async (notification) => {
        await this.authRequestJson('post', 'notifications', notification)
        await this.notifications.refreshNotifications()
      },
      lire: async (ids) => {
        await this.authRequestJson('post', `notifications/lire`, ids)
        await this.notifications.refreshNotifications()
      },
      refreshNotifications: () => {
        return this.notifications.loadNotifications()
      },
      loadNotifications: async () => {
        const notifications = await this.notifications.list()
        this.store.commit('loadNotifications', notifications)
      }
    }
  }

  setAuthToken (token) {
    this.authToken = token
  }

  async authRequestJson (method, url, body, headers = {}) {
    const response = await this.authRequest(method, url, body, headers)
    return response.json()
  }

  async authRequest (method, url, body, headers = {}) {
    headers['Authorization'] = this.authToken
    return this.request(method, url, body, headers)
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
