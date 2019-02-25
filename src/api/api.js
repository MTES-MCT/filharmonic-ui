import { ForbiddenError, UnknownServerError, ApplicationError, UnauthorizedError } from '@/errors'
import sessionStorage from '@/api/sessionStorage'
import LettresAPI from './lettres'
import { Etablissement, User } from './models'

export default class API {
  constructor (options = {}) {
    this.lettres = new LettresAPI({
      api: this
    })

    this.authentication = {
      authenticate: async () => {
        const token = sessionStorage.load()
        if (token) {
          try {
            const userInfos = await this.requestJson('post', 'authenticate', {
              token
            })
            this.setAuthToken(token)
            return {
              valid: true,
              user: new User(userInfos)
            }
          } catch (err) {
            console.log('failed authentication', err) // eslint-disable-line no-console
            sessionStorage.delete()
          }
        }
        return null
      },
      login: async (ticket) => {
        const authenticationInfos = await this.requestJson('post', 'login', {
          ticket
        })
        if (authenticationInfos) {
          sessionStorage.save(authenticationInfos.token)
          this.setAuthToken(authenticationInfos.token)
          this.store.commit('login', new User(authenticationInfos.user))
        }
      },
      logout: async (cerbereLogout = false) => {
        await this.authRequest('post', 'logout')
        sessionStorage.delete()
        if (cerbereLogout) {
          const iframe = document.createElement('iframe')
          iframe.src = 'https://authentification.din.developpement-durable.gouv.fr/cas/public/logout'
          document.body.appendChild(iframe)
        }
        this.store.dispatch('logout')
      }
    }

    this.users = {
      listInspecteurs: async () => {
        const inspecteurs = await this.authRequestJson('get', 'inspecteurs')
        return inspecteurs.map(i => new User(i))
      }
    }

    this.etablissements = {
      list: async (filter = {}) => {
        const search = new URLSearchParams()
        Object.keys(filter).forEach(key => {
          search.set(key, filter[key])
        })
        const results = await this.authRequestJson('get', 'etablissements?' + search.toString())
        results.etablissements = results.etablissements.map(e => new Etablissement(e))
        return results
      },
      get: async etablissementId => {
        const etablissement = await this.authRequestJson('get', `etablissements/${etablissementId}`)
        return new Etablissement(etablissement)
      }
    }

    this.inspections = {
      list: async (options = {}) => {
        let queryParams = ''
        if (options.assigned) {
          queryParams += '?assigned=true'
        }
        const inspections = await this.authRequestJson('get', 'inspections' + queryParams)
        inspections.forEach(inspection => {
          inspection.etablissement = new Etablissement(inspection.etablissement)
        })
        return inspections
      },
      get: async inspectionId => {
        const inspection = await this.authRequestJson('get', `inspections/${inspectionId}`)

        inspection.inspecteurs = inspection.inspecteurs.map(i => new User(i))
        inspection.etablissement = new Etablissement(inspection.etablissement)
        if (inspection.points_de_controle === undefined) {
          inspection.points_de_controle = []
        } else {
          inspection.points_de_controle.forEach(pointDeControle => {
            if (pointDeControle.messages === undefined) {
              pointDeControle.messages = []
            }
          })
        }
        if (inspection.evenements === undefined) {
          inspection.evenements = []
        }
        if (inspection.commentaires === undefined) {
          inspection.commentaires = []
        }
        const filtreAutreMessages = this.store.getters.isExploitant ? message => message.auteur.profile !== 'exploitant' : message => message.auteur.profile === 'exploitant'
        inspection.points_de_controle.forEach(pointDeControle => {
          pointDeControle.messagesNonLus = pointDeControle.messages
            .filter(filtreAutreMessages)
            .reduce((accMessages, message) => accMessages + (message.lu ? 0 : 1), 0)
        })
        return inspection
      },
      ajouterPieceJointe: async pieceJointeData => {
        const formData = new FormData()
        formData.append('file', pieceJointeData.file)
        formData.append('filename', pieceJointeData.filename)
        formData.append('size', pieceJointeData.size)
        const res = await this.authFormDataRequestJson('post', 'piecesjointes', formData)
        return res.id
      },
      getPieceJointe: pieceJointeId => {
        return this.authRequestBlob('get', `piecesjointes/${pieceJointeId}`)
      },
      genererLettreAnnonce: async inspectionId => {
        return this.authRequestBlob('get', `inspections/${inspectionId}/lettreannonce`)
      },
      genererLettreSuite: async inspectionId => {
        return this.authRequestBlob('get', `inspections/${inspectionId}/lettresuite`)
      },
      genererRapport: async inspectionId => {
        return this.authRequestBlob('get', `inspections/${inspectionId}/rapport`)
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
      create: async (inspection) => {
        const body = await this.authRequestJson('post', 'inspections', inspection)
        return body.id
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
        await this.inspections.refreshInspectionsFavorites()
      },
      removeFavori: async idInspection => {
        await this.authRequestJson('delete', `inspections/${idInspection}/favori`)
        await this.inspections.refreshInspectionsFavorites()
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
      refreshInspectionsFavorites: async () => {
        const inspectionsFavorites = await this.authRequestJson('get', 'inspectionsfavorites')
        inspectionsFavorites.forEach(inspection => {
          inspection.etablissement = new Etablissement(inspection.etablissement)
        })
        this.store.commit('loadInspectionsFavorites', inspectionsFavorites)
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

  async authFormDataRequestJson (method, url, body) {
    const res = await this.authRequest(method, url, body)
    await this.handleErrors(res)
    await this.ensureJsonResponse(res)
    return res.json()
  }

  async authRequestBlob (method, url, body) {
    const res = await this.authRequest(method, url, body)
    await this.handleErrors(res)
    return URL.createObjectURL(await res.blob())
  }

  async authRequestJson (method, url, body, headers = {}) {
    headers.Authorization = this.authToken
    return this.requestJson(method, url, body, headers)
  }

  async requestJson (method, url, body, headers = {}) {
    const res = await this.request(method, url, body, {
      'Content-Type': 'application/json',
      ...headers
    })
    await this.handleErrors(res)
    await this.ensureJsonResponse(res)
    return res.json()
  }

  async authRequest (method, url, body, headers = {}) {
    headers.Authorization = this.authToken
    return this.request(method, url, body, headers)
  }

  request (method, url, body, headers) {
    return fetch(`/api/${url}`, {
      method: method,
      body: body ? (body instanceof FormData ? body : JSON.stringify(body)) : null,
      headers: {
        Accept: '*/*',
        ...headers
      }
    })
  }

  // asserts that the response is ok
  async handleErrors (res) {
    if (!res.ok) {
      await this.ensureJsonResponse(res)
      const errorMessage = (await res.json()).message || 'Une erreur est survenue'
      if (res.status === 400) {
        throw new ApplicationError({
          message: errorMessage
        })
      }
      if (res.status === 401) {
        throw new UnauthorizedError({
          message: errorMessage
        })
      }
      if (res.status === 403) {
        throw new ForbiddenError({
          message: errorMessage
        })
      }
      throw new UnknownServerError({
        message: errorMessage
      })
    }
  }

  async ensureJsonResponse (res) {
    const contentType = res.headers.get('content-type')
    if (!contentType || !contentType.startsWith('application/json')) {
      throw new UnknownServerError({
        message: `Il semble y avoir un problème de configuration du serveur. Veuillez contacter l'administrateur.`,
        additionnalMessage: await res.text()
      })
    }
  }
}
