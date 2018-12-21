import { createTheme } from '@/models/theme'
import { createUser } from '@/models/user'
import { createMessage } from '@/models/message'
import { createEchange } from '@/models/echange'
import { createEtat, Etat } from '@/models/etat'
import { createDetail, Detail } from '@/models/detail'
import { createEtablissement, Etablissement } from '@/models/etablissement'

export class Inspection {
  constructor ({
    detail = new Detail(),
    etat = new Etat(), themes = [],
    inspecteurs = [], etablissement = new Etablissement(),
    comments = [], echanges = [] } = {}) {
    this.detail = detail
    this.etat = etat
    this.themes = themes
    this.inspecteurs = inspecteurs
    this.etablissement = etablissement
    this.comments = comments
    this.echanges = echanges
  }
}

export function createInspection (data) {
  const detail = createDetail(data.detail)
  const etat = createEtat(data.etat)
  const etablissement = createEtablissement(data.etablissement)
  const themes = data.themes.map(x => createTheme(x))
  const inspecteurs = data.inspecteurs.map(x => createUser(x))
  const comments = data.comments.map(x => createMessage(x))
  const echanges = data.echanges.map(x => createEchange(x))
  return Object.freeze(new Inspection({
    detail,
    etat,
    themes,
    inspecteurs,
    etablissement,
    comments,
    echanges }))
}
