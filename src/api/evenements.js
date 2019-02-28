export const evenements = {
  // workflow d'une inspection
  creation_inspection: {
    notifications: () => ['inspecteurs'],
    message (evenement) {
      return `a créé une inspection.`
    }
  },
  publication_inspection: {
    notifications: () => ['inspecteurs', 'exploitants'],
    message (evenement) {
      return `a publié une inspection.`
    }
  },
  demande_validation_inspection: {
    notifications: () => ['inspecteurs', 'approbateurs'],
    message (evenement) {
      return `a fait une demande de validation.`
    }
  },
  rejet_validation_inspection: {
    notifications: () => ['inspecteurs'],
    message (evenement) {
      return `a rejeté une demande de validation.`
    }
  },
  validation_inspection: {
    notifications: () => ['inspecteurs', 'exploitants'],
    message (evenement) {
      return `a validé une inspection.`
    }
  },
  cloture_inspection: {
    notifications: () => ['inspecteurs', 'exploitants'],
    message (evenement) {
      return `a clos une inspection.`
    }
  },

  // événements liés à une inspection
  modification_inspection: {
    notifications: () => ['inspecteurs'],
    message (evenement) {
      return `a modifié le détail de l'inspection.`
    }
  },
  creation_point_de_controle: {
    notifications: () => ['inspecteurs'],
    message (evenement) {
      return `a ajouté un point de contrôle.`
    }
  },
  modification_point_de_controle: {
    notifications: () => ['inspecteurs'],
    message (evenement) {
      return `a modifié un point de contrôle.`
    }
  },
  suppression_point_de_controle: {
    notifications: () => ['inspecteurs'],
    message (evenement) {
      return `a supprimé un point de contrôle.`
    }
  },
  publication_point_de_controle: {
    notifications: () => ['inspecteurs'],
    message (evenement) {
      return `a publié un point de contrôle.`
    }
  },
  creation_constat: {
    notifications: () => ['inspecteurs'],
    message (evenement) {
      return `a ajouté un constat.`
    }
  },
  suppression_constat: {
    notifications: () => ['inspecteurs'],
    message (evenement) {
      return `a supprimé un constat.`
    }
  },
  resolution_constat: {
    notifications: () => ['inspecteurs', 'exploitants'],
    message (evenement) {
      return `a résolu un constat.`
    }
  },
  creation_suite: {
    notifications: () => ['inspecteurs'],
    message (evenement) {
      return `a ajouté une suite.`
    }
  },
  modification_suite: {
    notifications: () => ['inspecteurs'],
    message (evenement) {
      return `a modifié une suite.`
    }
  },
  suppression_suite: {
    notifications: () => ['inspecteurs'],
    message (evenement) {
      return `a supprimé une suite.`
    }
  },
  commentaire_general: {
    notifications: () => ['inspecteurs'],
    message (evenement) {
      return `a posté un commentaire général.`
    }
  },
  commentaire: {
    notifications: () => ['inspecteurs'],
    message (evenement) {
      return `a posté un commentaire.`
    }
  },
  message: {
    notifications (api) {
      return api.store.getters.isExploitant ? ['inspecteurs'] : ['exploitants']
    },
    message (evenement) {
      return `a posté un message.`
    }
  },
  lecture_message: {
    notifications (api) {
      return api.store.getters.isExploitant ? ['inspecteurs'] : ['exploitants']
    },
    message (evenement) {
      return `a lu un message.`
    }
  }
}
