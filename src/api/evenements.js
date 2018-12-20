import { ApplicationError } from '@/errors'
import BaseAPI from './base'
import * as _ from '@/util'

const evenements = [
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
    let filteredEvenements = _.cloneDeep(evenements)

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
    evenement.id = evenements[evenements.length - 1].id + 1
    evenement.created_at = new Date()
    await this.createNotifications(evenement)
    evenements.push(_.cloneDeep(evenement))
  }

  // permet de créer des notifications aux utilisateurs concernés selon le type d'événément
  async createNotifications (evenement) {
    const currentUserId = this.api.store.state.authentication.user.id
    const inspection = await this.api.inspections.get(evenement.inspectionId, {
      etablissement: true
    })
    const notifications = []

    function addNotification (userId) {
      notifications.push({
        userId: userId,
        evenementId: evenement.id
      })
    }

    function notifierInspecteurs () {
      inspection.inspecteurs.filter(id => id !== currentUserId).map(addNotification)
    }
    function notifierExploitants () {
      inspection.etablissement.responsablesIds.map(addNotification)
    }
    function notifierInspecteursEtExploitants () {
      notifierInspecteurs()
      notifierExploitants()
    }
    const notifierApprobateursEtInspecteurs = async () => {
      (await this.api.users.listApprobateurs())
        .map(user => user.id)
        .filter(id => id !== currentUserId)
        .map(addNotification)
      notifierInspecteurs()
    }

    switch (evenement.type) {
      // workflow d'une inspection
      case 'creation_inspection': notifierInspecteurs(); break
      case 'publication_inspection': notifierInspecteursEtExploitants(); break
      case 'demande_validation_inspection': await notifierApprobateursEtInspecteurs(); break
      case 'rejet_validation_inspection': notifierInspecteurs(); break
      case 'validation_inspection': notifierInspecteursEtExploitants(); break

      // événements liés à une inspection
      case 'modification_inspection': notifierInspecteurs(); break
      case 'creation_pointdecontrole': notifierInspecteurs(); break
      case 'creation_constat': notifierInspecteurs(); break
      case 'modification_suite': notifierInspecteurs(); break
      case 'suppression_suite': notifierInspecteurs(); break
      case 'commentaire_general': notifierInspecteurs(); break
      case 'commentaire': notifierInspecteurs(); break
      case 'message':
        if (this.api.store.getters.isExploitant) {
          notifierInspecteurs()
        } else {
          notifierExploitants()
        }
        break
      default:
        throw new ApplicationError(`Événement ${evenement.type} inconnu`)
    }
    await Promise.all(notifications.map(notification => this.api.notifications.create(notification)))
  }
}
