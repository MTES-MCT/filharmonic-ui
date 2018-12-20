export class Detail {
  constructor ({ id = 0, date = '', type = '', annonce = '', origine = '', favorite = '' } = {}) {
    this.id = id
    this.date = date
    this.type = type
    this.annonce = annonce
    this.origine = origine
    this.favorite = favorite
  }
}

export function createDetail (data) {
  return Object.freeze(new Detail(data))
}
