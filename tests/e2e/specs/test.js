// https://docs.cypress.io/api/introduction/api.html

// en attendant https://github.com/cypress-io/cypress/issues/566
const typeOptions = {
  delay: 2
}

describe("Fil'Harmonic", () => {
  it("Création d'une inspection", () => {
    // Login inspecteur 3
    cy.visit('/')
    cy.contains('div', 'Connexion')
    cy.visit('/login?ticket=ticket-3')

    // Recherche des établissements
    cy.contains('Établissements').click()
    cy.get('input[aria-label*="raison"]').type('Raison sociale 2', typeOptions)
    cy.get('input[aria-label*="Localisation"]').type('Nantes', typeOptions)
    cy.get('input[aria-label*="S3IC"]').type('451', typeOptions)
    cy.contains('Rechercher').click()

    // Sélection d'un établissement
    cy.contains('div[role="listitem"]', 'Raison sociale 2').click()

    // Création d'une inspection sur ce dernier
    cy.contains('Nouvelle inspection').click()
    cy.get('input[aria-label="Date"]').click()
    cy.contains('chevron_right').click()
    cy.wait(500)
    cy.contains('.v-picker .v-btn__content', '10').click()
    cy.get('input[placeholder*="Thèmes"]').click()
    cy.contains('.menuable__content__active div[role="listitem"]', 'Produits chimiques').click()
    cy.contains('.menuable__content__active div[role="listitem"]', 'Incendie').click()
    cy.document().then(document => document.querySelector('.v-select--is-menu-active').__vue__.blur())
    cy.get('textarea').type('Contexte inspection', typeOptions)
    cy.contains("Créer l'inspection").click()

    // Ajout d'un point de contrôle
    cy.contains('Ajouter un point de contrôle').click()
    cy.get('input[aria-label="Sujet"]').type('Point de contrôle 1', typeOptions)
    cy.get('input[aria-label="Référence réglementaire"]').type('Référence réglementaire 1', typeOptions)
    cy.contains('Nouvelle référence réglementaire').click()
    cy.get('input[aria-label="Référence réglementaire"]').last().type('Référence réglementaire 2', typeOptions)
    cy.contains('Ajouter').click()

    // Publication du point de contrôle
    cy.get('button[title="Éditer/supprimer"]').click()
    cy.contains('.menuable__content__active button', 'Publier').click()

    // Ajout d'un message
    cy.get('.fh-point-de-controle button[title="Déplier/replier"]').first().click()
    cy.contains('button', 'Nouveau message').click()
    cy.get('textarea[aria-label="Message"]').type('Pourriez-vous me transmettre le dernier relevé de NOx?', typeOptions)
    cy.get('input[aria-label="Interne"] + div').click()
    cy.upload_file('pdf-sample.pdf', 'application/pdf', 'input[type=file]')
    cy.wait(500)
    cy.get('button[title="Envoyer"]').click()

    // Ajout d'un commentaire
    cy.contains('Commentaires').click()
    cy.contains('button', 'Nouveau commentaire').click()
    cy.get('textarea[aria-label="Message"]').type('Problème de NOx à surveiller', typeOptions)
    cy.upload_file('pdf-sample.pdf', 'application/pdf', 'input[type=file]')
    cy.wait(200)
    cy.get('button[title="Envoyer"]').click()

    // Onglets
    cy.contains('Récapitulatif').click()
    cy.contains('Activité').click()
    cy.contains('Détails').click()

    // Modification de l'inspection
    cy.get(`a[title="Modifier l'inspection"]`).click()
    cy.get('input[aria-label="Ponctuel"] + div').click()
    cy.get('input[aria-label="Annoncé"] + div').click()
    cy.get('input[aria-label="Circonstancielle"] + div').click()
    cy.contains('Sauvegarder').click()
    cy.wait(1000)

    // Onglet
    cy.contains('Points de contrôle').click()

    // Ajout d'un 2e point de contrôle
    cy.contains('Ajouter un point de contrôle').click()
    cy.get('input[aria-label="Sujet"]').type('Point de contrôle 2', typeOptions)
    cy.get('input[aria-label="Référence réglementaire"]').type('Référence réglementaire 2', typeOptions)
    cy.contains('Ajouter').click()
    cy.wait(1000)

    // Publication du 2e point de contrôle
    cy.get('button[title="Éditer/supprimer"]').eq(1).click()
    cy.contains('.menuable__content__active button', 'Publier').click()

    // Publication de l'inspection
    cy.get('button[title="Publier"]').click()

    // Enregistrer en canevas
    cy.get('button[title="Afficher le menu"]').first().click()
    cy.contains('.menuable__content__active a', 'Enregistrer en canevas').click()
    cy.get('.v-dialog--active input[aria-label="Nom"]').type('Canevas test ' + new Date().getTime(), typeOptions)
    cy.get('.v-dialog--active button[title="Enregistrer"]').click()

    // Mettre l'inspection en favori
    cy.get('button[title="Mettre en favoris"]').click()

    // Logout
    cy.get('button[title="Mon compte"]').click()
    cy.contains('button', 'Déconnexion').click()

    // Login exploitant 1
    cy.contains('div', 'Connexion')
    cy.visit('/login?ticket=ticket-1')

    // Sélection de l'inspection
    cy.get('.v-window-item:first-child .fh-inspection-item:last-child').click()

    cy.get('.fh-point-de-controle button[title="Déplier/replier"]').first().click()

    // Lire un message
    cy.get('button[title="Marquer comme lu"]').first().click()

    // Ajout d'un message
    cy.contains('button', 'Nouveau message').first().click()
    cy.get('.v-dialog--active textarea[aria-label="Message"]').type('Voici le dernier relevé de NOx.', typeOptions)
    cy.upload_file('pdf-sample.pdf', 'application/pdf', '.v-dialog--active input[type=file]')
    cy.wait(500)
    cy.get('.v-dialog--active button[title="Envoyer"]').click()

    // Logout
    cy.get('button[title="Mon compte"]').click()
    cy.contains('button', 'Déconnexion').click()

    // Login inspecteur 3
    cy.contains('div', 'Connexion')
    cy.visit('/login?ticket=ticket-3')

    // Sélection de l'inspection
    cy.get('.v-window-item:first-child .fh-inspection-item:last-child').click()

    // Ajout d'un constat conforme sur le 1er point de contrôle
    cy.get('.fh-point-de-controle button[title="Déplier/replier"]').first().click()
    cy.contains('Ajouter un constat').first().click()
    cy.contains('.fh-constat button', 'Sauvegarder le constat').click()
    cy.wait(500)

    // Modification du 1er constat
    cy.get('button[title="Éditer/supprimer"]').first().click()
    cy.wait(500)
    cy.contains('.menuable__content__active button', 'Modifier le constat').click()
    cy.get('.fh-point-de-controle textarea[aria-label="Remarques"]').type('Nouveau constat', typeOptions)
    cy.get('.fh-point-de-controle button[title="Mettre à jour"]').first().click()

    // Ajout d'un constat non conforme sur le 2eme point de contrôle
    cy.get('.fh-point-de-controle button[title="Déplier/replier"]').last().click()
    cy.contains('Ajouter un constat').last().click()
    cy.get('.fh-constat input[aria-label="Non conforme"] + div').click()
    cy.get('.fh-constat textarea[aria-label="Remarques"]').type('Seuil de NOx dépassé de beaucoup.', typeOptions)
    cy.contains('.fh-constat button', 'Sauvegarder le constat').click()

    // Ajout d'une suite
    cy.contains('button', 'Ajouter une suite').click()
    cy.contains('.fh-suite button', 'Ajouter').click()

    // Demande de validation
    cy.contains('button', 'Demander une validation').click()

    // Logout
    cy.get('button[title="Mon compte"]').click()
    cy.contains('button', 'Déconnexion').click()

    // Login approbateur 6
    cy.contains('div', 'Connexion')
    cy.visit('/login?ticket=ticket-6')

    // Sélection de l'inspection en attente de validation
    cy.get('.v-window-item:first-child .fh-inspection-item:last-child').click()
    cy.wait(500)

    // Validation de l'inspection
    cy.get('button[title="Accepter la demande de validation"]').click()
    cy.upload_file('pdf-sample.pdf', 'application/pdf', '.v-dialog--active input[type=file]')
    cy.get('.v-dialog--active button[title="Valider"]').click()

    // Logout
    cy.get('button[title="Mon compte"]').click()
    cy.contains('button', 'Déconnexion').click()
    cy.contains('div', 'Connexion')

    // Login exploitant 1
    cy.visit('/login?ticket=ticket-1')

    // Sélection de l'inspection
    cy.contains('.fh-tab', 'Traitement des non-conformités').click()
    cy.wait(500)
    cy.get('.v-window-item:nth-child(2) .fh-inspection-item:last-child').click()

    cy.get('.fh-point-de-controle button[title="Déplier/replier"]').last().click()

    // Ajout d'un message
    cy.contains('button', 'Nouveau message').first().click()
    cy.get('.v-dialog--active textarea[aria-label="Message"]').type('Voici la facture de réparation.', typeOptions)
    cy.upload_file('pdf-sample.pdf', 'application/pdf', '.v-dialog--active input[type=file]')
    cy.wait(500)
    cy.get('.v-dialog--active button[title="Envoyer"]').click()

    // Logout
    cy.get('button[title="Mon compte"]').click()
    cy.contains('button', 'Déconnexion').click()

    // Login inspecteur 3
    cy.visit('/login?ticket=ticket-3')

    // Sélection de l'inspection
    cy.contains('.fh-tab', 'Traitement des non-conformités').click()
    cy.wait(500)
    cy.get('.v-window-item:nth-child(3) .fh-inspection-item:last-child').click()

    // Résolution d'un constat
    cy.get('.fh-point-de-controle button[title="Résoudre la non-conformité"]').first().click()

    // Clôture de l'inspection
    cy.get(`button[title="Clore l'inspection"]`).click()
  })
})
