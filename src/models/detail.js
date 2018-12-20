export class Detail {
  constructor ({ id = 0, date = null, type = '', annonce = '', origine = '', favorite = '', contexte = '', circonstances = '', detailCirconstances = '' } = {}) {
    this.id = id
    this.date = date
    this.type = type
    this.annonce = annonce
    this.origine = origine
    this.favorite = favorite
    this.contexte = contexte
    this.circonstances = circonstances
    this.detailCirconstances = detailCirconstances
  }
}

export function createDetail (data) {
  return Object.freeze(new Detail(data))
}
