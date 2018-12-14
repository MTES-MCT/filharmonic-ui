export class User {
  constructor ({ id = 0, name = '', email = '', photoURL = '', type = '' } = {}) {
    this.id = id
    this.name = name
    this.email = email
    this.photoURL = photoURL
    this.type = type
  }
}

export function createUser (data) {
  return Object.freeze(new User(data))
}
