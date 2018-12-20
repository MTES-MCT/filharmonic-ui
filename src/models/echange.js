import { createConstat } from '@/models/constat'
import { createMessage } from '@/models/message'
import { createSuite } from '@/models/suite'
export class Echange {
  constructor ({ id = 0, sujet = '', brouillon = true, messages = [], referencesReglementaires = [], constat = {}, suites = [] } = {}) {
    this.id = id
    this.sujet = sujet
    this.brouillon = brouillon
    this.messages = messages
    this.referencesReglementaires = referencesReglementaires
    this.constat = constat
    this.suites = suites
  }
}

export function createEchange (data) {
  const constat = createConstat(data.constat)
  const messages = data.messages.map(x => createMessage(x))
  const suites = data.suites.map(x => createSuite(x))
  return Object.freeze(new Echange({
    id: data.id,
    sujet: data.sujet,
    brouillon: data.brouillon,
    messages,
    referencesReglementaires: data.referencesReglementaires,
    constat,
    suites
  }))
}
