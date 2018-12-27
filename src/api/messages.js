import BaseAPI from '@/api/base'
import * as _ from '@/util'
import { ApplicationError } from '@/errors'
import { createMessage } from '@/models/message'

const messages = [
  {
    id: 1,
    echangeId: 1,
    authorId: 1,
    text: "Auriez-vous l'obligeance de me fournir le document approprié ?",
    date: new Date('2018-09-16T14:00:00'),
    lu: true,
    attachments: []
  },
  {
    id: 4,
    echangeId: 2,
    authorId: 1,
    text: "Auriez-vous l'obligeance de me fournir le document approprié ?",
    date: new Date('2018-11-16T14:00:00'),
    confidential: false,
    lu: true,
    attachments: []
  },
  {
    id: 5,
    echangeId: 2,
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
    echangeId: 2,
    authorId: 1,
    text: 'Merci.',
    date: new Date('2018-11-17T12:55:00'),
    lu: true,
    confidential: false,
    attachments: []
  },
  {
    id: 7,
    echangeId: 2,
    authorId: 2,
    text: "Attention à l'article 243.",
    date: new Date('2018-11-14T08:50:00'),
    confidential: true,
    lu: true,
    attachments: []
  },
  {
    id: 8,
    echangeId: 2,
    authorId: 1,
    text: "L'article 843 s'applique également.",
    date: new Date('2018-11-16T16:50:00'),
    confidential: true,
    lu: true,
    attachments: []
  },
  {
    id: 9,
    echangeId: 5,
    authorId: 1,
    text: "Auriez-vous l'obligeance de me fournir une photo de la cuve ?",
    date: new Date('2018-11-16T14:10:00'),
    confidential: false,
    lu: true,
    attachments: []
  },
  {
    id: 10,
    echangeId: 5,
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
]

export default class MessagesAPI extends BaseAPI {
  async list (options = {}) {
    let filtered = _.cloneDeep(messages)
    if (options.filter) {
      filtered = filtered.filter(options.filter)
    }
    return Promise.all(
      filtered.map(async message => {
        return _.cloneDeep(message)
      })
    )
  }
  async get (id, options) {
    const message = (await this.list({
      ...options,
      filter: message => message.id === id
    }))[0]
    if (!message) {
      throw new ApplicationError(`Message ${id} non trouvé`)
    }
    return message
  }
  async listByEchange (echangeId, options) {
    return this.list({
      ...options,
      filter: message => message.echangeId === echangeId
    })
  }
  async save (message) {
    this.requireInspecteur()
    if (message.id > 0) {
      // on devrait nettoyer l'objet pour ne garder que les champs autorisés
      Object.assign(message, _.cloneDeep(messages.find(m => m.id === message.id)))
    } else {
      Object.assign(message, createMessage({
        id: new Date().getTime() % 1000,
        authorId: message.authorId,
        echangeId: message.echangeId,
        confidential: message.confidential,
        text: message.text,
        attachments: message.attachments
      }))
      messages.push(message)
    }
    return message.id
  }
}
