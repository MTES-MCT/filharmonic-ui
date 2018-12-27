import { createAttachment } from '@/models/attachment'
export class Message {
  constructor ({ id = 0, authorId = -1, echangeId = -1, text = '', date = new Date(), lu = false, confidential = true, attachments = [] } = {}) {
    this.id = id
    this.date = date
    this.echangeId = echangeId
    this.authorId = authorId
    this.text = text
    this.lu = lu
    this.attachments = attachments
    this.confidential = confidential
  }
}

export function createMessage (data) {
  const attachments = data.hasOwnProperty('attachments') ? data.attachments.map(x => createAttachment(x)) : []
  return Object.assign(new Message({
    id: data.id,
    echangeId: data.echangeId,
    authorId: data.authorId,
    text: data.text,
    attachments,
    confidential: data.confidential,
    lu: data.lu }))
}
