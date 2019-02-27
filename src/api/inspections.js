export const allowedStates = {
  // avant notification de l'inspection à l'exploitant
  preparation: {
    label: 'Préparation',
    color: 'blue-grey lighten-1',
    order: 1
  },
  // après notification de l'inspection à l'exploitant
  en_cours: {
    label: 'En cours',
    color: 'primary',
    order: 2
  },
  // après demande de validation
  attente_validation: {
    label: 'En attente de validation',
    color: 'teal',
    order: 3
  },
  // après acceptation de la demande de validation
  traitement_non_conformites: {
    label: 'Traitement des non-conformités',
    color: 'red',
    order: 4
  },
  clos: {
    label: 'Validé',
    color: 'green',
    order: 5
  }
}

export function isBeforeState (actualState, targetState) {
  return allowedStates[actualState].order < allowedStates[targetState].order
}
export function isAfterState (actualState, targetState) {
  return allowedStates[actualState].order > allowedStates[targetState].order
}

export const nomsEtatsEnCours = Object.keys(allowedStates)
  .filter(nomEtat => isBeforeState(nomEtat, 'attente_validation'))

export const typesConstats = {
  conforme: {
    label: 'Conforme',
    color: 'green',
    icon: 'check_circle'
  },
  observation: {
    label: 'Observation',
    color: 'orange',
    icon: 'info'
  },
  non_conforme: {
    label: 'Non conforme',
    color: 'red',
    icon: 'error'
  }
}

export const typesSuite = {
  aucune: {
    label: 'Aucune',
    color: 'green',
    icon: 'check_circle'
  },
  observation: {
    label: 'Observation ou non conformités à traiter par courrier',
    color: 'orange',
    icon: 'info'
  },
  proposition_mise_en_demeure: {
    label: 'Proposition de suites administratives',
    color: 'black',
    icon: 'error'
  },
  proposition_renforcement: {
    label: 'Proposition de renforcement, modification ou mise à jour des prescription',
    color: 'purple',
    icon: 'info'
  },
  autre: {
    label: 'Autre',
    color: 'grey',
    icon: 'info'
  }
}
