import { createConstat } from '@/models/constat'
import { createMessage } from '@/models/message'
export class Echange {
  constructor ({ id = 0, sujet = '', brouillon = true, messages = [], referencesReglementaires = [], constat = null } = {}) {
    this.id = id
    this.sujet = sujet
    this.brouillon = brouillon
    this.messages = messages
    this.referencesReglementaires = referencesReglementaires
    this.constat = constat
  }
}

export function createEchange (data) {
  const constat = createConstat(data.constat)
  const messages = data.messages.map(x => createMessage(x))
  return Object.freeze(new Echange({
    id: data.id,
    sujet: data.sujet,
    brouillon: data.brouillon,
    messages,
    referencesReglementaires: data.referencesReglementaires,
    constat
  }))
}
