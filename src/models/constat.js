export class Constat {
  constructor ({ type = '', remarques = '', echeance = null } = {}) {
    this.type = type
    this.remarques = remarques
    this.echeance = echeance
  }
}

export function createConstat (data) {
  return Object.freeze(new Constat(data))
}
