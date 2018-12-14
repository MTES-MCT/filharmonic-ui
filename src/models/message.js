import { createAttachment } from '@/models/attachment'
export class Message {
  constructor ({ id = 0, authorId = -1, text = '', date = new Date(), lu = false, attachments = [] } = {}) {
    this.id = id
    this.authorId = authorId
    this.text = text
    this.date = date
    this.lu = lu
    this.attachments = attachments
  }
}

export function createMessage (data) {
  const attachments = data.attachments.map(x => createAttachment(x))
  return Object.freeze(new Message({
    id: data.id,
    authorId: data.authorId,
    text: data.text,
    attachments }))
}
