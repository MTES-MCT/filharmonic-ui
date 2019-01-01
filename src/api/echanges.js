import BaseAPI from '@/api/base'
import * as _ from '@/util'
import { ApplicationError } from '@/errors'
import { createEchange, Echange } from '@/models/echange'

const echanges = [
  {
    id: 1,
    brouillon: true,
    inspectionId: 1,
    sujet: 'Mesure des émissions atmosphériques canalisées par un organisme extérieur',
    referencesReglementaires: [
      "Articles 3.2.3., 3.2.8. et 8.2.1.2. de l'arrêté préfectoral du 28 juin 2017"
    ],
    messages: [1]
  },
  {
    id: 6,
    inspectionId: 1,
    brouillon: false,
    sujet: 'Autosurveillance des émissions canalisées de COV',
    referencesReglementaires: [
      "Article 8.2.1.1. de l'arrêté préfectoral du 28 juin 2017"
    ],
    messages: []
  },
  {
    id: 2,
    inspectionId: 2,
    brouillon: false,
    sujet: 'Mesure des émissions atmosphériques canalisées par un organisme extérieur',
    referencesReglementaires: [
      "Article 3.2.3. de l'arrêté préfectoral du 28 juin 2017",
      "Article 3.2.8. de l'arrêté préfectoral du 28 juin 2017",
      "Article 8.2.1.2. de l'arrêté préfectoral du 28 juin 2017"
    ],
    messages: [ 4, 5, 6, 7, 8 ],
    constat: 1
  },
  {
    id: 3,
    inspectionId: 2,
    brouillon: true,
    sujet: 'Atelier de malaxage filage',
    referencesReglementaires: [
      "Article 3.1 de l'arrêté préfectoral du 9 juin 1999"
    ],
    messages: [],
    constat: 2
  },
  {
    id: 4,
    inspectionId: 2,
    brouillon: true,
    sujet: 'Eau - Air',
    referencesReglementaires: [
      "Article 1 de l'Arrêté ministériel du 28 avril 2014"
    ],
    messages: [],
    constat: 3
  },
  {
    id: 5,
    inspectionId: 2,
    brouillon: true,
    sujet: 'Autosurveillance des émissions canalisées de COV',
    referencesReglementaires: [
      "Article 8.2.1.1. de l'arrêté préfectoral du 28 juin 2017"
    ],
    messages: [ 9, 10 ],
    constat: 4
  }
]
export default class EchangesAPI extends BaseAPI {
  async list (options = {}) {
    let filtered = _.cloneDeep(echanges)
    if (options.filter) {
      filtered = filtered.filter(options.filter)
    }
    return Promise.all(
      filtered.map(async echange => {
        if (echange.constat) {
          echange.constat = await this.api.constats.get(echange.constat)
        }
        return _.cloneDeep(echange)
      })
    )
  }
  async get (id, options) {
    const echange = (await this.list({
      ...options,
      filter: echange => echange.id === id
    }))[0]
    if (!echange) {
      throw new ApplicationError(`Echange ${id} non trouvé`)
    }
    return echange
  }
  async listByInspection (inspectionId, options) {
    return this.list({
      ...options,
      filter: echange => echange.inspectionId === inspectionId
    })
  }
  async save (echange) {
    this.requireInspecteur()
    const newEchange = new Echange()
    if (echange.id > 0) {
      Object.assign(newEchange, echanges.find(e => e.id === echange.id))
      Object.assign(newEchange, echange)
    } else {
      Object.assign(newEchange, createEchange(echange))
      newEchange.id = new Date().getTime() % 1000
      echanges.push(newEchange)
    }
    return newEchange
  }
}
