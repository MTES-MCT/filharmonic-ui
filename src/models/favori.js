import { createEtablissement } from '@/models/etablissement'

export class Favori {
  constructor ({ id = 0, date = null, etablissement = null, userId = -1 } = {}) {
    this.id = id
    this.etablissement = etablissement
    this.date = date
    this.userId = userId
  }
}

export function createFavori (data) {
  const etablissement = createEtablissement(data.inspection.etablissement)
  return Object.freeze(new Favori({
    id: data.inspection.id,
    date: data.inspection.date,
    etablissement,
    userId: data.userId
  }))
}
