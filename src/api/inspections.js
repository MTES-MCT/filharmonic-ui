import { ApplicationError } from '@/errors'
import BaseAPI from './base'
import * as _ from '@/util'

const inspections = [
  {
    id: 1,
    date: '2018-09-10',
    type: 'approfondi',
    annonce: true,
    origine: 'plan_de_controle',
    etat: 'en_cours',
    contexte: 'Emissions de NOx dépassant les seuils le 2/04/2005',
    themes: [
      "Rejets dans l'air",
      'COV'
    ],
    inspecteurs: [
      1
    ],
    etablissementId: '0999.00002',
    comments: [],
    pointsDeControle: [
      {
        id: 1,
        brouillon: true,
        sujet: 'Mesure des émissions atmosphériques canalisées par un organisme extérieur',
        referencesReglementaires: [
          "Articles 3.2.3., 3.2.8. et 8.2.1.2. de l'arrêté préfectoral du 28 juin 2017"
        ],
        messages: [
          {
            id: 1,
            authorId: 1,
            text: "Auriez-vous l'obligeance de me fournir le document approprié ?",
            date: new Date('2018-09-16T14:00:00'),
            lu: true,
            attachments: []
          }
        ]
      },
      {
        id: 6,
        brouillon: false,
        sujet: 'Autosurveillance des émissions canalisées de COV',
        referencesReglementaires: [
          "Article 8.2.1.1. de l'arrêté préfectoral du 28 juin 2017"
        ],
        messages: []
      }
    ]
  },
  {
    id: 2,
    date: '2018-11-15',
    type: 'approfondi',
    annonce: true,
    origine: 'plan_de_controle',
    etat: 'attente_validation',
    contexte: 'Incident cuve gaz le 30/12/2017',
    themes: [
      "Rejets dans l'air",
      "Rejets dans l'eau",
      'Incendie',
      'COV'
    ],
    inspecteurs: [
      1,
      2
    ],
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
    pointsDeControle: [
      {
        id: 2,
        brouillon: false,
        sujet: 'Mesure des émissions atmosphériques canalisées par un organisme extérieur',
        referencesReglementaires: [
          "Article 3.2.3. de l'arrêté préfectoral du 28 juin 2017",
          "Article 3.2.8. de l'arrêté préfectoral du 28 juin 2017",
          "Article 8.2.1.2. de l'arrêté préfectoral du 28 juin 2017"
        ],
        messages: [
          {
            id: 4,
            authorId: 1,
            text: "Auriez-vous l'obligeance de me fournir le document approprié ?",
            date: new Date('2018-11-16T14:00:00'),
            confidential: false,
            lu: true,
            attachments: []
          },
          {
            id: 5,
            authorId: 4,
            text: 'Voici le document en question.',
            date: new Date('2018-11-16T16:50:00'),
            confidential: false,
            lu: true,
            attachments: [
              {
                id: 1,
                filename: 'analyses_2018.pdf',
                type: 'application/pdf',
                url: '/test/lorem-ipsum.pdf'
              }
            ]
          },
          {
            id: 6,
            authorId: 1,
            text: 'Merci.',
            date: new Date('2018-11-17T12:55:00'),
            lu: true,
            confidential: false,
            attachments: []
          },
          {
            id: 7,
            authorId: 2,
            text: "Attention à l'article 243.",
            date: new Date('2018-11-14T08:50:00'),
            confidential: true,
            lu: true,
            attachments: []
          },
          {
            id: 8,
            authorId: 1,
            text: "L'article 843 s'applique également.",
            date: new Date('2018-11-16T16:50:00'),
            confidential: true,
            lu: true,
            attachments: []
          }
        ],
        constat: {
          type: 'conforme'
        }
      },
      {
        id: 3,
        brouillon: true,
        sujet: 'Atelier de malaxage filage',
        referencesReglementaires: [
          "Article 3.1 de l'arrêté préfectoral du 9 juin 1999"
        ],
        messages: [],
        constat: {
          type: 'observation',
          remarques: 'Les rejets X2 sont contrôlés semestriellement pour les MES, la DBO5, la DCO, le pH, les hydrocarbures totaux. Les HAP ont été contrôlés dans le cadre de la campagne RSDE.'
        }
      },
      {
        id: 4,
        brouillon: true,
        sujet: 'Eau - Air',
        referencesReglementaires: [
          "Article 1 de l'Arrêté ministériel du 28 avril 2014"
        ],
        messages: [],
        constat: {
          type: 'non_conforme',
          remarques: 'Au jour de l\'inspection, les données 2018 n\'ont pas été télétransmises par l\'exploitant pour les données des rejets en eau + légionnelle. L\'inspection rappelle l\'obligation réglementaire faite à l\'exploitant de produire toute pièce ou documents mentionnés dans les différents arrêtés dans les délais prescrits. Les moyens humains et matériels correspondants doivent être mis en place pour que ces données puissent être disponibles pour l\'IIC.',
          echeance: '2019-05-17'
        }
      },
      {
        id: 5,
        brouillon: true,
        sujet: 'Autosurveillance des émissions canalisées de COV',
        referencesReglementaires: [
          "Article 8.2.1.1. de l'arrêté préfectoral du 28 juin 2017"
        ],
        messages: [
          {
            id: 9,
            authorId: 1,
            text: "Auriez-vous l'obligeance de me fournir une photo de la cuve ?",
            date: new Date('2018-11-16T14:10:00'),
            confidential: false,
            lu: true,
            attachments: []
          },
          {
            id: 10,
            authorId: 4,
            text: 'Voici une photo.',
            date: new Date('2018-11-17T08:50:00'),
            confidential: false,
            lu: true,
            attachments: [
              {
                id: 2,
                filename: 'photo_cuve.jpg',
                type: 'image/jpeg',
                url: 'https://picsum.photos/800/600?image=2'
              }
            ]
          }
        ],
        constat: {
          type: 'proposition_mise_en_demeure',
          remarques: 'Il faut réparer la fissure de la cuve.',
          echeance: '2019-02-17'
        }
      }
    ],
    suite: {
      type: 'observation',
      synthese: 'Cette visite à permis de relever des points faisant l’objet de non-conformités. L’exploitant devra fournir selon les délais mentionnés dans le présent rapport, les éléments permettant de justifier de la mise en œuvre des actions correctives nécessaires pour les lever.'
    }
  },
  {
    id: 3,
    date: '2018-12-18',
    type: 'courant',
    annonce: true,
    origine: 'circonstancielle',
    etat: 'preparation',
    contexte: 'Visite Suite à explosion',
    themes: [
      "Rejets dans l'air"
    ],
    inspecteurs: [
      1
    ],
    etablissementId: '0999.00002',
    comments: [],
    pointsDeControle: []
  },
  {
    id: 4,
    date: '2018-12-18',
    type: 'courant',
    annonce: true,
    origine: 'plan_de_controle',
    etat: 'en_cours',
    contexte: 'Visite annuelle',
    themes: [
      "Rejets dans l'air"
    ],
    inspecteurs: [
      1
    ],
    etablissementId: '0999.00003',
    comments: [],
    pointsDeControle: [
      {
        id: 7,
        brouillon: false,
        sujet: 'Rejets Air',
        referencesReglementaires: [
          "Article 8.2.1.1. de l'arrêté préfectoral du 28 juin 2017"
        ],
        messages: [],
        constat: {
          type: 'conforme',
          remarques: 'RAS'
        }
      }
    ]
  },
  {
    id: 5,
    date: '2018-12-21',
    type: 'courant',
    annonce: true,
    origine: 'plan_de_controle',
    etat: 'valide',
    contexte: 'Visite annuelle',
    themes: [
      "Rejets dans l'eau"
    ],
    inspecteurs: [
      1
    ],
    etablissementId: '0999.00003',
    comments: [],
    pointsDeControle: [
      {
        id: 7,
        brouillon: false,
        sujet: 'Rejets Eau',
        referencesReglementaires: [
          "Article 8.2.1.1. de l'arrêté préfectoral du 28 juin 2017"
        ],
        messages: [],
        constat: {
          type: 'conforme',
          remarques: 'RAS'
        }
      }
    ],
    suite: {
      type: 'observation',
      synthese: 'Cette visite à permis de relever des points faisant l’objet d’observations.'
    },
    approbation: {
      approbateurId: 3,
      date: new Date('2018-12-21T14:28:00')
    }
  }
]

export const allowedStates = {
  // avant notification de l'inspection à l'exploitant
  preparation: {
    label: 'Préparation',
    color: 'blue-grey lighten-1',
    order: 1
  },
  // après notification de l'inspection à l'exploitant
  en_cours: {
    label: 'En cours',
    color: 'primary',
    order: 2
  },
  // après demande de validation
  attente_validation: {
    label: 'En attente de validation',
    color: 'teal',
    order: 3
  },
  // après acceptation de la demande de validation
  valide: {
    label: 'Validé',
    color: 'green',
    order: 4
  }
}

export function isBeforeState (actualState, targetState) {
  return allowedStates[actualState].order < allowedStates[targetState].order
}
export function isAfterState (actualState, targetState) {
  return allowedStates[actualState].order > allowedStates[targetState].order
}

export const nomsEtatsEnCours = Object.keys(allowedStates)
  .filter(nomEtat => isBeforeState(nomEtat, 'attente_validation'))

export const typesConstats = {
  conforme: {
    label: 'Conforme',
    color: 'green',
    icon: 'check_circle'
  },
  observation: {
    label: 'Observation',
    color: 'orange',
    icon: 'info'
  },
  non_conforme: {
    label: 'Non conforme',
    color: 'red',
    icon: 'error'
  },
  proposition_mise_en_demeure: {
    label: 'Proposition de mise en demeure',
    color: '#600060',
    icon: 'error'
  }
}

export const typesSuite = {
  aucune: {
    label: 'Aucune',
    color: 'green',
    icon: 'check_circle'
  },
  observation: {
    label: 'Observation ou non conformités à traiter par courrier',
    color: 'orange',
    icon: 'info'
  },
  proposition_mise_en_demeure: {
    label: 'Proposition de suites administratives',
    color: 'black',
    icon: 'error'
  },
  proposition_renforcement: {
    label: 'Proposition de renforcement, modification ou mise à jour des prescription',
    color: 'purple',
    icon: 'info'
  },
  autre: {
    label: 'Autre',
    color: 'grey',
    icon: 'info'
  }
}

export default class InspectionsAPI extends BaseAPI {
  /*
  options = {
    filter: function : utilisé pour filtrer les résultats
    etablissement: bool : récupère l'établissement
    activite: bool : récupère l'activité
    auteursMessages: bool : récupère les utilisateurs de chaque message
    messagesNonLus: bool : calcule le nombre de messages non lus
    detailMessagesNonLus: bool : calcule le nombre de messages non lus pour chaque point de contrôle
    favoris: bool : ajoute le champ 'favoris' en fonction des inspections favorites de l'utilisateur
  }
  */
  async list (options = {}) {
    let filteredInspections = _.cloneDeep(inspections)
    if (this.isExploitant) {
      filteredInspections = filteredInspections
        .filter(inspection => inspection.etat !== 'preparation')
        .map(inspection => {
          delete inspection.comments
          inspection.pointsDeControle = inspection.pointsDeControle
            .filter(pointDeControle => !pointDeControle.brouillon)
            .map(pointDeControle => {
              pointDeControle.messages = pointDeControle.messages.filter(message => !message.confidential)
              return pointDeControle
            })
          return inspection
        })
    }
    if (options.etablissement) {
      const etablissementsAutorises = (await this.api.etablissements.list()).map(etablissement => etablissement.id)
      filteredInspections = filteredInspections.filter(inspection => etablissementsAutorises.includes(inspection.etablissementId))
    }
    if (options.filter) {
      filteredInspections = filteredInspections.filter(options.filter)
    }

    let inspectionsFavorites = []
    if (options.favoris) {
      inspectionsFavorites = (await this.api.users.get(this.userId)).inspectionsFavorites
    }
    return Promise.all(
      filteredInspections.map(async inspection => {
        if (inspection.approbation) {
          inspection.approbation.approbateur = await this.api.users.get(inspection.approbation.approbateurId)
        }
        if (options.etablissement) {
          inspection.etablissement = await this.api.etablissements.get(inspection.etablissementId, {
            responsables: !!options.responsablesEtablissement
          })
        }
        if (options.activite) {
          inspection.activite = (await this.api.evenements.list({
            auteur: true
          })).filter(event => event.inspectionId === inspection.id)
        }
        if (options.auteursMessages || options.messagesNonLus || options.detailMessagesNonLus) {
          await Promise.all([
            ...(inspection.comments || []).map(async message => {
              message.author = await this.api.users.get(message.authorId)
            }),

            ...inspection.pointsDeControle.map(async pointDeControle => {
              return Promise.all(
                pointDeControle.messages.map(async message => {
                  message.author = await this.api.users.get(message.authorId)
                })
              )
            })
          ])
        }
        const filtreAutreMessages = this.isExploitant ? message => message.author.type !== 'exploitant' : message => message.author.type === 'exploitant'
        if (options.messagesNonLus) {
          inspection.messagesNonLus = inspection.pointsDeControle.reduce((acc, pointDeControle) => (
            acc +
            pointDeControle.messages
              .filter(filtreAutreMessages)
              .reduce((accMessages, message) => accMessages + (message.lu ? 0 : 1), 0)
          ), 0)
          if (this.isInspecteur) {
            inspection.messagesNonLus += inspection.comments.reduce((accMessages, message) => accMessages + (message.lu ? 0 : 1), 0)
          }
        }
        if (options.detailMessagesNonLus) {
          inspection.pointsDeControle.forEach(pointDeControle => {
            pointDeControle.messagesNonLus = pointDeControle.messages
              .filter(filtreAutreMessages)
              .reduce((accMessages, message) => accMessages + (message.lu ? 0 : 1), 0)
          })
        }
        if (options.favoris) {
          inspection.favoris = inspectionsFavorites.includes(inspection.id)
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
    inspection.etat = 'preparation'
    inspection.pointsDeControle = []
    inspection.comments = []
    inspections.push(_.cloneDeep(inspection))

    await this.api.evenements.create({
      type: 'creation_inspection',
      inspectionId: inspection.id
    })
    return inspection.id
  }

  async save (updatedInspection) {
    this.requireInspecteur()
    if (typeof updatedInspection !== 'object') {
      throw new TypeError(`expected object, got: \`${typeof updatedInspection}\``)
    }
    const inspection = inspections.find(i => i.id === updatedInspection.id)
    // on devrait nettoyer l'objet pour ne garder que les champs autorisés
    Object.assign(inspection, _.cloneDeep(updatedInspection))

    await this.api.evenements.create({
      type: 'modification_inspection',
      inspectionId: inspection.id
    })
    await this.loadInspection(updatedInspection.id)
  }

  async toggleFavoris (inspectionId, favoris) {
    const inspection = inspections.find(i => i.id === inspectionId)
    if (!inspection) {
      throw new ApplicationError(`Inspection ${inspectionId} non trouvée`)
    }
    inspection.favoris = favoris
    await this.api.users.toggleInspectionFavorite(inspectionId, favoris)

    await Promise.all([
      this.loadInspection(inspectionId),
      this.loadInspectionsFavorites()
    ])
  }

  async ajouterPointDeControle (inspectionId, pointDeControle) {
    this.requireInspecteur()
    const inspection = inspections.find(i => i.id === inspectionId)
    if (!inspection) {
      throw new ApplicationError(`Inspection ${inspectionId} non trouvée`)
    }
    const pointDeControleEntity = _.cloneDeep(pointDeControle)
    pointDeControleEntity.id = new Date().getTime()
    inspection.pointsDeControle.push(pointDeControleEntity)

    await this.api.evenements.create({
      type: 'creation_pointdecontrole',
      inspectionId: inspection.id
    })
    await this.loadInspection(inspectionId)
  }

  async modifierPointDeControle (pointDeControleId, updatedPointDeControle) {
    this.requireInspecteur()
    const inspection = inspections.find(inspection => inspection.pointsDeControle.some(pointDeControle => pointDeControle.id === pointDeControleId))
    if (!inspection) {
      throw new ApplicationError(`Point de contrôle ${pointDeControleId} non trouvé`)
    }
    const pointDeControle = inspection.pointsDeControle.find(pointDeControle => pointDeControle.id === pointDeControleId)
    Object.assign(pointDeControle, updatedPointDeControle)

    await this.api.evenements.create({
      type: 'modification_pointdecontrole',
      inspectionId: inspection.id
    })
    await this.loadInspection(inspection.id)
  }

  async supprimerPointDeControle (pointDeControleId) {
    this.requireInspecteur()
    const inspection = inspections.find(inspection => inspection.pointsDeControle.some(pointDeControle => pointDeControle.id === pointDeControleId))
    if (!inspection) {
      throw new ApplicationError(`Point de contrôle ${pointDeControleId} non trouvé`)
    }
    const index = inspection.pointsDeControle.map(pointDeControle => pointDeControle.id).indexOf(pointDeControleId)
    if (index !== -1) {
      inspection.pointsDeControle.splice(index, 1)
    }

    await this.api.evenements.create({
      type: 'suppression_pointdecontrole',
      inspectionId: inspection.id
    })
    await this.loadInspection(inspection.id)
  }

  async modifierSuite (inspectionId, suite) {
    this.requireInspecteur()
    const inspection = inspections.find(i => i.id === inspectionId)
    if (!inspection) {
      throw new ApplicationError(`Inspection ${inspectionId} non trouvée`)
    }
    const creation = !inspection.suite
    inspection.suite = _.cloneDeep(suite)

    await this.api.evenements.create({
      type: creation ? 'creation_suite' : 'modification_suite',
      inspectionId: inspection.id
    })
    await this.loadInspection(inspectionId)
  }

  async supprimerSuite (inspectionId) {
    this.requireInspecteur()
    const inspection = inspections.find(i => i.id === inspectionId)
    if (!inspection) {
      throw new ApplicationError(`Inspection ${inspectionId} non trouvée`)
    }
    delete inspection.suite

    await this.api.evenements.create({
      type: 'suppression_suite',
      inspectionId: inspection.id
    })
    await this.loadInspection(inspectionId)
  }

  async ajouterCommentaireGeneral (inspectionId, commentaire) {
    this.requireInspecteur()
    const inspection = inspections.find(i => i.id === inspectionId)
    if (!inspection) {
      throw new ApplicationError(`Inspection ${inspectionId} non trouvée`)
    }
    const commentaireEntity = _.cloneDeep(commentaire)
    commentaireEntity.id = new Date().getTime()
    commentaireEntity.authorId = this.userId
    commentaireEntity.date = new Date()
    commentaireEntity.lu = false
    commentaireEntity.confidential = true
    inspection.comments.push(commentaireEntity)

    await this.api.evenements.create({
      type: 'commentaire_general',
      inspectionId: inspection.id
    })
    await this.loadInspection(inspection.id)
  }

  async ajouterMessage (pointDeControleId, message) {
    const inspection = inspections.find(inspection => inspection.pointsDeControle.some(pointDeControle => pointDeControle.id === pointDeControleId))
    if (!inspection) {
      throw new ApplicationError(`Point de contrôle ${pointDeControleId} non trouvé`)
    }
    const pointDeControle = inspection.pointsDeControle.find(pointDeControle => pointDeControle.id === pointDeControleId)
    const messageEntity = _.cloneDeep(message)
    messageEntity.id = new Date().getTime()
    messageEntity.authorId = this.userId
    messageEntity.date = new Date()
    messageEntity.lu = false
    if (this.isExploitant) {
      messageEntity.confidential = false
    }
    pointDeControle.messages.push(messageEntity)

    await this.api.evenements.create({
      type: message.confidential ? 'commentaire' : 'message',
      inspectionId: inspection.id,
      data: {
        pointDeControleId: pointDeControle.id
      }
    })
    await this.loadInspection(inspection.id)
  }

  async ajouterConstat (pointDeControleId, constat) {
    this.requireInspecteur()
    const inspection = inspections.find(inspection => inspection.pointsDeControle.some(pointDeControle => pointDeControle.id === pointDeControleId))
    if (!inspection) {
      throw new ApplicationError(`Point de contrôle ${pointDeControleId} non trouvé`)
    }
    const pointDeControle = inspection.pointsDeControle.find(pointDeControle => pointDeControle.id === pointDeControleId)
    pointDeControle.constat = _.cloneDeep(constat)

    await this.api.evenements.create({
      type: 'creation_constat',
      inspectionId: inspection.id
    })
    await this.loadInspection(inspection.id)
  }

  // passage état preparation -> en_cours
  async publier (inspectionId) {
    this.requireInspecteur()
    const inspection = inspections.find(i => i.id === inspectionId)
    if (!inspection) {
      throw new ApplicationError(`Inspection ${inspectionId} non trouvée`)
    }
    if (inspection.etat !== 'preparation') {
      throw new ApplicationError(`L'inspection est à l'état "${inspection.etat}". Impossible de la passer à "en_cours"`)
    }
    inspection.etat = 'en_cours'

    await this.api.evenements.create({
      type: 'publication_inspection',
      inspectionId: inspection.id
    })
    await this.loadInspection(inspectionId)
  }

  // passage état en_cours -> attente_validation
  async demanderValidation (inspectionId) {
    this.requireInspecteur()
    const inspection = inspections.find(i => i.id === inspectionId)
    if (!inspection) {
      throw new ApplicationError(`Inspection ${inspectionId} non trouvée`)
    }
    if (inspection.etat !== 'en_cours') {
      throw new ApplicationError(`L'inspection est à l'état "${inspection.etat}". Impossible de la passer à "attente_validation"`)
    }
    inspection.etat = 'attente_validation'

    await this.api.evenements.create({
      type: 'demande_validation_inspection',
      inspectionId: inspection.id
    })
    await this.loadInspection(inspectionId)
  }

  // passage état attente_validation -> en_cours
  async rejeter (inspectionId) {
    this.requireApprobateur()
    const inspection = inspections.find(i => i.id === inspectionId)
    if (!inspection) {
      throw new ApplicationError(`Inspection ${inspectionId} non trouvée`)
    }
    if (inspection.etat !== 'attente_validation') {
      throw new ApplicationError(`L'inspection est à l'état "${inspection.etat}". Impossible de la passer à "en_cours"`)
    }
    inspection.etat = 'en_cours'

    await this.api.evenements.create({
      type: 'rejet_validation_inspection',
      inspectionId: inspection.id
    })
    await this.loadInspection(inspectionId)
  }

  // passage état attente_validation -> valide
  async valider (inspectionId) {
    this.requireApprobateur()
    const inspection = inspections.find(i => i.id === inspectionId)
    if (!inspection) {
      throw new ApplicationError(`Inspection ${inspectionId} non trouvée`)
    }
    if (inspection.etat !== 'attente_validation') {
      throw new ApplicationError(`L'inspection est à l'état "${inspection.etat}". Impossible de la passer à "valide"`)
    }
    inspection.etat = 'valide'
    inspection.approbation = {
      approbateurId: this.userId,
      date: new Date()
    }

    await this.api.evenements.create({
      type: 'validation_inspection',
      inspectionId: inspection.id
    })
    await this.loadInspection(inspectionId)
  }

  // helpers
  async listByEtablissement (etablissementId, options) {
    return this.list({
      ...options,
      filter: inspection => inspection.etablissementId === etablissementId
    })
  }
  async listAssigned (options) {
    return this.list({
      ...options,
      filter: inspection => inspection.inspecteurs.includes(this.userId)
    })
  }
  async listInspectionsFavorites (options) {
    const user = await this.api.users.get(this.userId)
    return this.list({
      ...options,
      filter: inspection => user.inspectionsFavorites.includes(inspection.id)
    })
  }

  // interne
  async loadInspection (inspectionId) {
    if (typeof inspectionId !== 'number') {
      throw new TypeError(`expected number, got: \`${typeof inspectionId}\``)
    }
    this.api.store.commit('loadInspection', await this.api.inspections.get(inspectionId, {
      etablissement: true,
      activite: true,
      auteursMessages: true,
      detailMessagesNonLus: true,
      favoris: true,
      responsablesEtablissement: true
    }))
  }

  async loadInspectionsFavorites () {
    const inspectionsFavorites = await this.api.inspections.listInspectionsFavorites({
      etablissement: true
    })
    this.api.store.commit('loadInspectionsFavorites', inspectionsFavorites)
  }
}
