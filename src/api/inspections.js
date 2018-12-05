import * as util from '@/util'
import { getEtablissement } from '@/api/etablissements'
import { getUser } from '@/api/users'

const inspections = [
  {
    id: '1',
    date: '2018-09-10',
    type: 'approfondi',
    annonce: true,
    origine: 'plan_de_inspection',
    favorite: false,
    etat: 'en_cours',
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
            id: 1,
            author: 'Alain Champion',
            text: "Auriez-vous l'obligeance de me fournir le document approprié ?",
            date: new Date('2018-09-16T14:00:00'),
            attachments: []
          }
        ],
        comments: []
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
    origine: 'plan_de_inspection',
    favorite: true,
    etat: 'attente_validation',
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
        author: 'Corine Dupont',
        text: "Attention à l'article 243.",
        date: new Date('2018-11-14T08:50:00'),
        confidential: true,
        attachments: []
      },
      {
        id: 3,
        author: 'Alain Champion',
        text: "L'article 843 s'applique également.",
        date: new Date('2018-11-16T16:50:00'),
        confidential: true,
        attachments: []
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
            id: 4,
            author: 'Alain Champion',
            text: "Auriez-vous l'obligeance de me fournir le document approprié ?",
            date: new Date('2018-11-16T14:00:00'),
            attachments: [],
            confidential: false
          },
          {
            id: 5,
            author: 'Monsieur Entreprise',
            text: 'Voici le document en question.',
            date: new Date('2018-11-16T16:50:00'),
            confidential: false,
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
            author: 'Alain Champion',
            text: 'Merci.',
            date: new Date('2018-11-17T12:55:00'),
            confidential: false,
            attachments: []
          }
        ],
        constat: {
          type: 'conforme'
        },
        comments: [
          {
            id: 7,
            author: 'Corine Dupont',
            text: "Attention à l'article 243.",
            date: new Date('2018-11-14T08:50:00'),
            confidential: true,
            attachments: []
          },
          {
            id: 8,
            author: 'Alain Champion',
            text: "L'article 843 s'applique également.",
            date: new Date('2018-11-16T16:50:00'),
            confidential: true,
            attachments: []
          }
        ]
      },
      {
        sujet: 'Atelier de malaxage filage',
        referencesReglementaires: [
          "Article 3.1 de l'arrêté préfectoral du 9 juin 1999"
        ],
        reponses: [],
        constat: {
          type: 'observation',
          remarques: 'Les rejets X2 sont contrôlés semestriellement pour les MES, la DBO5, la DCO, le pH, les hydrocarbures totaux. Les HAP ont été contrôlés dans le cadre de la campagne RSDE.'
        }
      },
      {
        sujet: 'Eau - Air',
        referencesReglementaires: [
          "Article 1 de l'Arrêté ministériel du 28 avril 2014"
        ],
        reponses: [],
        constat: {
          type: 'non_conforme',
          remarques: `Au jour de l'inspection, les données 2018 n'ont pas été télétransmises par l'exploitant pour les données des rejets en eau + légionnelle. L'inspection rappelle l'obligation réglementaire faite à l'exploitant de produire toute pièce ou documents mentionnés dans les différents arrêtés dans les délais prescrits. Les moyens humains et matériels correspondants doivent être mis en place pour que ces données puissent être disponibles pour l'IIC.`,
          echeance: '2019-05-17'
        }
      },
      {
        sujet: 'Autosurveillance des émissions canalisées de COV',
        referencesReglementaires: [
          "Article 8.2.1.1. de l'arrêté préfectoral du 28 juin 2017"
        ],
        reponses: [
          {
            id: 9,
            author: 'Alain Champion',
            text: "Auriez-vous l'obligeance de me fournir une photo de la cuve ?",
            date: new Date('2018-11-16T14:10:00'),
            confidential: false,
            attachments: []
          },
          {
            id: 10,
            author: 'Monsieur Entreprise',
            text: 'Voici une photo.',
            date: new Date('2018-11-17T08:50:00'),
            confidential: false,
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
    ],
    lastEvent: {
      date: new Date('2018-11-22T08:50:00'),
      authorId: 2,
      type: 'commentaire'
    }
  }
]

export const allowedStates = {
  en_cours: {
    label: 'En cours',
    color: 'indigo',
    order: 1
  },
  attente_validation: {
    label: 'En attente de validation',
    color: 'teal',
    order: 2
  },
  valide: {
    label: 'Validé',
    color: 'green',
    order: 3
  },
  clos: {
    label: 'Clos',
    color: 'grey',
    order: 4
  }
}

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

export const listInspections = util.slow(() => {
  return inspections
})

export const getInspection = util.slow(async (id, options = {}) => {
  const inspection = inspections.find(inspection => inspection.id === id)
  if (!inspection) {
    throw new Error(`Inspection ${id} non trouvée`)
  }
  if (options.etablissement) {
    inspection.etablissement = await getEtablissement(inspection.etablissementId)
  }
  return inspection
})

export const listAssignedInspections = util.slow(userId => {
  return Promise.all(
    inspections
      .filter(inspection => inspection.inspecteurs.includes(userId))
      .map(async inspection => {
        inspection.etablissement = await getEtablissement(inspection.etablissementId)
        inspection.lastEvent.author = await getUser(inspection.lastEvent.authorId)
        return inspection
      })
  )
})

export const listInspectionsOuvertes = util.slow(async userId => {
  return (await listAssignedInspections(userId)).filter(c => c.etat !== 'clos')
})

export const getInspectionsByEtablissement = util.slow((etablissementId) => {
  return inspections.filter(inspection => inspection.etablissementId === etablissementId)
})

export const createInspection = util.slow((inspection) => {
  inspection.id = '' + new Date().getTime() % 1000
  inspection.echanges = []
  inspection.comments = []
  inspections.push(inspection)
  return inspection.id
})
