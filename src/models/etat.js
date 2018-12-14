export class Etat {
  constructor ({ id = 0, nom = '', order = -1 } = {}) {
    this.id = id
    this.nom = nom
    this.order = order
  }
}

export function createEtat (data) {
  return Object.freeze(new Etat(data))
}
