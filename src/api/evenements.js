import { ApplicationError } from '@/errors'
import BaseAPI from './base'
import * as _ from '@/util'

const evenementsDB = [
  {
    id: 1,
    type: 'message',
    auteurId: 1,
    inspectionId: 1,
    created_at: new Date('2018-09-16T14:00:00'),
    data: {
      messageId: 1,
      pointDeControleId: 1
    }
  },
  {
    id: 2,
    type: 'commentaire_general',
    auteurId: 2,
    inspectionId: 2,
    created_at: new Date('2018-11-14T08:50:00'),
    data: {
      messageId: 2
    }
  },
  {
    id: 3,
    type: 'commentaire_general',
    auteurId: 1,
    inspectionId: 2,
    created_at: new Date('2018-11-16T16:50:00'),
    data: {
      messageId: 3
    }
  },
  {
    id: 4,
    type: 'message',
    auteurId: 1,
    inspectionId: 2,
    created_at: new Date('2018-11-16T14:00:00'),
    data: {
      messageId: 4,
      pointDeControleId: 2
    }
  },
  {
    id: 5,
    type: 'message',
    auteurId: 4,
    inspectionId: 2,
    created_at: new Date('2018-11-16T16:50:00'),
    data: {
      messageId: 5,
      pointDeControleId: 2
    }
  },
  {
    id: 6,
    type: 'message',
    auteurId: 1,
    inspectionId: 2,
    created_at: new Date('2018-11-17T12:55:00'),
    data: {
      messageId: 6,
      pointDeControleId: 2
    }
  },
  {
    id: 7,
    type: 'commentaire',
    auteurId: 2,
    inspectionId: 2,
    created_at: new Date('2018-11-14T08:50:00'),
    data: {
      messageId: 7,
      pointDeControleId: 2
    }
  },
  {
    id: 8,
    type: 'commentaire',
    auteurId: 1,
    inspectionId: 2,
    created_at: new Date('2018-11-16T16:50:00'),
    data: {
      messageId: 8,
      pointDeControleId: 2
    }
  },
  {
    id: 9,
    type: 'message',
    auteurId: 1,
    inspectionId: 2,
    created_at: new Date('2018-11-16T17:10:00'),
    data: {
      messageId: 9,
      pointDeControleId: 5
    }
  },
  {
    id: 10,
    type: 'message',
    auteurId: 4,
    inspectionId: 2,
    created_at: new Date('2018-11-17T08:50:00'),
    data: {
      messageId: 10,
      pointDeControleId: 5
    }
  }
]

export const evenements = {
  // workflow d'une inspection
  creation_inspection: {
    notifications: () => ['inspecteurs'],
    message (evenement) {
      return `a créé une inspection.`
    }
  },
  publication_inspection: {
    notifications: () => ['inspecteurs', 'exploitants'],
    message (evenement) {
      return `a publié une inspection.`
    }
  },
  demande_validation_inspection: {
    notifications: () => ['inspecteurs', 'approbateurs'],
    message (evenement) {
      return `a fait une demande de validation.`
    }
  },
  rejet_validation_inspection: {
    notifications: () => ['inspecteurs'],
    message (evenement) {
      return `a rejeté une demande de validation.`
    }
  },
  validation_inspection: {
    notifications: () => ['inspecteurs', 'exploitants'],
    message (evenement) {
      return `a validé une inspection.`
    }
  },

  // événements liés à une inspection
  modification_inspection: {
    notifications: () => ['inspecteurs'],
    message (evenement) {
      return `a modifié le détail de l'inspection.`
    }
  },
  creation_point_de_controle: {
    notifications: () => ['inspecteurs'],
    message (evenement) {
      return `a ajouté un point de contrôle.`
    }
  },
  modification_point_de_controle: {
    notifications: () => ['inspecteurs'],
    message (evenement) {
      return `a modifié un point de contrôle.`
    }
  },
  suppression_point_de_controle: {
    notifications: () => ['inspecteurs'],
    message (evenement) {
      return `a supprimé un point de contrôle.`
    }
  },
  publication_point_de_controle: {
    notifications: () => ['inspecteurs'],
    message (evenement) {
      return `a publié un point de contrôle.`
    }
  },
  creation_constat: {
    notifications: () => ['inspecteurs'],
    message (evenement) {
      return `a ajouté un constat.`
    }
  },
  suppression_constat: {
    notifications: () => ['inspecteurs'],
    message (evenement) {
      return `a supprimé un constat.`
    }
  },
  creation_suite: {
    notifications: () => ['inspecteurs'],
    message (evenement) {
      return `a ajouté une suite.`
    }
  },
  modification_suite: {
    notifications: () => ['inspecteurs'],
    message (evenement) {
      return `a modifié une suite.`
    }
  },
  suppression_suite: {
    notifications: () => ['inspecteurs'],
    message (evenement) {
      return `a supprimé une suite.`
    }
  },
  commentaire_general: {
    notifications: () => ['inspecteurs'],
    message (evenement) {
      return `a posté un commentaire général.`
    }
  },
  commentaire: {
    notifications: () => ['inspecteurs'],
    message (evenement) {
      return `a posté un commentaire.`
    }
  },
  message: {
    notifications (api) {
      return api.store.getters.isExploitant ? ['inspecteurs'] : ['exploitants']
    },
    message (evenement) {
      return `a posté un message.`
    }
  },
  lecture_message: {
    notifications (api) {
      return api.store.getters.isExploitant ? ['inspecteurs'] : ['exploitants']
    },
    message (evenement) {
      return `a lu un message.`
    }
  }
}

/*
Chaque action importante de l'application devrait faire donner lieu à un événement.
Ces événements peuvent ensuite être utilisés de plusieurs façons :
- notifications
- affichage de l'activité dans plusieurs vues (personne, inspection, etc)

Pour l'instant, les types d'événements sont :
- commentaire_general,
- message
- commentaire
*/
export default class EvenementsAPI extends BaseAPI {
  async list (options = {}) {
    let filteredEvenements = _.cloneDeep(evenementsDB)

    if (options.filter) {
      filteredEvenements = filteredEvenements.filter(options.filter)
    }

    return Promise.all(
      filteredEvenements
        // tri car les éléments mockés ne sont pas ordonnés
        .sort((a, b) => a.created_at < b.created_at ? -1 : 1)
        .map(async evenement => {
          if (options.auteur) {
            evenement.auteur = await this.api.users.get(evenement.auteurId)
          }
          return evenement
        })
    )
  }

  async get (evenementId, options) {
    const evenement = (await this.list({
      ...options,
      filter: evenement => evenement.id === evenementId
    }))[0]
    if (!evenement) {
      throw new ApplicationError(`Événement ${evenementId} non trouvé`)
    }
    return evenement
  }

  async create (evenement) {
    evenement.id = evenementsDB[evenementsDB.length - 1].id + 1
    evenement.created_at = new Date()
    evenement.auteurId = this.userId
    await this.createNotifications(evenement)
    evenementsDB.push(_.cloneDeep(evenement))
  }

  // permet de créer des notifications aux utilisateurs concernés selon le type d'événément
  async createNotifications (evenement) {
    const inspection = await this.api.inspections.get(evenement.inspectionId, {
      etablissement: true
    })

    const metadonneesEvenement = evenements[evenement.type]
    if (!metadonneesEvenement) {
      throw new ApplicationError(`Événement ${evenement.type} inconnu`)
    }

    const notifications = []
    function addNotification (userId) {
      notifications.push({
        userId: userId,
        evenementId: evenement.id
      })
    }

    const groupsToNotify = metadonneesEvenement.notifications(this.api)
    if (groupsToNotify.includes('inspecteurs')) {
      inspection.inspecteurs.filter(id => id !== this.userId).map(addNotification)
    }
    if (groupsToNotify.includes('exploitants')) {
      inspection.etablissement.responsablesIds.map(addNotification)
    }
    if (groupsToNotify.includes('approbateurs')) {
      (await this.api.users.listApprobateurs())
        .map(user => user.id)
        .filter(id => id !== this.userId)
        .map(addNotification)
    }

    await Promise.all(notifications.map(notification => this.api.notifications.create(notification)))
  }
}
