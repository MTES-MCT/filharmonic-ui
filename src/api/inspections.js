import { ApplicationError } from '@/errors'
import BaseAPI from './base'
import * as _ from '@/util'
import { nomsEtatsEnCours } from '@/models/etat'

const inspections = [
  {
    id: 1,
    date: '2018-09-10',
    type: 'approfondi',
    annonce: true,
    origine: 'plan_de_controle',
    favorite: false,
    etat: 'en_cours',
    contexte: 'Emissions de NOx dépassant les seuils le 2/04/2005',
    themes: [2, 6],
    inspecteurs: [1],
    etablissementId: '0999.00002',
    comments: [],
    suites: []
  },
  {
    id: 2,
    date: '2018-11-15',
    type: 'approfondi',
    annonce: true,
    origine: 'plan_de_controle',
    favorite: true,
    etat: 'attente_validation',
    contexte: 'Incident cuve gaz le 30/12/2017',
    themes: [1, 2, 5, 6],
    inspecteurs: [1, 2],
    etablissementId: '0999.00001',
    comments: [
      {
        id: 2,
        authorId: 2,
        text: "Attention à l'article 243.",
        date: new Date('2018-11-14T08:50:00'),
        confidential: true,
        lu: true,
        attachments: []
      },
      {
        id: 3,
        authorId: 1,
        text: "L'article 843 s'applique également.",
        date: new Date('2018-11-16T16:50:00'),
        confidential: true,
        lu: true,
        attachments: []
      }
    ],
    suites: [1]
  }
]

export default class InspectionsAPI extends BaseAPI {
  /*
  options = {
    filter: function : utilisé pour filtrer les résultats
    etablissement: bool : récupère l'établissement
    activite: bool : récupère l'activité
    messagesNonLus: bool : calcule le nombre de messages non lus
  }
  */
  async list (options = {}) {
    let filteredInspections = _.cloneDeep(inspections)
    if (options.filter) {
      filteredInspections = filteredInspections.filter(options.filter)
    }
    return Promise.all(
      filteredInspections.map(async inspection => {
        if (options.themes) {
          inspection.themes = (await this.api.themes.list()).filter(t => (inspection.themes.includes(t.id)))
        }
        if (options.echanges) {
          inspection.echanges = await this.api.echanges.listByInspection(inspection.id)
          if (options.detailMessagesNonLus) {
            inspection.echanges.forEach(async echange => {
              echange.messages = await this.api.messages.listByEchange(echange.id)
              echange.messagesNonLus = echange.messages.reduce((accMessages, message) => accMessages + (message.lu ? 0 : 1), 0)
            })
          }
          if (options.messagesNonLus) {
            inspection.messagesNonLus = inspection.comments.reduce((accMessages, message) => accMessages + (message.lu ? 0 : 1), 0) +
              inspection.echanges.reduce(async (acc, echange) => (
                acc +
                (await this.api.messages.listByEchange(echange.id)).reduce((accMessages, message) => accMessages + (message.lu ? 0 : 1), 0)
              ), 0)
          }
        }
        if (options.inspecteurs) {
          inspection.inspecteurs = (await this.api.users.list()).filter(u => (inspection.inspecteurs.includes(u.id)))
        }
        if (options.etablissement) {
          inspection.etablissement = await this.api.etablissements.get(inspection.etablissementId)
        }
        if (options.activite) {
          inspection.evenements = (await this.api.evenements.list()).filter(event => event.inspectionId === inspection.id)
        }
        if (options.suites) {
          inspection.suites = (await this.api.suites.list()).filter(s => s.inspectionId === inspection.id)
        }
        return _.cloneDeep(inspection)
      })
    )
  }

  async get (inspectionId, options) {
    const inspection = (await this.list({
      ...options,
      filter: inspection => inspection.id === inspectionId
    }))[0]
    if (!inspection) {
      throw new ApplicationError(`Inspection ${inspectionId} non trouvée`)
    }
    return inspection
  }

  async create (inspection) {
    this.requireInspecteur()
    inspection.id = new Date().getTime() % 1000
    inspection.etat = 'en_cours'
    inspection.echanges = []
    inspection.comments = []
    inspection.suites = []
    inspections.push(_.cloneDeep(inspection))
    this.api.evenements.create({
      type: 'create_inspection',
      auteurId: 1, // TODO récupérer l'utilisateur authentifié
      inspectionId: inspection.id
    })
    return inspection.id
  }

  async save (updatedInspection) {
    this.requireInspecteur()
    const inspection = inspections.find(i => i.id === updatedInspection.detail.id)
    // on devrait nettoyer l'objet pour ne garder que les champs autorisés
    Object.assign(inspection, _.cloneDeep(updatedInspection))
  }

  async valider (inspectionId, approbateurId) {
    this.requireApprobateur()
    const inspection = inspections.find(i => i.id === inspectionId)
    inspection.etat = 'valide'
    inspection.approbation = {
      auteur: approbateurId,
      date: new Date()
    }
    this.api.evenements.create({
      type: 'validation_inspection',
      auteurId: approbateurId,
      inspectionId: inspection.id
    })
    await _.sleep(1000)
  }

  // helpers
  async listByEtablissement (etablissementId, options) {
    return this.list({
      ...options,
      filter: inspection => inspection.etablissementId === etablissementId
    })
  }
  async listAssigned (userId, options) {
    return this.list({
      ...options,
      filter: inspection => inspection.inspecteurs.includes(userId)
    })
  }
  async listAssignedOuvertes (userId, options) {
    return this.list({
      ...options,
      filter: inspection => inspection.inspecteurs.includes(userId) && nomsEtatsEnCours.includes(inspection.etat)
    })
  }
}
