import { createUser } from '@/models/user'
import { createAttachment } from '@/models/attachment'
export class Message {
  constructor ({ id = 0, author = null, text = '', date = new Date(), lu = false, attachments = [] } = {}) {
    this.id = id
    this.author = author
    this.text = text
    this.date = date
    this.lu = lu
    this.attachments = attachments
  }
}

export function createMessage (data) {
  const author = createUser(data.author)
  const attachments = data.attachments.map(x => createAttachment(x))
  return Object.freeze(new Message({
    id: data.id,
    author,
    text: data.text,
    attachments }))
}
