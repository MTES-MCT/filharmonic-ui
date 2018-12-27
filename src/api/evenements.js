import BaseAPI from './base'
import * as _ from '@/util'
import { createEvenement } from '@/models/evenement'
import { ApplicationError } from '@/errors'

const evenements = [
  {
    id: 1,
    type: 1,
    auteurId: 1,
    inspectionId: 1,
    created: new Date('2018-09-16T14:00:00'),
    data: {
      messageId: 1,
      pointDeControleId: 1
    }
  },
  {
    id: 2,
    type: 3,
    auteurId: 2,
    inspectionId: 2,
    created: new Date('2018-11-14T08:50:00'),
    data: {
      messageId: 2
    }
  },
  {
    id: 3,
    type: 3,
    auteurId: 1,
    inspectionId: 2,
    created: new Date('2018-11-16T16:50:00'),
    data: {
      messageId: 3
    }
  },
  {
    id: 4,
    type: 2,
    auteurId: 1,
    inspectionId: 2,
    created: new Date('2018-11-16T14:00:00'),
    data: {
      messageId: 4,
      pointDeControleId: 2
    }
  },
  {
    id: 5,
    type: 2,
    auteurId: 4,
    inspectionId: 2,
    created: new Date('2018-11-16T16:50:00'),
    data: {
      messageId: 5,
      pointDeControleId: 2
    }
  },
  {
    id: 6,
    type: 2,
    auteurId: 1,
    inspectionId: 2,
    created: new Date('2018-11-17T12:55:00'),
    data: {
      messageId: 6,
      pointDeControleId: 2
    }
  },
  {
    id: 7,
    type: 2,
    auteurId: 2,
    inspectionId: 2,
    created: new Date('2018-11-14T08:50:00'),
    data: {
      messageId: 7,
      pointDeControleId: 2
    }
  },
  {
    id: 8,
    type: 2,
    auteurId: 1,
    inspectionId: 2,
    created: new Date('2018-11-16T16:50:00'),
    data: {
      messageId: 8,
      pointDeControleId: 2
    }
  },
  {
    id: 9,
    type: 1,
    auteurId: 1,
    inspectionId: 2,
    created: new Date('2018-11-16T14:10:00'),
    data: {
      messageId: 9,
      pointDeControleId: 5
    }
  },
  {
    id: 10,
    type: 1,
    auteurId: 4,
    inspectionId: 2,
    created: new Date('2018-11-17T08:50:00'),
    data: {
      messageId: 10,
      pointDeControleId: 5
    }
  }
]

const allowedTypes = [
  {
    id: 1,
    name: 'message'
  },
  {
    id: 2,
    name: 'commentaire'
  },
  {
    id: 3,
    name: 'commentaire_general'
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
  async list () {
    return Promise.all(
      _.cloneDeep(evenements)
        // tri car les éléments mockés ne sont pas ordonnés
        .sort((a, b) => a.created < b.created ? -1 : 1)
        .map(async evenement => {
          evenement.author = await this.api.users.get(evenement.auteurId)
          evenement.type = allowedTypes.find(t => t.id === evenement.type)
          return evenement
        })
    )
  }

  async get (id, options) {
    const evenement = (await this.list({
      ...options,
      filter: e => e.id === id
    }))[0]
    if (!evenement) {
      throw new ApplicationError(`Evénement ${id} non trouvé`)
    }
    return evenement
  }

  async create (evenement) {
    const newId = new Date().getTime() % 1000
    const newEvenement = createEvenement({
      id: newId,
      inspectionId: evenement.inspectionId,
      created: new Date(),
      type: allowedTypes.find(t => t.id === evenement.type),
      author: evenement.author,
      data: evenement.data
    })
    evenements.push(newEvenement)
    return newEvenement
  }
}
