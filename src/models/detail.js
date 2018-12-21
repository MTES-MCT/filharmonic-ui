export class Detail {
  constructor ({ id = 0, date = new Date(), type = '', annonce = '', origine = '', favorite = '', contexte = '', circonstances = '', detailCirconstances = '' } = {}) {
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
  return Object.assign(new Detail(data))
}
