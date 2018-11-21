import * as util from '@/util'

const controles = [
  {
    id: '1',
    date: new Date('2018-09-10'),
    type: 'approfondi',
    annonce: true,
    origine: 'plan_de_controle',
    favorite: false,
    state: 2, // en cours
    themes: [
      "Rejets dans l'air",
      'COV'
    ],
    inspecteurs: [
      1
    ],
    etablissement: {
      id: '0999.00002',
      nom: 'B',
      raison: 'B SARL',
      activite: 'Fabrication de matrices composites',
      regimeSeveso: '',
      adresse: '234 rue de Paris'
    },
    comments: [],
    echanges: [
      {
        question: {
          author: 'Alain Champion',
          text: "Auriez-vous l'obligeance de me fournir le document approprié ?",
          date: new Date('2018-09-16T14:00:00'),
          attachments: []
        },
        reponses: []
      }
    ]
  },
  {
    id: '2',
    date: new Date('2018-11-15'),
    type: 'approfondi',
    annonce: true,
    origine: 'plan_de_controle',
    favorite: true,
    state: 2, // en cours
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
    etablissement: {
      id: '0999.00001',
      nom: 'A',
      raison: 'A SARL',
      activite: 'Fabrication de matrices composites',
      regimeSeveso: '',
      adresse: '123 rue de Paris'
    },
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
        question: {
          author: 'Alain Champion',
          text: "Auriez-vous l'obligeance de me fournir le document approprié ?",
          date: new Date('2018-11-16T14:00:00'),
          attachments: []
        },
        reponses: [
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
        ]
      },
      {
        question: {
          author: 'Alain Champion',
          text: "Auriez-vous l'obligeance de me fournir une photo de la cuve ?",
          date: new Date('2018-11-16T14:10:00'),
          attachments: []
        },
        reponses: [
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
        ]
      }
    ]
  }
]

export const listeControles = util.slow(() => {
  return controles
})

export const getControle = util.slow((id) => {
  return controles.find(controle => controle.id === id)
})

export const getControlesByEtablissement = util.slow((etablissementId) => {
  return controles.filter(controle => controle.etablissement.id === etablissementId)
})

export const createControle = util.slow((controle) => {
  controle.id = '' + new Date().getTime() % 1000
  controle.date = new Date(controle.date)
  controle.echanges = []
  controle.comments = []
  controles.push(controle)
  return controle.id
})
