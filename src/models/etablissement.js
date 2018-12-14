export class Etablissement {
  constructor ({ id = 0, nom = '', raison = '', activite = '', adresse = '', seveso = '', iedmtd = false } = {}) {
    this.id = id
    this.nom = nom
    this.raison = raison
    this.activite = activite
    this.adresse = adresse
    this.seveso = seveso
    this.iedmtd = iedmtd
  }
}

export function createEtablissement (data) {
  return Object.freeze(new Etablissement(data))
}
