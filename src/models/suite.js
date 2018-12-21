export class Suite {
  constructor ({ type = '', remarques = '', echeance = new Date() } = {}) {
    this.type = type
    this.remarques = remarques
    this.echeance = echeance
  }
}

export const typesSuite = [
  {
    id: 'aucune',
    label: 'Aucune',
    color: 'green',
    icon: 'check_circle'
  },
  {
    id: 'observation',
    label: 'Observation ou non conformités à traiter par courrier',
    color: 'orange',
    icon: 'info'
  },
  {
    id: 'proposition_mise_en_demeure',
    label: 'Proposition de suites administratives',
    color: 'black',
    icon: 'error'
  },
  {
    id: 'proposition_renforcement',
    label: 'Proposition de renforcement, modification ou mise à jour des prescription',
    color: 'purple',
    icon: 'info'
  },
  {
    id: 'autre',
    label: 'Autre',
    color: 'grey',
    icon: 'info'
  }
]

export function createSuite (data) {
  const type = typesSuite.find(t => t.id === data.type)
  return Object.freeze(new Suite({
    type,
    remarques: data.remarques,
    echeance: data.echeance
  }))
}
