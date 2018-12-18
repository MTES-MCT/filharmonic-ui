import BaseAPI from '@/api/base'
import * as _ from '@/util'
import { ApplicationError } from '@/errors'

const echanges = [
  {
    id: 1,
    brouillon: true,
    inspectionId: 1,
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
            type: 'pdf'
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
    inspectionId: 2,
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
    inspectionId: 2,
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
    inspectionId: 2,
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
            type: 'image'
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
]
export default class EchangesAPI extends BaseAPI {
  async list (options = {}) {
    let filtered = _.cloneDeep(echanges)
    if (options.filter) {
      filtered = filtered.filter(options.filter)
    }
    return Promise.all(
      filtered.map(async echange => {
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
  async save (newEchange) {
    this.requireInspecteur()
    console.log('before save newEchange=' + JSON.stringify(newEchange))
    const oldEchange = echanges.find(e => e.id === newEchange.id)
    console.log('before save oldEchange=' + JSON.stringify(oldEchange))
    // on devrait nettoyer l'objet pour ne garder que les champs autorisés
    Object.assign(oldEchange, _.cloneDeep(newEchange))
    console.log('after save oldEchange=' + JSON.stringify(oldEchange))
  }
}
