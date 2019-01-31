import { ForbiddenError, UnknownServerError } from '@/errors'
import AuthenticationAPI from './authentication'
// import EtablissementsAPI from './etablissements'
import EvenementsAPI from './evenements'
// import InspectionsAPI from './inspections'
import LettresAPI from './lettres'
import NotificationsAPI from './notifications'
import ThemesAPI from './themes'
// import UsersAPI from './users'

export default class API {
  constructor (options = {}) {
    this.authentication = new AuthenticationAPI({
      api: this
    })
    this.evenements = new EvenementsAPI({
      api: this
    })
    this.lettres = new LettresAPI({
      api: this
    })
    this.notifications = new NotificationsAPI({
      api: this
    })
    this.themes = new ThemesAPI({
      api: this
    })

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

      // interne
      refreshInspectionOuverte: () => {
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
      },

      loadInspectionsFavorites: async () => {
        const inspectionsFavorites = await this.api.inspections.listInspectionsFavorites({
          etablissement: true
        })
        this.store.commit('loadInspectionsFavorites', inspectionsFavorites)
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
