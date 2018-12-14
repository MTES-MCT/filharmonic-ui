export class Attachment {
  constructor ({ id = 0, filename = '', type = '' } = {}) {
    this.id = id
    this.filename = filename
    this.type = type
  }
}

export function createAttachment (data) {
  return Object.freeze(new Attachment(data))
}
