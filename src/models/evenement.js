import { User, createUser } from '@/models/user'

export class Evenement {
  constructor ({ id = -1, type = '', author = new User(), inspectionId = -1, created = new Date(), data = { messageId: -1, pointDeControleId: -1 } } = {}) {
    this.id = id
    this.type = type
    this.author = author
    this.inspectionId = inspectionId
    this.created = created
    this.data = data
  }
}

export function createEvenement (data) {
  const author = createUser(data.author)
  return Object.freeze(new Evenement({
    id: data.id,
    type: data.type,
    author,
    inspectionId: data.inspectionId,
    created: data.created,
    data: data.data
  }))
}
