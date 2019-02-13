export class Etablissement {
  constructor (data = {}) {
    Object.assign(this, data)

    // Object.defineProperty('adresse', {
    //   get () {
    //     return `${this.adresse1} ${this.adresse2} ${this.code_postal} ${this.commune}`
    //   },
    //   enumerable: true
    // })
  }
  get adresse () {
    return `${this.adresse1} ${this.adresse2} ${this.code_postal} ${this.commune}`
  }
}
