import * as util from '@/util'
import { getEtablissement } from '@/api/etablissements'
import { getUser } from '@/api/users'

const controles = [
  {
    id: '1',
    date: '2018-09-10',
    type: 'approfondi',
    annonce: true,
    origine: 'plan_de_controle',
    favorite: false,
    state: 'encours',
    themes: [
      "Rejets dans l'air",
      'COV'
    ],
    inspecteurs: [
      1
    ],
    etablissementId: '0999.00002',
    comments: [],
    echanges: [
      {
        sujet: 'Mesure des émissions atmosphériques canalisées par un organisme extérieur',
        referencesReglementaires: [
          "Articles 3.2.3., 3.2.8. et 8.2.1.2. de l'arrêté préfectoral du 28 juin 2017"
        ],
        reponses: [
          {
            author: 'Alain Champion',
            text: "Auriez-vous l'obligeance de me fournir le document approprié ?",
            date: new Date('2018-09-16T14:00:00'),
            attachments: []
          }
        ]
      }
    ],
    lastEvent: {
      date: new Date('2018-11-24T09:50:00'),
      authorId: 4,
      type: 'message'
    }
  },
  {
    id: '2',
    date: '2018-11-15',
    type: 'approfondi',
    annonce: true,
    origine: 'plan_de_controle',
    favorite: true,
    state: 'encours',
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
        author: 'Corine Dupont',
        text: "Attention à l'article 243.",
        date: new Date('2018-11-14T08:50:00')
      },
      {
        author: 'Alain Champion',
        text: "L'article 843 s'applique également.",
        date: new Date('2018-11-16T16:50:00')
      }
    ],
    echanges: [
      {
        sujet: 'Mesure des émissions atmosphériques canalisées par un organisme extérieur',
        referencesReglementaires: [
          "Article 3.2.3. de l'arrêté préfectoral du 28 juin 2017",
          "Article 3.2.8. de l'arrêté préfectoral du 28 juin 2017",
          "Article 8.2.1.2. de l'arrêté préfectoral du 28 juin 2017"
        ],
        reponses: [
          {
            author: 'Alain Champion',
            text: "Auriez-vous l'obligeance de me fournir le document approprié ?",
            date: new Date('2018-11-16T14:00:00'),
            attachments: []
          },
          {
            author: 'Monsieur Entreprise',
            text: 'Voici le document en question.',
            date: new Date('2018-11-16T16:50:00'),
            attachments: [
              {
                id: 1,
                filename: 'analyses_2018.pdf',
                type: 'pdf'
              }
            ]
          },
          {
            author: 'Alain Champion',
            text: 'Merci.',
            date: new Date('2018-11-17T12:55:00')
          }
        ],
        constat: {
          type: 'conforme'
        }
      },
      {
        sujet: 'Autosurveillance des émissions canalisées de COV',
        referencesReglementaires: [
          "Article 8.2.1.1. de l'arrêté préfectoral du 28 juin 2017"
        ],
        reponses: [
          {
            author: 'Alain Champion',
            text: "Auriez-vous l'obligeance de me fournir une photo de la cuve ?",
            date: new Date('2018-11-16T14:10:00'),
            attachments: []
          },
          {
            author: 'Monsieur Entreprise',
            text: 'Voici une photo.',
            date: new Date('2018-11-17T08:50:00'),
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
          type: 'non_conforme',
          observation: 'Il faut réparer la fissure de la cuve.',
          echeance: '2019-02-17'
        }
      }
    ],
    lastEvent: {
      date: new Date('2018-11-22T08:50:00'),
      authorId: 2,
      type: 'commentaire'
    }
  }
]

export const allowedStates = {
  encours: {
    label: 'En cours',
    color: 'green'
  },
  valide: {
    label: 'Validé',
    color: 'red'
  },
  termine: {
    label: 'Terminé',
    color: 'grey'
  }
}

export const listControles = util.slow(() => {
  return controles
})

export const getControle = util.slow(async (id, options = {}) => {
  const controle = controles.find(controle => controle.id === id)
  if (!controle) {
    throw new Error(`Controle ${id} non trouvé`)
  }
  if (options.etablissement) {
    controle.etablissement = await getEtablissement(controle.etablissementId)
  }
  return controle
})

export const listAssignedControles = util.slow(userId => {
  return Promise.all(
    controles
      .filter(controle => controle.inspecteurs.includes(userId))
      .map(async controle => {
        controle.etablissement = await getEtablissement(controle.etablissementId)
        controle.lastEvent.author = await getUser(controle.lastEvent.authorId)
        return controle
      })
  )
})

export const listControlesOuverts = util.slow(async userId => {
  return (await listAssignedControles(userId)).filter(c => c.state === 'encours')
})

export const getControlesByEtablissement = util.slow((etablissementId) => {
  return controles.filter(controle => controle.etablissementId === etablissementId)
})

export const createControle = util.slow((controle) => {
  controle.id = '' + new Date().getTime() % 1000
  controle.echanges = []
  controle.comments = []
  controles.push(controle)
  return controle.id
})
