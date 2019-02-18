export class Etablissement {
  constructor (data = {}) {
    Object.assign(this, data)
    this.adresse = `${this.adresse1} ${this.adresse2} ${this.code_postal} ${this.commune}`
  }
}

export class User {
  constructor (data = {}) {
    Object.assign(this, data)
    this.fullname = `${this.prenom} ${this.nom}`
  }
}
