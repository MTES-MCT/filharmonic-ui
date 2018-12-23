export class Constat {
  constructor ({ id = '', type = {}, remarques = '', echeance = new Date() } = {}) {
    this.id = id
    this.type = type
    this.remarques = remarques
    this.echeance = echeance
  }
}

export const typesConstat = [
  {
    id: 'conforme',
    label: 'Conforme',
    color: 'green',
    icon: 'check_circle'
  },
  {
    id: 'observation',
    label: 'Observation',
    color: 'orange',
    icon: 'info'
  },
  {
    id: 'non_conforme',
    label: 'Non conforme',
    color: 'red',
    icon: 'error'
  },
  {
    id: 'proposition_mise_en_demeure',
    label: 'Proposition de mise en demeure',
    color: '#600060',
    icon: 'error'
  }
]

export function createConstat (data) {
  const type = typesConstat.find(c => c.id === data.type)
  const input = {
    id: data.id,
    type,
    remarques: data.remarques,
    echeance: data.echeance
  }
  return Object.freeze(new Constat(input))
}
