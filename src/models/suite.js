export class Suite {
  constructor ({ type = 'observation', synthese = 'Cette visite a permis de relever des points faisant l’objet d’observations. L’exploitant devra fournir selon les délais mentionnés dans le présent rapport, les éléments permettant de justifier de la mise en œuvre des actions correctives nécessaires pour les lever.', inspectionId = -1 } = {}) {
    this.type = type
    this.synthese = synthese
    this.inspectionId = inspectionId
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
    synthese: data.synthese,
    inspectionId: data.inspectionId
  }))
}
