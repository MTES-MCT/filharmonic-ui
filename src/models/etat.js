export class Etat {
  constructor ({ id = '', label = '', color = '', order = -1 } = {}) {
    this.id = id
    this.label = label
    this.color = color
    this.order = order
  }
}

export const allowedStates = [
  {
    id: 'en_cours',
    label: 'Avant visite',
    color: 'indigo',
    order: 1
  },
  {
    id: 'visite_site',
    label: 'Visite sur site',
    color: 'primary',
    order: 2
  },
  {
    id: 'rapport_suites',
    label: 'Rédaction du rapport sur les suites',
    color: 'warning',
    order: 3
  },
  {
    id: 'attente_validation',
    label: 'En attente de validation',
    color: 'teal',
    order: 4
  },
  {
    id: 'valide',
    label: 'Validé',
    color: 'green',
    order: 5
  },
  {
    id: 'clos',
    label: 'Clos',
    color: 'grey',
    order: 6
  }
]

export function createEtat (data) {
  const etat = allowedStates.find(e => e.id === data)
  return Object.freeze(new Etat(etat))
}

export const nomsEtatsEnCours = allowedStates.filter(e => e.order < allowedStates.find(e => e.id === 'attente_validation').order).map(({ id }) => id)
